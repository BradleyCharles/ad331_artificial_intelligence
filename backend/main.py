from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
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

# Sample data
weeks_data = {
    1: Week(
        week_number=1,
        title="Introduction to AI",
        description="Basic concepts and history of artificial intelligence",
        assignments=[
            Assignment(week=1, title="AI History Research", description="Research and summarize key milestones in AI development"),
            Assignment(week=1, title="Python Basics", description="Set up Python environment and complete basic exercises")
        ]
    ),
    2: Week(
        week_number=2,
        title="Machine Learning Fundamentals",
        description="Introduction to supervised and unsupervised learning",
        assignments=[
            Assignment(week=2, title="Linear Regression", description="Implement linear regression from scratch"),
            Assignment(week=2, title="Data Preprocessing", description="Learn data cleaning and preprocessing techniques")
        ]
    ),
    3: Week(
        week_number=3,
        title="Classification Algorithms",
        description="Decision trees, random forests, and SVM",
        assignments=[
            Assignment(week=3, title="Decision Tree Implementation", description="Build a decision tree classifier"),
            Assignment(week=3, title="Model Evaluation", description="Learn cross-validation and metrics")
        ]
    ),
    4: Week(
        week_number=4,
        title="Neural Networks Basics",
        description="Introduction to artificial neural networks",
        assignments=[
            Assignment(week=4, title="Perceptron Implementation", description="Build a simple perceptron"),
            Assignment(week=4, title="Backpropagation", description="Understand and implement backpropagation")
        ]
    ),
    5: Week(
        week_number=5,
        title="Deep Learning",
        description="Deep neural networks and optimization",
        assignments=[
            Assignment(week=5, title="Multi-layer Perceptron", description="Build a deep neural network"),
            Assignment(week=5, title="Optimization Techniques", description="Implement various optimizers")
        ]
    ),
    6: Week(
        week_number=6,
        title="Convolutional Neural Networks",
        description="CNNs for image processing",
        assignments=[
            Assignment(week=6, title="CNN Architecture", description="Design and implement a CNN"),
            Assignment(week=6, title="Image Classification", description="Build an image classifier")
        ]
    ),
    7: Week(
        week_number=7,
        title="Recurrent Neural Networks",
        description="RNNs, LSTMs, and sequence modeling",
        assignments=[
            Assignment(week=7, title="LSTM Implementation", description="Build an LSTM for sequence prediction"),
            Assignment(week=7, title="Text Processing", description="Natural language processing basics")
        ]
    ),
    8: Week(
        week_number=8,
        title="Advanced Topics",
        description="Transfer learning, GANs, and reinforcement learning",
        assignments=[
            Assignment(week=8, title="Transfer Learning", description="Implement transfer learning for image classification"),
            Assignment(week=8, title="GAN Basics", description="Introduction to Generative Adversarial Networks")
        ]
    ),
    9: Week(
        week_number=9,
        title="Model Deployment",
        description="Deploying ML models in production",
        assignments=[
            Assignment(week=9, title="Model Serialization", description="Save and load trained models"),
            Assignment(week=9, title="API Development", description="Create REST APIs for ML models")
        ]
    ),
    10: Week(
        week_number=10,
        title="Final Project",
        description="Comprehensive AI project",
        assignments=[
            Assignment(week=10, title="Project Proposal", description="Define and plan your final AI project"),
            Assignment(week=10, title="Implementation", description="Implement your AI solution"),
            Assignment(week=10, title="Presentation", description="Present your project and findings")
        ]
    )
}

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
