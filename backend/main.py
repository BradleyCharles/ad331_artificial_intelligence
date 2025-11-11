from __future__ import annotations
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from mnist_fnn import train_and_evaluate_api, predict_digit
from typing import List, Optional
import os

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
    week: int
    title: str
    description: str
    status: str = "pending"  # pending, in_progress, completed
    files: List[str] = []

class Week(BaseModel):
    week_number: int
    title: str
    description: str
    assignments: List[Assignment] = []

#

@app.get("/")
async def root():
    return {"message": "AD331 AI Course Backend API"}

@app.get("/weeks")
async def get_weeks():
    return list(weeks_data.values())

@app.get("/weeks/{week_number}")
async def get_week(week_number: int):
    if week_number not in weeks_data:
        raise HTTPException(status_code=404, detail="Week not found")
    return weeks_data[week_number]

@app.get("/assignments/{week_number}")
async def get_assignments(week_number: int):
    if week_number not in weeks_data:
        raise HTTPException(status_code=404, detail="Week not found")
    return weeks_data[week_number].assignments

@app.put("/assignments/{week_number}/{assignment_id}")
async def update_assignment(week_number: int, assignment_id: int, assignment: Assignment):
    if week_number not in weeks_data:
        raise HTTPException(status_code=404, detail="Week not found")
    
    if assignment_id >= len(weeks_data[week_number].assignments):
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    weeks_data[week_number].assignments[assignment_id] = assignment
    return {"message": "Assignment updated successfully"}


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


# --- Endpoints ---

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















if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
