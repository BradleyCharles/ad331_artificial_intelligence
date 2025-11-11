"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const API_BASE = "http://localhost:8000";

interface TrainingHistory {
  accuracy: number[];
  loss: number[];
  val_accuracy: number[];
  val_loss: number[];
}

interface TrainingResult {
  history: TrainingHistory;
  test_loss: number;
  test_accuracy: number;
}

interface PredictionResult {
  predicted_class: number;
  probabilities: number[];
}

export default function Week3() {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingResult, setTrainingResult] = useState<TrainingResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [trainingParams, setTrainingParams] = useState({
    epochs: 5,
    batch_size: 128,
    hidden_units: 128,
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 280;
    canvas.height = 280;
    
    // Fill with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set drawing style
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setPredictionResult(null);
  };

  const getImageData = (): number[][] => {
    const canvas = canvasRef.current;
    if (!canvas) return [];
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return [];
    
    // Get image data at 28x28 resolution
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Create 28x28 array
    const result: number[][] = [];
    const scale = 280 / 28;
    
    for (let y = 0; y < 28; y++) {
      const row: number[] = [];
      for (let x = 0; x < 28; x++) {
        // Sample from the scaled area
        const px = Math.floor(x * scale);
        const py = Math.floor(y * scale);
        const idx = (py * 280 + px) * 4;
        
        // Get grayscale value (invert: white=0, black=255)
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const gray = 255 - Math.round((r + g + b) / 3);
        
        row.push(gray);
      }
      result.push(row);
    }
    
    return result;
  };

  const handleTrain = async () => {
    setIsTraining(true);
    setTrainingResult(null);
    
    try {
      const response = await fetch(`${API_BASE}/mnist/train`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trainingParams),
      });
      
      if (!response.ok) {
        throw new Error("Training failed");
      }
      
      const result: TrainingResult = await response.json();
      setTrainingResult(result);
    } catch (error) {
      console.error("Training error:", error);
      alert("Training failed. Make sure the backend server is running.");
    } finally {
      setIsTraining(false);
    }
  };

  const handlePredict = async () => {
    const imageData = getImageData();
    if (imageData.length === 0) {
      alert("Please draw a digit first!");
      return;
    }
    
    setIsPredicting(true);
    setPredictionResult(null);
    
    try {
      const response = await fetch(`${API_BASE}/mnist/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      });
      
      if (!response.ok) {
        throw new Error("Prediction failed");
      }
      
      const result: PredictionResult = await response.json();
      setPredictionResult(result);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Prediction failed. Make sure the model is trained and the backend server is running.");
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
                ← Back to Course
              </Link>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                Week 3: MNIST Handwritten Digit Classification
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Train a Feedforward Neural Network (FNN) to classify handwritten digits (0-9)
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                Model Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Dataset Overview */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            MNIST Dataset Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">60,000</div>
              <div className="text-sm text-blue-800 dark:text-blue-200">Training Samples</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">10,000</div>
              <div className="text-sm text-green-800 dark:text-green-200">Test Samples</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">28×28</div>
              <div className="text-sm text-orange-800 dark:text-orange-200">Image Size</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">10</div>
              <div className="text-sm text-purple-800 dark:text-purple-200">Classes (0-9)</div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Data Preparation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Preprocessing Steps</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Normalize pixel values to 0-1 range (divide by 255)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Flatten 28×28 images into 784-dimensional vectors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>One-hot encode labels (10 classes)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Dataset Characteristics</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Grayscale images (single channel)</li>
                  <li>• Handwritten digits from 0 to 9</li>
                  <li>• Balanced dataset (equal samples per class)</li>
                  <li>• Standard benchmark for image classification</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Model Architecture */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Model Architecture
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">FNN Structure</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-800 dark:text-blue-200">Input Layer</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">784</span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Flattened 28×28 image pixels</p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-800 dark:text-green-200">Hidden Layer 1</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">128</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">ReLU activation function</p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-purple-800 dark:text-purple-200">Hidden Layer 2</span>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">128</span>
                  </div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">ReLU activation function</p>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-orange-800 dark:text-orange-200">Output Layer</span>
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">10</span>
                  </div>
                  <p className="text-sm text-orange-700 dark:text-orange-300">Softmax activation (0-9 classes)</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Training Configuration</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-3">Loss Function</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Categorical Cross-Entropy</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Suitable for multi-class classification with one-hot encoded labels</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-3">Optimizer</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Adam</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Adaptive learning rate optimizer for efficient training</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-3">Metrics</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy (percentage of correct predictions)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Model Training */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Model Training
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Training Parameters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Epochs: {trainingParams.epochs}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={trainingParams.epochs}
                    onChange={(e) => setTrainingParams({ ...trainingParams, epochs: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>1</span>
                    <span>20</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Batch Size: {trainingParams.batch_size}
                  </label>
                  <input
                    type="range"
                    min="32"
                    max="256"
                    step="32"
                    value={trainingParams.batch_size}
                    onChange={(e) => setTrainingParams({ ...trainingParams, batch_size: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>32</span>
                    <span>256</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hidden Units: {trainingParams.hidden_units}
                  </label>
                  <input
                    type="range"
                    min="32"
                    max="256"
                    step="32"
                    value={trainingParams.hidden_units}
                    onChange={(e) => setTrainingParams({ ...trainingParams, hidden_units: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>32</span>
                    <span>256</span>
                  </div>
                </div>
                
                <button
                  onClick={handleTrain}
                  disabled={isTraining}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    isTraining
                      ? "bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isTraining ? "Training..." : "Train Model"}
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Training Results</h3>
              
              {isTraining && (
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                  <p className="text-blue-800 dark:text-blue-200">Training model... This may take a few minutes.</p>
                </div>
              )}
              
              {!isTraining && !trainingResult && (
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">No training results yet. Click "Train Model" to start.</p>
                </div>
              )}
              
              {!isTraining && trainingResult && (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-green-800 dark:text-green-200">Test Accuracy</span>
                      <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {(trainingResult.test_accuracy * 100).toFixed(2)}%
                      </span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">Final accuracy on test set</p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-800 dark:text-blue-200">Test Loss</span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {trainingResult.test_loss.toFixed(4)}
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Categorical cross-entropy loss</p>
                  </div>
                  
                  {trainingResult.history && (
                    <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
                      <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Training Progress</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-purple-700 dark:text-purple-300">Final Training Accuracy:</span>
                          <span className="font-bold text-purple-600 dark:text-purple-400">
                            {(trainingResult.history.accuracy[trainingResult.history.accuracy.length - 1] * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-700 dark:text-purple-300">Final Validation Accuracy:</span>
                          <span className="font-bold text-purple-600 dark:text-purple-400">
                            {(trainingResult.history.val_accuracy[trainingResult.history.val_accuracy.length - 1] * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-700 dark:text-purple-300">Epochs Trained:</span>
                          <span className="font-bold text-purple-600 dark:text-purple-400">
                            {trainingResult.history.accuracy.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Digit Prediction */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Test Your Model: Draw a Digit
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Drawing Canvas</h3>
              <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-4 inline-block">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="border-2 border-gray-300 dark:border-gray-500 rounded cursor-crosshair bg-white"
                  style={{ touchAction: "none" }}
                />
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={clearCanvas}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handlePredict}
                  disabled={isPredicting || !trainingResult}
                  className={`font-medium py-2 px-4 rounded-lg transition-colors ${
                    isPredicting || !trainingResult
                      ? "bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isPredicting ? "Predicting..." : "Predict Digit"}
                </button>
              </div>
              {!trainingResult && (
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                  ⚠️ Please train the model first before making predictions.
                </p>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Prediction Results</h3>
              
              {isPredicting && (
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                  <p className="text-blue-800 dark:text-blue-200">Analyzing digit...</p>
                </div>
              )}
              
              {!isPredicting && !predictionResult && (
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">Draw a digit and click "Predict Digit" to see results.</p>
                </div>
              )}
              
              {!isPredicting && predictionResult && (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6 text-center">
                    <div className="text-6xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {predictionResult.predicted_class}
                    </div>
                    <p className="text-green-800 dark:text-green-200 font-medium">Predicted Digit</p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Confidence: {(predictionResult.probabilities[predictionResult.predicted_class] * 100).toFixed(2)}%
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-3">Probability Distribution</h4>
                    <div className="space-y-2">
                      {predictionResult.probabilities.map((prob, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-8 text-sm font-medium text-gray-700 dark:text-gray-300">{idx}</div>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-500 rounded-full h-6 relative overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                idx === predictionResult.predicted_class
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                              }`}
                              style={{ width: `${prob * 100}%` }}
                            />
                          </div>
                          <div className="w-16 text-right text-sm text-gray-600 dark:text-gray-400">
                            {(prob * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Model Evaluation Summary */}
        {trainingResult && (
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Model Evaluation Summary
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {(trainingResult.test_accuracy * 100).toFixed(2)}%
                </div>
                <div className="text-green-800 dark:text-green-200 font-medium">Test Accuracy</div>
                <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                  {trainingResult.test_accuracy >= 0.95
                    ? "Excellent performance!"
                    : trainingResult.test_accuracy >= 0.90
                    ? "Very good performance"
                    : trainingResult.test_accuracy >= 0.85
                    ? "Good performance"
                    : "Consider training longer or adjusting parameters"}
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {trainingResult.test_loss.toFixed(4)}
                </div>
                <div className="text-blue-800 dark:text-blue-200 font-medium">Test Loss</div>
                <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Lower is better (categorical cross-entropy)
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {trainingParams.epochs}
                </div>
                <div className="text-purple-800 dark:text-purple-200 font-medium">Epochs Trained</div>
                <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  With {trainingParams.hidden_units} hidden units per layer
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Model Quality Assessment</h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                {trainingResult.test_accuracy >= 0.95 && (
                  <li>✅ Excellent accuracy! The model is performing very well on the test set.</li>
                )}
                {trainingResult.test_accuracy >= 0.90 && trainingResult.test_accuracy < 0.95 && (
                  <li>✅ Very good accuracy! The model is performing well on the test set.</li>
                )}
                {trainingResult.test_accuracy >= 0.85 && trainingResult.test_accuracy < 0.90 && (
                  <li>✓ Good accuracy. Consider training for more epochs or adjusting hyperparameters.</li>
                )}
                {trainingResult.test_accuracy < 0.85 && (
                  <li>⚠️ Consider training for more epochs, increasing hidden units, or adjusting learning rate.</li>
                )}
                <li>• The model uses a validation split of 10% during training</li>
                <li>• Test set contains 10,000 samples not seen during training</li>
              </ul>
            </div>
          </div>
        )}

        {/* Learning Objectives */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Learning Objectives & Requirements
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Completed Requirements</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Load and preprocess MNIST dataset (normalize, flatten, one-hot encode)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Build FNN with 784 input neurons, hidden layers with ReLU, 10 output neurons with Softmax</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Compile model with Categorical Cross-Entropy loss and Adam optimizer</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Train model for configurable epochs (5-10 recommended)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Evaluate model on test set and report accuracy</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Testing Features</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  <span>Train model with different hyperparameters (epochs, batch size, hidden units)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  <span>View training history and validation metrics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  <span>Draw digits on canvas and test model predictions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  <span>See probability distribution for all 10 digit classes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  <span>Compare model performance with different configurations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
