from __future__ import annotations

import json
import time
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import torch
from datasets import Dataset, load_dataset
from peft import PeftModel
from sklearn.metrics import accuracy_score, confusion_matrix, precision_recall_fscore_support
from transformers import AutoModelForSequenceClassification, AutoTokenizer

from assignment7_roberta import (
    DEFAULT_MAX_LENGTH,
    DEFAULT_MODEL_NAME,
    SUBJ_TEST_PATH,
    _get_device,
    _normalize_columns,
)

# Use a non-interactive backend for environments without a display server.
matplotlib.use("Agg")


@dataclass
class PerClassMetrics:
    label_id: int
    label_name: str
    precision: float
    recall: float
    f1: float
    support: int


class Assignment8Evaluator:
    """
    Evaluate the Assignment 7 fine-tuned classifier on the held-out test split.
    Computes macro metrics, a normalized confusion matrix, and light error analysis.
    """

    def __init__(self) -> None:
        self.repo_root = Path(__file__).resolve().parent.parent
        self.public_dir = self.repo_root / "public"
        self.checkpoints_root = Path(__file__).resolve().parent / "outputs" / "assignment7_roberta"
        self.default_confusion_path = self.public_dir / "visualizations" / "static" / "assignment8_confusion_matrix.png"
        self.tokenizer = AutoTokenizer.from_pretrained(DEFAULT_MODEL_NAME)
        self.device = _get_device()
        self._cached_result: Optional[Dict[str, Any]] = None
        self._cache_key: Optional[Tuple[Any, ...]] = None

    def _resolve_checkpoint(self, checkpoint: Optional[str]) -> Path:
        """
        Pick the best available adapter checkpoint based on eval_f1 recorded in trainer_state.json.
        """
        if checkpoint:
            preferred = (self.checkpoints_root / checkpoint).resolve()
            if preferred.exists():
                return preferred

        best: Tuple[float, Path] | None = None
        for state_path in self.checkpoints_root.glob("checkpoint-*/trainer_state.json"):
            try:
                state = json.loads(state_path.read_text())
            except json.JSONDecodeError:
                continue

            log_history = state.get("log_history", [])
            f1_scores = [entry["eval_f1"] for entry in log_history if "eval_f1" in entry]
            if not f1_scores:
                continue
            candidate_f1 = max(f1_scores)
            checkpoint_ref = state.get("best_model_checkpoint") or str(state_path.parent)
            candidate_path = Path(checkpoint_ref)
            if not candidate_path.is_absolute():
                candidate_path = (self.repo_root / checkpoint_ref).resolve()

            if not candidate_path.exists():
                continue

            if best is None or candidate_f1 > best[0]:
                best = (candidate_f1, candidate_path)

        if best:
            return best[1]

        fallback = self.checkpoints_root / "checkpoint-1125"
        if fallback.exists():
            return fallback

        raise FileNotFoundError("No adapter checkpoint found in outputs/assignment7_roberta.")

    @staticmethod
    def _load_local_test_split() -> Dataset:
        if SUBJ_TEST_PATH.exists():
            ds = load_dataset("json", data_files={"test": str(SUBJ_TEST_PATH)})["test"]
            return _normalize_columns(ds)
        # Fall back to the small bundled sample if the cached test split is missing.
        bundled = Path(__file__).resolve().parent / "data" / "assignment7" / "news_fact_opinion.jsonl"
        ds = load_dataset("json", data_files={"test": str(bundled)})["test"]
        return _normalize_columns(ds)

    def _load_test_dataset(
        self, dataset_name: Optional[str], seed: int, max_samples: Optional[int]
    ) -> Tuple[Dataset, Dict[str, Any]]:
        notes: List[str] = []
        dataset: Optional[Dataset] = None
        source: str = "local"

        if dataset_name:
            try:
                dataset = load_dataset(dataset_name, split="test")
                notes.append(f"Loaded test split from hub dataset: {dataset_name}")
                source = dataset_name
            except Exception as exc:  # noqa: BLE001
                notes.append(f"Fell back to cached local test split: {exc}")

        if dataset is None:
            dataset = self._load_local_test_split()
            source = SUBJ_TEST_PATH.name if SUBJ_TEST_PATH.exists() else "news_fact_opinion.jsonl"

        dataset = _normalize_columns(dataset)
        if max_samples and len(dataset) > max_samples:
            dataset = dataset.shuffle(seed=seed).select(range(max_samples))
            notes.append(f"Truncated test set to {len(dataset)} rows for quick evaluation.")

        label_counts = {
            "factual": int(sum(1 for label in dataset["label"] if label == 0)),
            "opinion": int(sum(1 for label in dataset["label"] if label == 1)),
        }

        meta = {
            "source": source,
            "num_rows": len(dataset),
            "class_distribution": label_counts,
            "notes": notes,
        }
        return dataset, meta

    def _batch_predict(
        self,
        model: PeftModel,
        dataset: Dataset,
        max_length: int,
        batch_size: int = 32,
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        texts = dataset["text"]
        labels = np.array(dataset["label"], dtype=np.int64)
        all_probs: List[np.ndarray] = []
        model.eval()

        for start in range(0, len(texts), batch_size):
            end = start + batch_size
            batch_texts = texts[start:end]
            encoded = self.tokenizer(
                batch_texts,
                truncation=True,
                padding=True,
                max_length=max_length,
                return_tensors="pt",
            ).to(self.device)

            with torch.no_grad():
                outputs = model(**encoded)
                probs = torch.softmax(outputs.logits, dim=-1).detach().cpu().numpy()
            all_probs.append(probs)

        prob_array = np.vstack(all_probs)
        preds = prob_array.argmax(axis=1)
        return preds, prob_array, labels

    @staticmethod
    def _plot_confusion(normalized: np.ndarray, labels: List[str], output_path: Path) -> None:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        fig, ax = plt.subplots(figsize=(5, 4))
        percent_matrix = normalized * 100
        im = ax.imshow(percent_matrix, cmap="Blues", vmin=0, vmax=100)

        for i in range(percent_matrix.shape[0]):
            for j in range(percent_matrix.shape[1]):
                ax.text(
                    j,
                    i,
                    f"{percent_matrix[i, j]:.1f}",
                    ha="center",
                    va="center",
                    color="black",
                    fontsize=10,
                )

        ax.set_xticks(range(len(labels)))
        ax.set_yticks(range(len(labels)))
        ax.set_xticklabels(labels)
        ax.set_yticklabels(labels)
        ax.set_xlabel("Predicted")
        ax.set_ylabel("True")
        cbar = fig.colorbar(im, ax=ax)
        cbar.set_label("Percent of true class")
        fig.tight_layout()
        fig.savefig(output_path, dpi=200)
        plt.close(fig)

    @staticmethod
    def _infer_reason(text: str, true_label: str, predicted_label: str) -> str:
        lower = text.lower()
        subjective_cues = {"think", "believe", "feel", "opinion", "probably", "seems"}
        factual_cues = {"percent", "%", "reported", "announced", "according", "data"}

        if true_label == "factual" and predicted_label == "opinion":
            if any(word in lower for word in subjective_cues):
                return "Contains subjective cue words that overwhelmed factual phrasing."
            return "Text blends facts with speculative language, confusing the boundary."

        if true_label == "opinion" and predicted_label == "factual":
            if any(word in lower for word in factual_cues):
                return "Opinion framed with factual phrasing (numbers or reporting verbs)."
            return "Statement is concise and declarative, hiding its subjective nature."

        return "Ambiguous wording makes the statement hard to categorize."

    def evaluate(
        self,
        dataset_name: Optional[str] = None,
        max_length: int = DEFAULT_MAX_LENGTH,
        checkpoint: Optional[str] = None,
        seed: int = 42,
        max_samples: Optional[int] = None,
    ) -> Dict[str, Any]:
        cache_key = (dataset_name or "local", max_length, checkpoint or "auto", seed, max_samples or -1)
        if self._cached_result and self._cache_key == cache_key:
            return self._cached_result

        start = time.time()
        checkpoint_path = self._resolve_checkpoint(checkpoint)
        base_model = AutoModelForSequenceClassification.from_pretrained(
            DEFAULT_MODEL_NAME,
            num_labels=2,
        )
        peft_model = PeftModel.from_pretrained(base_model, checkpoint_path).to(self.device)

        test_dataset, dataset_meta = self._load_test_dataset(dataset_name, seed, max_samples)
        preds, prob_array, labels = self._batch_predict(peft_model, test_dataset, max_length)

        acc = accuracy_score(labels, preds)
        precision_macro, recall_macro, f1_macro, _ = precision_recall_fscore_support(
            labels, preds, average="macro", zero_division=0
        )
        precision_per_class, recall_per_class, f1_per_class, support = precision_recall_fscore_support(
            labels, preds, average=None, zero_division=0
        )

        per_class = [
            PerClassMetrics(
                label_id=i,
                label_name="factual" if i == 0 else "opinion",
                precision=float(precision_per_class[i]),
                recall=float(recall_per_class[i]),
                f1=float(f1_per_class[i]),
                support=int(support[i]),
            )
            for i in range(len(precision_per_class))
        ]

        cm_raw = confusion_matrix(labels, preds, labels=[0, 1])
        cm_normalized = confusion_matrix(labels, preds, labels=[0, 1], normalize="true")
        self._plot_confusion(cm_normalized, ["factual", "opinion"], self.default_confusion_path)

        worst_idx = int(np.argmin(f1_per_class))
        worst_label = "factual" if worst_idx == 0 else "opinion"
        misclassified_mask = (labels == worst_idx) & (preds != worst_idx)
        misclassified_indices = np.where(misclassified_mask)[0].tolist()[:2]

        error_examples = []
        for idx in misclassified_indices:
            text = test_dataset[idx]["text"]
            predicted_id = int(preds[idx])
            predicted_label = "factual" if predicted_id == 0 else "opinion"
            score = float(prob_array[idx][predicted_id])
            error_examples.append(
                {
                    "text": text,
                    "true_label": worst_label,
                    "predicted_label": predicted_label,
                    "predicted_score": score,
                    "reason": self._infer_reason(text, worst_label, predicted_label),
                }
            )

        result = {
            "checkpoint": str(checkpoint_path.relative_to(self.repo_root)),
            "dataset": dataset_meta,
            "metrics": {
                "accuracy": float(acc),
                "precision_macro": float(precision_macro),
                "recall_macro": float(recall_macro),
                "f1_macro": float(f1_macro),
                "per_class": [asdict(item) for item in per_class],
            },
            "confusion_matrix": {
                "labels": ["factual", "opinion"],
                "normalized": cm_normalized.tolist(),
                "raw": cm_raw.tolist(),
                "image_path": "/visualizations/static/assignment8_confusion_matrix.png",
            },
            "error_analysis": {
                "worst_class": next(item for item in per_class if item.label_id == worst_idx).__dict__,
                "examples": error_examples,
                "rationale": "F1 highlights balance between precision and recall; the worst class shows where the model hesitates.",
            },
            "runtime_seconds": round(time.time() - start, 2),
        }

        self._cache_key = cache_key
        self._cached_result = result
        return result
