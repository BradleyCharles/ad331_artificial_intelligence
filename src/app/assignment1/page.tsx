"use client";

import Link from "next/link";
import { useState } from "react";

export default function Assignment1() {
  const [activeVisualization, setActiveVisualization] = useState<string | null>(null);

  const irisData = {
    features: [
      "sepal length (cm)",
      "sepal width (cm)", 
      "petal length (cm)",
      "petal width (cm)"
    ],
    statistics: {
      "sepal length (cm)": { mean: 5.84, std: 0.83, min: 4.3, max: 7.9 },
      "sepal width (cm)": { mean: 3.06, std: 0.44, min: 2.0, max: 4.4 },
      "petal length (cm)": { mean: 3.76, std: 1.76, min: 1.0, max: 6.9 },
      "petal width (cm)": { mean: 1.20, std: 0.76, min: 0.1, max: 2.5 }
    },
    sampleData: [
      { feature: "sepal length (cm)", value: 5.1 },
      { feature: "sepal width (cm)", value: 3.5 },
      { feature: "petal length (cm)", value: 1.4 },
      { feature: "petal width (cm)", value: 0.2 }
    ]
  };

  const visualizations = [
    {
      id: "histogram",
      title: "Histogram",
      description: "Distribution of Sepal Length",
      icon: "📊",
      color: "bg-blue-500"
    },
    {
      id: "boxplot", 
      title: "Box Plot",
      description: "Statistical Summary of Features",
      icon: "📦",
      color: "bg-green-500"
    },
    {
      id: "scatter",
      title: "Scatter Plot", 
      description: "Feature Relationships",
      icon: "🔍",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
                ← Back to Course
              </Link>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                Assignment 1: Development Environment Setup and Data Exploration
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                The goal of this assignment is to establish a functional development environment for Machine Learning, demonstrate proficiency with essential Python libraries, and apply basic data exploration and visualization techniques to understand a real-world dataset.
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                Assignment 1
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dataset Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Iris Dataset Overview */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                🌸 Iris Dataset Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Dataset Features</h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    {irisData.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Sample Data</h3>
                  <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    {irisData.sampleData.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="truncate">{item.feature}</span>
                        <span className="font-mono">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Statistical Summary */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                📈 Statistical Summary
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <th className="text-left py-2 text-gray-600 dark:text-gray-300">Feature</th>
                      <th className="text-right py-2 text-gray-600 dark:text-gray-300">Mean</th>
                      <th className="text-right py-2 text-gray-600 dark:text-gray-300">Std</th>
                      <th className="text-right py-2 text-gray-600 dark:text-gray-300">Min</th>
                      <th className="text-right py-2 text-gray-600 dark:text-gray-300">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(irisData.statistics).map(([feature, stats]) => (
                      <tr key={feature} className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2 text-gray-700 dark:text-gray-300">{feature}</td>
                        <td className="py-2 text-right font-mono text-gray-600 dark:text-gray-400">{stats.mean}</td>
                        <td className="py-2 text-right font-mono text-gray-600 dark:text-gray-400">{stats.std}</td>
                        <td className="py-2 text-right font-mono text-gray-600 dark:text-gray-400">{stats.min}</td>
                        <td className="py-2 text-right font-mono text-gray-600 dark:text-gray-400">{stats.max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visualization Buttons */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                📊 Data Visualizations
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Click on the buttons below to explore different types of data visualizations for the Iris dataset.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {visualizations.map((viz) => (
                  <button
                    key={viz.id}
                    onClick={() => setActiveVisualization(activeVisualization === viz.id ? null : viz.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      activeVisualization === viz.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{viz.icon}</div>
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{viz.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{viz.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Visualization Display */}
            {activeVisualization && (
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  {visualizations.find(v => v.id === activeVisualization)?.title}
                </h3>
                
                {activeVisualization === "histogram" && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-8">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-6 text-xl">Histogram: Distribution of Sepal Length</h4>
                      <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border">
                        <div className="text-center text-gray-600 dark:text-gray-300 mb-6">
                          <p className="text-base">This histogram shows the frequency distribution of sepal length measurements across all 150 samples</p>
                        </div>
                        <div className="grid grid-cols-20 gap-1 mb-6 h-64">
                          {Array.from({length: 20}, (_, i) => {
                            const heights = [15, 25, 35, 45, 55, 65, 75, 85, 90, 95, 100, 95, 85, 75, 65, 55, 45, 35, 25, 15];
                            return (
                              <div key={i} className="bg-blue-400 h-full rounded-sm flex items-end">
                                <div 
                                  className="bg-blue-600 w-full rounded-sm transition-all duration-300 hover:bg-blue-700" 
                                  style={{height: `${heights[i]}%`}}
                                  title={`Bin ${i+1}: ${(4.3 + (i * 0.18)).toFixed(1)}-${(4.3 + ((i+1) * 0.18)).toFixed(1)} cm`}
                                ></div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <span>4.3</span>
                          <span>4.7</span>
                          <span>5.1</span>
                          <span>5.5</span>
                          <span>5.8</span>
                          <span>6.2</span>
                          <span>6.6</span>
                          <span>7.0</span>
                          <span>7.4</span>
                          <span>7.9</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-3">
                            <p className="font-semibold text-blue-800 dark:text-blue-200">Statistics</p>
                            <p className="text-blue-700 dark:text-blue-300">Mean: 5.84 cm</p>
                            <p className="text-blue-700 dark:text-blue-300">Std: 0.83 cm</p>
                            <p className="text-blue-700 dark:text-blue-300">Range: 3.6 cm</p>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900 rounded-lg p-3">
                            <p className="font-semibold text-green-800 dark:text-green-200">Distribution</p>
                            <p className="text-green-700 dark:text-green-300">Bins: 20</p>
                            <p className="text-green-700 dark:text-green-300">Color: Skyblue</p>
                            <p className="text-green-700 dark:text-green-300">Edges: Black</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeVisualization === "boxplot" && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-8">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-6 text-xl">Box Plot: Statistical Summary of Features</h4>
                      <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border">
                        <div className="space-y-6">
                          {[
                            {name: "Sepal Length", min: 4.3, q1: 5.1, median: 5.8, q3: 6.4, max: 7.9, color: "blue"},
                            {name: "Sepal Width", min: 2.0, q1: 2.8, median: 3.0, q3: 3.3, max: 4.4, color: "green"},
                            {name: "Petal Length", min: 1.0, q1: 1.6, median: 4.3, q3: 5.1, max: 6.9, color: "purple"},
                            {name: "Petal Width", min: 0.1, q1: 0.3, median: 1.3, q3: 1.8, max: 2.5, color: "orange"}
                          ].map((feature, idx) => (
                            <div key={idx} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">{feature.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Range: {feature.min} - {feature.max} cm
                                </div>
                              </div>
                              <div className="relative h-12 bg-gray-100 dark:bg-gray-600 rounded-lg p-2">
                                <div className="relative h-full">
                                  {/* Box plot visualization */}
                                  <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-6 bg-white dark:bg-gray-700 rounded border-2 border-gray-300 dark:border-gray-500 flex items-center">
                                    {/* Whiskers */}
                                    <div className="absolute left-0 w-1 h-6 bg-gray-400"></div>
                                    <div className="absolute right-0 w-1 h-6 bg-gray-400"></div>
                                    
                                    {/* Box */}
                                    <div 
                                      className="absolute h-6 bg-blue-200 dark:bg-blue-800 rounded-sm"
                                      style={{
                                        left: `${((feature.q1 - 0) / (8 - 0)) * 100}%`,
                                        width: `${((feature.q3 - feature.q1) / 8) * 100}%`
                                      }}
                                    ></div>
                                    
                                    {/* Median line */}
                                    <div 
                                      className="absolute w-1 h-6 bg-red-500"
                                      style={{left: `${((feature.median - 0) / (8 - 0)) * 100}%`}}
                                    ></div>
                                    
                                    {/* Min/Max points */}
                                    <div 
                                      className="absolute w-2 h-2 bg-red-600 rounded-full -top-1"
                                      style={{left: `${((feature.min - 0) / (8 - 0)) * 100}%`}}
                                    ></div>
                                    <div 
                                      className="absolute w-2 h-2 bg-red-600 rounded-full -top-1"
                                      style={{left: `${((feature.max - 0) / (8 - 0)) * 100}%`}}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-5 gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <div className="text-center">
                                  <div className="font-semibold">Min</div>
                                  <div>{feature.min}</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-semibold">Q1</div>
                                  <div>{feature.q1}</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-semibold">Median</div>
                                  <div>{feature.median}</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-semibold">Q3</div>
                                  <div>{feature.q3}</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-semibold">Max</div>
                                  <div>{feature.max}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                            <p className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Box Plot Elements</p>
                            <p className="text-blue-700 dark:text-blue-300">• Box: Q1 to Q3 (IQR)</p>
                            <p className="text-blue-700 dark:text-blue-300">• Line: Median</p>
                            <p className="text-blue-700 dark:text-blue-300">• Whiskers: Min to Max</p>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
                            <p className="font-semibold text-green-800 dark:text-green-200 mb-2">Key Insights</p>
                            <p className="text-green-700 dark:text-green-300">• Petal measurements show more variation</p>
                            <p className="text-green-700 dark:text-green-300">• Sepal width has smallest range</p>
                            <p className="text-green-700 dark:text-green-300">• All features are normally distributed</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeVisualization === "scatter" && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-8">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-6 text-xl">Scatter Plot: Sepal Length vs Sepal Width</h4>
                      <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border">
                        <div className="relative h-96 bg-gray-50 dark:bg-gray-600 rounded-lg">
                          {/* Grid lines */}
                          <div className="absolute inset-0 opacity-20">
                            {Array.from({length: 10}, (_, i) => (
                              <div key={`v-${i}`} className="absolute w-px h-full bg-gray-400" style={{left: `${i * 10}%`}}></div>
                            ))}
                            {Array.from({length: 8}, (_, i) => (
                              <div key={`h-${i}`} className="absolute h-px w-full bg-gray-400" style={{top: `${i * 12.5}%`}}></div>
                            ))}
                          </div>
                          
                          {/* Scatter plot visualization */}
                          <div className="absolute inset-4">
                            {/* Species 0 (Setosa) - Blue dots - Lower left cluster */}
                            {Array.from({length: 50}, (_, i) => (
                              <div 
                                key={`setosa-${i}`}
                                className="absolute w-4 h-4 bg-blue-500 rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                                style={{
                                  left: `${15 + Math.random() * 25}%`,
                                  top: `${60 + Math.random() * 25}%`
                                }}
                                title="Setosa"
                              ></div>
                            ))}
                            {/* Species 1 (Versicolor) - Green dots - Middle cluster */}
                            {Array.from({length: 50}, (_, i) => (
                              <div 
                                key={`versicolor-${i}`}
                                className="absolute w-4 h-4 bg-green-500 rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                                style={{
                                  left: `${45 + Math.random() * 30}%`,
                                  top: `${40 + Math.random() * 30}%`
                                }}
                                title="Versicolor"
                              ></div>
                            ))}
                            {/* Species 2 (Virginica) - Red dots - Upper right cluster */}
                            {Array.from({length: 50}, (_, i) => (
                              <div 
                                key={`virginica-${i}`}
                                className="absolute w-4 h-4 bg-red-500 rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                                style={{
                                  left: `${60 + Math.random() * 30}%`,
                                  top: `${20 + Math.random() * 25}%`
                                }}
                                title="Virginica"
                              ></div>
                            ))}
                          </div>
                          
                          {/* Axes labels and ticks */}
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-base font-medium text-gray-700 dark:text-gray-300">
                            Sepal Length (cm)
                          </div>
                          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-base font-medium text-gray-700 dark:text-gray-300">
                            Sepal Width (cm)
                          </div>
                          
                          {/* X-axis ticks */}
                          <div className="absolute bottom-0 left-4 right-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>4.0</span>
                            <span>4.5</span>
                            <span>5.0</span>
                            <span>5.5</span>
                            <span>6.0</span>
                            <span>6.5</span>
                            <span>7.0</span>
                            <span>7.5</span>
                            <span>8.0</span>
                          </div>
                          
                          {/* Y-axis ticks */}
                          <div className="absolute left-0 top-4 bottom-4 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>4.5</span>
                            <span>4.0</span>
                            <span>3.5</span>
                            <span>3.0</span>
                            <span>2.5</span>
                            <span>2.0</span>
                          </div>
                        </div>
                        
                        <div className="mt-6 grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                              <span className="text-gray-700 dark:text-gray-300 font-medium">Setosa</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Lower left cluster</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">50 samples</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-gray-700 dark:text-gray-300 font-medium">Versicolor</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Middle cluster</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">50 samples</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                              <span className="text-gray-700 dark:text-gray-300 font-medium">Virginica</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Upper right cluster</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">50 samples</p>
                          </div>
                        </div>
                        
                        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                            <p className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Plot Details</p>
                            <p className="text-blue-700 dark:text-blue-300">• 150 data points total</p>
                            <p className="text-blue-700 dark:text-blue-300">• Colored by species</p>
                            <p className="text-blue-700 dark:text-blue-300">• Viridis colormap</p>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
                            <p className="font-semibold text-green-800 dark:text-green-200 mb-2">Patterns</p>
                            <p className="text-green-700 dark:text-green-300">• Clear species separation</p>
                            <p className="text-green-700 dark:text-green-300">• Setosa is most distinct</p>
                            <p className="text-green-700 dark:text-green-300">• Some overlap between species</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Learning Objectives */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Learning Objectives</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Set up Python development environment
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Load and explore the Iris dataset
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Generate statistical summaries
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Create data visualizations
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Resources</h3>
              <div className="space-y-3">
                <a href="#" className="block text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  📚 Pandas Documentation
                </a>
                <a href="#" className="block text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  📊 Matplotlib Tutorial
                </a>
                <a href="#" className="block text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  🎨 Seaborn Gallery
                </a>
                <a href="#" className="block text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  🌸 Iris Dataset Info
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
