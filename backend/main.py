from __future__ import annotations
from dataclasses import asdict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
#from mnist_fnn import train_and_evaluate_api, predict_digit
from typing import List, Optional
import os
from pydantic import BaseModel, Field

from llm_model import generate_text
from assignment7_roberta import RobertaLoraPipeline
from assignment8_evaluation import Assignment8Evaluator
from rag_dnd import rag_dnd_answer


app = FastAPI(title="AD331 AI Course Backend", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Assignment(BaseModel):
    assignment_number: int
    title: str
    description: str
    status: str = "pending"  # pending, in_progress, completed
    files: List[str] = []

class AssignmentModule(BaseModel):
    assignment_number: int
    title: str
    description: str
    assignments: List[Assignment] = []

class LLMGenerateRequest(BaseModel):
    prompt: str = Field(..., description="Input text prompt for the LLM.")
    max_new_tokens: int = Field(100, ge=1, le=3000)
    temperature: float = Field(0.7, gt=0.0, le=2.0)
    top_p: float = Field(0.9, gt=0.0, le=1.0)

class RAGRulesRequest(BaseModel):
    question: str


class RAGChunk(BaseModel):
    id: int
    text: str
    score: float


class RAGRulesResponse(BaseModel):
    question: str
    answer: str
    retrieved_chunks: List[RAGChunk]

class LLMGenerateResponse(BaseModel):
    prompt: str
    generated_text: str
    max_new_tokens: int
    temperature: float
    top_p: float

# --- Request / response models ---

class TrainRequest(BaseModel):
    epochs: int = 5
    batch_size: int = 128
    hidden_units: int = 128

class TrainResponse(BaseModel):
    history: dict
    test_loss: float
    test_accuracy: float

class PredictRequest(BaseModel):
    # 28 x 28 list of lists sent from frontend
    image: list[list[float]]

class PredictResponse(BaseModel):
    predicted_class: int
    probabilities: list[float]


class Assignment7TrainRequest(BaseModel):
    dataset_name: Optional[str] = Field(
        "SetFit/subj",
        description="Hugging Face dataset name. Defaults to SetFit/subj; leave blank to use the bundled fallback.",
    )
    max_samples: int = Field(
        1000,
        ge=10,
        description="Limit rows for quick fine-tuning while keeping splits balanced.",
    )
    num_train_epochs: float = Field(10.0, gt=0, description="Epochs for LoRA fine-tuning.")
    learning_rate: float = Field(5e-4, gt=0, description="Learning rate for AdamW.")
    weight_decay: float = Field(0.01, ge=0, description="Weight decay for AdamW.")
    warmup_ratio: float = Field(0.06, ge=0, le=1, description="Linear warmup ratio.")
    label_smoothing: float = Field(0.05, ge=0, le=1, description="Label smoothing factor.")
    per_device_train_batch_size: int = Field(16, ge=1, description="Batch size per device.")
    gradient_accumulation_steps: int = Field(
        1, ge=1, description="Accumulate gradients to simulate a larger batch."
    )
    max_length: int = Field(256, ge=64, le=512, description="Max tokens for truncation.")
    lora_r: int = Field(32, ge=1, description="LoRA rank.")
    lora_alpha: int = Field(64, ge=1, description="LoRA alpha scaling.")
    lora_dropout: float = Field(0.1, ge=0.0, le=0.5, description="LoRA dropout.")
    classification_threshold: float = Field(
        0.5, ge=0.0, le=1.0, description="Probability threshold for predicting opinion."
    )
    seed: int = Field(42, description="Seed for shuffling/splitting.")


class Assignment7PredictRequest(BaseModel):
    text: str = Field(..., description="News statement to classify as factual vs opinion.")

class Assignment8EvalRequest(BaseModel):
    checkpoint: Optional[str] = Field(
        None,
        description="Relative checkpoint directory under outputs/assignment7_roberta (e.g., checkpoint-1125). Leave blank to auto-select best eval_f1.",
    )
    dataset_name: Optional[str] = Field(
        None,
        description="Optional HF dataset name to pull the test split from. Defaults to the cached Assignment 7 test split.",
    )
    max_length: int = Field(256, ge=64, le=512, description="Max token length for evaluation.")
    seed: int = Field(42, description="Shuffle seed for any sampling.")
    max_samples: Optional[int] = Field(
        None,
        ge=10,
        description="Optional cap on the number of test rows to evaluate (useful for quick smoke tests).",
    )

# --- Data ---
assignment_modules: dict = {}  # Placeholder for assignment module data
assignment7_runner = RobertaLoraPipeline()
assignment8_evaluator = Assignment8Evaluator()

# --- Endpoints ---

@app.get("/")
async def root():
    return {"message": "AD331 AI Course Backend API"}

@app.get("/assignment-modules")
async def get_assignment_modules():
    return list(assignment_modules.values())

@app.get("/assignment-modules/{assignment_number}")
async def get_assignment_module(assignment_number: int):
    if assignment_number not in assignment_modules:
        raise HTTPException(status_code=404, detail="Assignment module not found")
    return assignment_modules[assignment_number]

@app.get("/assignment-modules/{assignment_number}/assignments")
async def get_module_assignments(assignment_number: int):
    if assignment_number not in assignment_modules:
        raise HTTPException(status_code=404, detail="Assignment module not found")
    return assignment_modules[assignment_number].assignments

@app.put("/assignment-modules/{assignment_number}/assignments/{assignment_id}")
async def update_module_assignment(assignment_number: int, assignment_id: int, assignment: Assignment):
    if assignment_number not in assignment_modules:
        raise HTTPException(status_code=404, detail="Assignment module not found")
    
    if assignment_id >= len(assignment_modules[assignment_number].assignments):
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    assignment_modules[assignment_number].assignments[assignment_id] = assignment
    return {"message": "Assignment updated successfully"}


@app.post("/mnist/train", response_model=TrainResponse)
def train_mnist(req: TrainRequest):
    result = train_and_evaluate_api(
        epochs=req.epochs,
        batch_size=req.batch_size,
        hidden_units=req.hidden_units,
    )
    return result


@app.post("/mnist/predict", response_model=PredictResponse)
def predict_mnist(req: PredictRequest):
    arr = np.array(req.image, dtype="float32")

    if arr.shape != (28, 28):
        raise HTTPException(
            status_code=400,
            detail=f"Expected image shape (28, 28), got {arr.shape}",
        )

    result = predict_digit(arr)
    return result

@app.post("/api/assignment4/generate", response_model=LLMGenerateResponse)
def generate_llm_text(req: LLMGenerateRequest):
    """
    Assignment 4: LLM text generation endpoint.

    Wraps the Hugging Face GPT-2 model and exposes key generation parameters.
    """
    try:
        text = generate_text(
            prompt=req.prompt,
            max_new_tokens=req.max_new_tokens,
            temperature=req.temperature,
            top_p=req.top_p,
            do_sample=True,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return LLMGenerateResponse(
        prompt=req.prompt,
        generated_text=text,
        max_new_tokens=req.max_new_tokens,
        temperature=req.temperature,
        top_p=req.top_p,
    )


class TestCaseResult(BaseModel):
    parameter_name: str
    parameter_value: float | int
    prompt: str
    generated_text: str


class TestCaseExperimentResponse(BaseModel):
    experiment_name: str
    prompt: str
    results: List[TestCaseResult]


@app.post("/api/assignment4/test-cases", response_model=List[TestCaseExperimentResponse])
def run_test_cases():
    """
    Assignment 4: Run all test case experiments (Temperature, Top-P, Max New Tokens).
    """
    experiments = []
    
    # Temperature Experiment
    temp_prompt = (
        "Write the opening paragraph of a fantasy story about a student "
        "who learns magic from an ancient, sentient library."
    )
    temp_results = []
    for temp in [0.2, 0.7, 1.2]:
        try:
            text = generate_text(
                prompt=temp_prompt,
                max_new_tokens=120,
                temperature=temp,
                top_p=0.9,
                do_sample=True,
            )
            temp_results.append(TestCaseResult(
                parameter_name="temperature",
                parameter_value=temp,
                prompt=temp_prompt,
                generated_text=text
            ))
        except Exception as e:
            temp_results.append(TestCaseResult(
                parameter_name="temperature",
                parameter_value=temp,
                prompt=temp_prompt,
                generated_text=f"Error: {str(e)}"
            ))
    experiments.append(TestCaseExperimentResponse(
        experiment_name="Temperature Experiment",
        prompt=temp_prompt,
        results=temp_results
    ))
    
    # Top-P Experiment
    top_p_prompt = (
        "Explain in simple terms how a neural network learns to recognize handwritten digits."
    )
    top_p_results = []
    for top_p in [0.5, 0.9, 1.0]:
        try:
            text = generate_text(
                prompt=top_p_prompt,
                max_new_tokens=120,
                temperature=0.7,
                top_p=top_p,
                do_sample=True,
            )
            top_p_results.append(TestCaseResult(
                parameter_name="top_p",
                parameter_value=top_p,
                prompt=top_p_prompt,
                generated_text=text
            ))
        except Exception as e:
            top_p_results.append(TestCaseResult(
                parameter_name="top_p",
                parameter_value=top_p,
                prompt=top_p_prompt,
                generated_text=f"Error: {str(e)}"
            ))
    experiments.append(TestCaseExperimentResponse(
        experiment_name="Top-P (Nucleus Sampling) Experiment",
        prompt=top_p_prompt,
        results=top_p_results
    ))
    
    # Max New Tokens Experiment
    length_prompt = "Summarize the rules of Dungeons & Dragons combat in a few sentences."
    length_results = []
    for length in [40, 100, 200]:
        try:
            text = generate_text(
                prompt=length_prompt,
                max_new_tokens=length,
                temperature=0.7,
                top_p=0.9,
                do_sample=True,
            )
            length_results.append(TestCaseResult(
                parameter_name="max_new_tokens",
                parameter_value=length,
                prompt=length_prompt,
                generated_text=text
            ))
        except Exception as e:
            length_results.append(TestCaseResult(
                parameter_name="max_new_tokens",
                parameter_value=length,
                prompt=length_prompt,
                generated_text=f"Error: {str(e)}"
            ))
    experiments.append(TestCaseExperimentResponse(
        experiment_name="Max New Tokens Experiment",
        prompt=length_prompt,
        results=length_results
    ))
    
    return experiments

@app.post("/api/assignment5/rag-dnd", response_model=RAGRulesResponse)
def rag_dnd_endpoint(req: RAGRulesRequest):
    """
    Assignment 5 / RAG demo:
    Answer D&D 2024 rules questions using a small RAG pipeline.
    """
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Question must not be empty.")

    result = rag_dnd_answer(req.question, k=3)

    # Shape result into the Pydantic response
    chunks = [
        RAGChunk(id=c["id"], text=c["text"], score=c["score"])
        for c in result["retrieved_chunks"]
    ]

    return RAGRulesResponse(
        question=result["question"],
        answer=result["answer"],
        retrieved_chunks=chunks,
    )


@app.post("/api/assignment7/train")
def assignment7_train(req: Assignment7TrainRequest):
    """
    Assignment 7: Fine-tune RoBERTa with LoRA to separate factual vs opinion statements.
    """
    try:
        result = assignment7_runner.train(
            dataset_name=req.dataset_name,
            seed=req.seed,
            max_samples=req.max_samples,
            num_train_epochs=req.num_train_epochs,
            learning_rate=req.learning_rate,
            weight_decay=req.weight_decay,
            warmup_ratio=req.warmup_ratio,
            label_smoothing=req.label_smoothing,
            per_device_train_batch_size=req.per_device_train_batch_size,
            gradient_accumulation_steps=req.gradient_accumulation_steps,
            max_length=req.max_length,
            lora_r=req.lora_r,
            lora_alpha=req.lora_alpha,
            lora_dropout=req.lora_dropout,
            classification_threshold=req.classification_threshold,
        )
        return result
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Assignment 7 training failed: {exc}") from exc


@app.post("/api/assignment7/predict")
def assignment7_predict(req: Assignment7PredictRequest):
    """
    Assignment 7 inference: classify a statement as factual vs opinion.
    """
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text must not be empty.")

    if not assignment7_runner.trained:
        raise HTTPException(
            status_code=400,
            detail="Model not trained yet. Please run the /api/assignment7/train endpoint first.",
        )

    try:
        pred = assignment7_runner.predict(req.text)
        return asdict(pred)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Inference failed: {exc}") from exc


@app.post("/api/assignment8/evaluate")
def assignment8_evaluate(req: Assignment8EvalRequest):
    """
    Assignment 8: Evaluate the fine-tuned Assignment 7 classifier on the held-out test set.
    Returns macro metrics, per-class scores, a normalized confusion matrix, and misclassified examples.
    """
    try:
        return assignment8_evaluator.evaluate(
            dataset_name=req.dataset_name,
            max_length=req.max_length,
            checkpoint=req.checkpoint,
            seed=req.seed,
            max_samples=req.max_samples,
        )
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Assignment 8 evaluation failed: {exc}") from exc


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
