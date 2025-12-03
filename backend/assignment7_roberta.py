from __future__ import annotations

import logging
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import torch
from datasets import ClassLabel, Dataset, DatasetDict, concatenate_datasets, load_dataset
from peft import LoraConfig, get_peft_model
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
    DataCollatorWithPadding,
    Trainer,
    TrainingArguments,
)

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

DATA_PATH = Path(__file__).parent / "data" / "assignment7" / "news_fact_opinion.jsonl"
DEFAULT_MODEL_NAME = "roberta-base"
DEFAULT_MAX_LENGTH = 256
DEFAULT_DATASET_NAME = "SetFit/subj"
DEFAULT_CLASSIFICATION_THRESHOLD = 0.5
SUBJ_TRAIN_PATH = Path(__file__).parent / "data" / "assignment7" / "setfit_subj_train.jsonl"
SUBJ_TEST_PATH = Path(__file__).parent / "data" / "assignment7" / "setfit_subj_test.jsonl"


def _get_device() -> torch.device:
    if torch.cuda.is_available():
        return torch.device("cuda")
    if getattr(torch.backends, "mps", None) and torch.backends.mps.is_available():
        return torch.device("mps")
    return torch.device("cpu")


def _normalize_columns(dataset: Dataset) -> Dataset:
    """Ensure the dataset has `text` and `label` columns with binary labels."""
    text_col = None
    for candidate in ["text", "sentence", "statement", "claim", "content"]:
        if candidate in dataset.column_names:
            text_col = candidate
            break
    if text_col is None:
        raise ValueError(f"No text column found in dataset columns: {dataset.column_names}")

    label_col = None
    for candidate in ["label", "labels", "target", "class"]:
        if candidate in dataset.column_names:
            label_col = candidate
            break
    if label_col is None:
        raise ValueError(f"No label column found in dataset columns: {dataset.column_names}")

    ds = dataset.rename_columns({text_col: "text", label_col: "label"})

    def _cast_label(example: Dict[str, Any]) -> Dict[str, Any]:
        label = example["label"]
        if isinstance(label, bool):
            value = int(label)
        elif isinstance(label, (int, np.integer)):
            value = int(label)
        elif isinstance(label, str):
            lowered = label.lower()
            if lowered in {"factual", "fact", "objective"}:
                value = 0
            elif lowered in {"opinion", "subjective"}:
                value = 1
            else:
                raise ValueError(f"Unrecognized label string: {label}")
        else:
            raise ValueError(f"Unsupported label type: {type(label)}")

        label_text = "opinion" if value == 1 else "factual"
        return {"label": value, "label_text": label_text}

    ds = ds.map(_cast_label)
    # Stratified splits require a ClassLabel column; cast after normalization.
    class_label = ClassLabel(names=["factual", "opinion"])
    ds = ds.cast_column("label", class_label)
    return ds


def _load_news_dataset(
    dataset_name: Optional[str],
    seed: int,
    max_samples: int,
) -> Tuple[DatasetDict, Dict[str, Any]]:
    """
    Load a factual vs opinion dataset. Defaults to the HF hub SetFit/subj dataset,
    falling back to the bundled jsonl sample if download fails.
    """
    notes: List[str] = []
    target_dataset = dataset_name or DEFAULT_DATASET_NAME

    def _load_local_subj() -> DatasetDict:
        files = {}
        if SUBJ_TRAIN_PATH.exists():
            files["train"] = str(SUBJ_TRAIN_PATH)
        if SUBJ_TEST_PATH.exists():
            files["test"] = str(SUBJ_TEST_PATH)
        if not files:
            raise FileNotFoundError("No local SetFit/subj cache found.")
        return load_dataset("json", data_files=files)

    try:
        logger.info("Loading dataset from hub: %s", target_dataset)
        raw = load_dataset(target_dataset)
        notes.append(f"Loaded dataset from hub: {target_dataset}")
    except Exception as exc:  # noqa: BLE001
        if target_dataset == DEFAULT_DATASET_NAME:
            try:
                raw = _load_local_subj()
                notes.append(f"Loaded cached SetFit/subj from local files ({SUBJ_TRAIN_PATH.name})")
            except Exception as cache_exc:  # noqa: BLE001
                logger.warning("Failed local SetFit/subj cache: %s", cache_exc)
                logger.warning("Falling back to bundled sample: %s", exc)
                raw = load_dataset("json", data_files={"train": str(DATA_PATH)})
                notes.append(
                    f"Fell back to bundled dataset because SetFit/subj was unavailable ({exc}) "
                    f"and local cache missing ({cache_exc})"
                )
        else:
            logger.warning("Failed to load %s, using bundled sample: %s", target_dataset, exc)
            raw = load_dataset("json", data_files={"train": str(DATA_PATH)})
            notes.append(
                f"Fell back to bundled dataset because hub load failed: {target_dataset} ({exc})"
            )

    if isinstance(raw, Dataset):
        ds_dict = DatasetDict({"train": raw})
    else:
        ds_dict = DatasetDict({k: v for k, v in raw.items()})

    base = ds_dict["train"]
    base = _normalize_columns(base)

    # If there are other splits, merge for a unified stratified split.
    merged = base
    if "validation" in ds_dict:
        merged = concatenate_datasets([merged, _normalize_columns(ds_dict["validation"])])
    if "test" in ds_dict:
        merged = concatenate_datasets([merged, _normalize_columns(ds_dict["test"])])

    # Limit dataset size while keeping classes balanced.
    merged = merged.shuffle(seed=seed)
    labels = list(set(merged["label"]))
    if labels != [0, 1] and sorted(labels) != [0, 1]:
        unique = sorted(labels)
        raise ValueError(f"Dataset must be binary labeled (0/1). Found labels: {unique}")

    if max_samples and len(merged) > max_samples:
        per_class_target = max_samples // 2
        factual = merged.filter(lambda ex: ex["label"] == 0)
        opinion = merged.filter(lambda ex: ex["label"] == 1)
        factual = factual.select(range(min(len(factual), per_class_target)))
        opinion = opinion.select(range(min(len(opinion), per_class_target)))
        merged = concatenate_datasets([factual, opinion])
        merged = merged.shuffle(seed=seed)
        notes.append(f"Downsampled dataset to ~{len(merged)} rows for quick training.")

    splits = merged.train_test_split(test_size=0.2, seed=seed, stratify_by_column="label")
    train_val = splits["train"].train_test_split(test_size=0.25, seed=seed, stratify_by_column="label")

    final_ds = DatasetDict(
        {
            "train": train_val["train"],
            "validation": train_val["test"],
            "test": splits["test"],
        }
    )

    class_distribution = {
        split: {
            "factual": int(sum(1 for label in split_ds["label"] if label == 0)),
            "opinion": int(sum(1 for label in split_ds["label"] if label == 1)),
            "total": len(split_ds),
        }
        for split, split_ds in final_ds.items()
    }

    meta = {
        "source": target_dataset if target_dataset else DATA_PATH.name,
        "num_rows": len(merged),
        "class_distribution": class_distribution,
        "notes": notes,
    }
    return final_ds, meta


@dataclass
class PredictionResult:
    text: str
    predicted_label: str
    score: float
    label_id: int


class RobertaLoraPipeline:
    """Encapsulates dataset prep, LoRA injection, training, and inference."""

    def __init__(
        self,
        max_length: int = DEFAULT_MAX_LENGTH,
        classification_threshold: float = DEFAULT_CLASSIFICATION_THRESHOLD,
    ) -> None:
        self.max_length = max_length
        self.classification_threshold = classification_threshold
        self.device = _get_device()
        self.tokenizer = AutoTokenizer.from_pretrained(DEFAULT_MODEL_NAME)
        self.base_model = AutoModelForSequenceClassification.from_pretrained(
            DEFAULT_MODEL_NAME,
            num_labels=2,
        ).to(self.device)
        self.peft_model = None
        self.data_collator = DataCollatorWithPadding(tokenizer=self.tokenizer)
        self.tokenized: Optional[DatasetDict] = None
        self.dataset_meta: Dict[str, Any] = {}
        self.trained = False

    def prepare_lora_model(
        self,
        r: int = 8,
        alpha: int = 16,
        dropout: float = 0.05,
    ):
        lora_config = LoraConfig(
            r=r,
            lora_alpha=alpha,
            target_modules=["query", "value"],
            lora_dropout=dropout,
            bias="none",
            task_type="SEQ_CLS",
        )
        self.peft_model = get_peft_model(self.base_model, lora_config)
        self.peft_model.to(self.device)
        logger.info("Prepared LoRA model with r=%s alpha=%s dropout=%s", r, alpha, dropout)
        return lora_config

    def load_and_tokenize(
        self,
        dataset_name: Optional[str],
        seed: int,
        max_samples: int,
    ):
        dataset, meta = _load_news_dataset(dataset_name, seed, max_samples)
        self.dataset_meta = meta

        def tokenize(batch: Dict[str, Any]) -> Dict[str, Any]:
            return self.tokenizer(
                batch["text"],
                truncation=True,
                padding=False,
                max_length=self.max_length,
            )

        tokenized = dataset.map(tokenize, batched=True)
        self.tokenized = tokenized
        return dataset

    @staticmethod
    def _compute_metrics(eval_pred) -> Dict[str, float]:
        logits, labels = eval_pred
        predictions = np.argmax(logits, axis=-1)
        accuracy = accuracy_score(labels, predictions)
        precision, recall, f1, _ = precision_recall_fscore_support(
            labels,
            predictions,
            average="binary",
            zero_division=0,
        )
        return {
            "accuracy": float(accuracy),
            "precision": float(precision),
            "recall": float(recall),
            "f1": float(f1),
        }

    def _baseline_majority(self, dataset: Dataset) -> Dict[str, Any]:
        labels = list(dataset["label"])
        majority = 1 if labels.count(1) >= labels.count(0) else 0
        accuracy = labels.count(majority) / len(labels)
        return {
            "strategy": "majority-class",
            "majority_label": majority,
            "predicted_label": "opinion" if majority == 1 else "factual",
            "accuracy": float(accuracy),
        }

    @staticmethod
    def _clean_metrics(metrics: Dict[str, Any], prefix: str = "eval_") -> Dict[str, Any]:
        cleaned = {}
        for key, value in metrics.items():
            if key.startswith(prefix):
                cleaned[key[len(prefix) :]] = value
            else:
                cleaned[key] = value
        return cleaned

    def train(
        self,
        dataset_name: Optional[str] = None,
        seed: int = 42,
        max_samples: int = 1000,
        num_train_epochs: float = 10.0,
        learning_rate: float = 5e-4,
        weight_decay: float = 0.01,
        warmup_ratio: float = 0.06,
        label_smoothing: float = 0.05,
        per_device_train_batch_size: int = 16,
        gradient_accumulation_steps: int = 1,
        max_length: int = 256,
        lora_r: int = 32,
        lora_alpha: int = 64,
        lora_dropout: float = 0.1,
        classification_threshold: float = 0.5,
    ) -> Dict[str, Any]:
        self.max_length = max_length
        self.classification_threshold = classification_threshold
        lora_config = self.prepare_lora_model(r=lora_r, alpha=lora_alpha, dropout=lora_dropout)
        dataset = self.load_and_tokenize(dataset_name, seed, max_samples)
        if self.tokenized is None:
            raise RuntimeError("Tokenized dataset missing after preprocessing.")

        args = TrainingArguments(
            output_dir=str(Path("outputs") / "assignment7_roberta"),
            evaluation_strategy="epoch",
            save_strategy="epoch",
            learning_rate=learning_rate,
            num_train_epochs=num_train_epochs,
            per_device_train_batch_size=per_device_train_batch_size,
            per_device_eval_batch_size=per_device_train_batch_size,
            gradient_accumulation_steps=gradient_accumulation_steps,
            warmup_ratio=warmup_ratio,
            label_smoothing_factor=label_smoothing,
            weight_decay=weight_decay,
            load_best_model_at_end=True,
            metric_for_best_model="f1",
            logging_steps=10,
            seed=seed,
            report_to=[],
        )

        trainer = Trainer(
            model=self.peft_model,
            args=args,
            train_dataset=self.tokenized["train"],
            eval_dataset=self.tokenized["validation"],
            tokenizer=self.tokenizer,
            data_collator=self.data_collator,
            compute_metrics=self._compute_metrics,
        )

        train_output = trainer.train()
        eval_metrics = self._clean_metrics(trainer.evaluate(self.tokenized["validation"]))
        test_metrics = self._clean_metrics(trainer.evaluate(self.tokenized["test"]))
        baseline = self._baseline_majority(dataset["test"])

        self.trained = True
        self.peft_model.eval()

        sample_predictions = [
            self.predict(example["text"]) for example in dataset["test"].select(range(min(3, len(dataset["test"]))))
        ]

        return {
            "train_metrics": {
                "training_loss": float(train_output.training_loss) if train_output.training_loss is not None else None,
                "epochs": num_train_epochs,
                "samples_trained": len(self.tokenized["train"]),
            },
            "eval_metrics": eval_metrics,
            "test_metrics": test_metrics,
            "baseline_metrics": baseline,
            "lora_config": {
                "r": lora_config.r,
                "alpha": lora_config.lora_alpha,
                "dropout": lora_config.lora_dropout,
                "target_modules": lora_config.target_modules,
            },
            "label_smoothing": label_smoothing,
            "classification_threshold": classification_threshold,
            "dataset": self.dataset_meta,
            "sample_predictions": [asdict(pred) for pred in sample_predictions],
        }

    def predict(self, text: str) -> PredictionResult:
        if self.peft_model is None:
            self.prepare_lora_model()
        self.peft_model.eval()
        inputs = self.tokenizer(
            text,
            truncation=True,
            padding=True,
            max_length=self.max_length,
            return_tensors="pt",
        ).to(self.device)

        with torch.no_grad():
            outputs = self.peft_model(**inputs)
            logits = outputs.logits.detach().cpu().numpy()[0]
            probs = torch.softmax(torch.tensor(logits), dim=-1).numpy()
            opinion_prob = float(probs[1])
            factual_prob = float(probs[0])
            label_id = 1 if opinion_prob >= self.classification_threshold else 0
            score = opinion_prob if label_id == 1 else factual_prob

        predicted_label = "opinion" if label_id == 1 else "factual"
        return PredictionResult(
            text=text,
            predicted_label=predicted_label,
            score=score,
            label_id=label_id,
        )
