import Link from "next/link";
import Image from "next/image";

export default function Week2() {
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
                Week 2: Time to Detection Analysis
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                AI Model Training Data Visualization and Analysis
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                Data Ready
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
            Dataset Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,000</div>
              <div className="text-sm text-blue-800 dark:text-blue-200">Total Samples</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">800</div>
              <div className="text-sm text-green-800 dark:text-green-200">Training Samples</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">200</div>
              <div className="text-sm text-orange-800 dark:text-orange-200">Test Samples</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">10</div>
              <div className="text-sm text-purple-800 dark:text-purple-200">Features</div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Target Variable: Time to Detection (minutes)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Training Data</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Mean: 150.21 minutes</li>
                  <li>Median: 150.32 minutes</li>
                  <li>Std Dev: 24.61 minutes</li>
                  <li>Range: 58.09 - 212.24 minutes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Test Data</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Mean: 150.72 minutes</li>
                  <li>Median: 150.57 minutes</li>
                  <li>Std Dev: 24.89 minutes</li>
                  <li>Range: 78.56 - 208.05 minutes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Analysis */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Feature Analysis
          </h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Top Correlated Features with Target</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-red-50 dark:bg-red-900 rounded-lg p-3">
                <span className="text-gray-800 dark:text-white font-medium">Alert Priority</span>
                <span className="text-red-600 dark:text-red-400 font-bold">0.622</span>
              </div>
              <div className="flex items-center justify-between bg-orange-50 dark:bg-orange-900 rounded-lg p-3">
                <span className="text-gray-800 dark:text-white font-medium">Privilege Escalations</span>
                <span className="text-orange-600 dark:text-orange-400 font-bold">0.599</span>
              </div>
              <div className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900 rounded-lg p-3">
                <span className="text-gray-800 dark:text-white font-medium">Average CPU Percent</span>
                <span className="text-yellow-600 dark:text-yellow-400 font-bold">0.285</span>
              </div>
              <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900 rounded-lg p-3">
                <span className="text-gray-800 dark:text-white font-medium">Failed Logins</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">0.236</span>
              </div>
              <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900 rounded-lg p-3">
                <span className="text-gray-800 dark:text-white font-medium">Data Transfer (MB)</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">0.209</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Feature Descriptions</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li><strong>num_logins_last_24h:</strong> Number of logins in last 24 hours</li>
                <li><strong>num_failed_logins:</strong> Number of failed login attempts</li>
                <li><strong>data_transfer_mb:</strong> Data transfer in MB</li>
                <li><strong>num_file_accesses:</strong> Number of file accesses</li>
                <li><strong>avg_process_cpu_percent:</strong> Average CPU usage percentage</li>
                <li><strong>num_network_connections:</strong> Number of network connections</li>
                <li><strong>privilege_escalations:</strong> Number of privilege escalations</li>
                <li><strong>alert_priority:</strong> Alert priority level (1-5)</li>
                <li><strong>hour_of_day:</strong> Hour of day (0-23)</li>
                <li><strong>day_of_week:</strong> Day of week (0-6)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Data Quality</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>✅ No missing values detected</li>
                <li>✅ All features are numeric</li>
                <li>✅ Consistent data types</li>
                <li>⚠️ Some outliers in target variable (normal for detection time)</li>
                <li>✅ Good distribution across train/test splits</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Visualizations */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Data Visualizations
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Static Visualizations</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Dataset Overview</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Target distribution and train/test comparison</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-500">📊 data_overview.png</span>
                    <a 
                      href="/visualizations/static/data_overview.png" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Feature Analysis</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Individual feature relationships with target</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-500">📊 feature_analysis.png</span>
                    <a 
                      href="/visualizations/static/feature_analysis.png" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Correlation Heatmap</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Feature correlation matrix</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-500">📊 correlation_heatmap.png</span>
                    <a 
                      href="/visualizations/static/correlation_heatmap.png" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Time Analysis</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Time-based patterns and trends</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-500">📊 time_analysis.png</span>
                    <a 
                      href="/visualizations/static/time_analysis.png" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Model Evaluation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Linear regression performance analysis</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-500">📊 linear_regression_evaluation.png</span>
                    <a 
                      href="/visualizations/static/linear_regression_evaluation.png" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Feature Importance</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Linear regression coefficients</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-500">📊 feature_importance_lr.png</span>
                    <a 
                      href="/visualizations/static/feature_importance_lr.png" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Test Performance</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Model evaluation on test data</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-500">📊 model_test_performance.png</span>
                    <a 
                      href="/visualizations/static/model_test_performance.png" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Interactive Visualizations</h3>
              <div className="space-y-3">
                <Link href="/week2/scatter-matrix" className="block">
                  <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors cursor-pointer">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Scatter Matrix</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Interactive feature relationships</p>
                    <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">🌐 Click to view interactive visualization</div>
                  </div>
                </Link>
                <Link href="/week2/3d-scatter" className="block">
                  <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 hover:bg-green-100 dark:hover:bg-green-800 transition-colors cursor-pointer">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">3D Scatter Plot</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">3D visualization of key features</p>
                    <div className="mt-2 text-xs text-green-600 dark:text-green-400">🌐 Click to view 3D interactive plot</div>
                  </div>
                </Link>
                <Link href="/week2/correlation" className="block">
                  <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors cursor-pointer">
                    <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Interactive Correlation</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Interactive correlation heatmap</p>
                    <div className="mt-2 text-xs text-purple-600 dark:text-purple-400">🌐 Click to view correlation analysis</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* New Feature: Failed Logins Analysis */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            🔥 NEW: Failed Login Security Analysis
          </h2>
          
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900 dark:to-orange-900 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  Security Threat Patterns by Hour of Day
                </h3>
                <p className="text-red-700 dark:text-red-300 mb-4">
                  Advanced analysis revealing when security threats are most likely to occur, 
                  helping optimize security monitoring and resource allocation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Peak Risk Hour</div>
                    <div className="text-lg font-bold text-red-600 dark:text-red-400">09:00</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">3.6 avg failed logins</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Failed Logins</div>
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">3,013</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Across 1,000 incidents</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Risk Difference</div>
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">1.3x</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Peak vs lowest risk</div>
                  </div>
                </div>
              </div>
              <div className="ml-6">
                <Link 
                  href="/week2/failed-logins"
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-block"
                >
                  View Analysis →
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Key Insights</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Peak risk at 09:00 with 3.6 average failed logins per incident</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>Consistent medium-risk pattern across all 24 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Total of 3,013 failed logins analyzed across 1,000 incidents</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Lowest risk period at 19:00 (2.4 avg failed logins)</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Security Benefits</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  <span>Enhanced monitoring during high-risk periods</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  <span>Optimized security team scheduling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  <span>Real-time threat detection improvements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  <span>Data-driven security resource allocation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* AI Model Recommendations */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Model Training Recommendations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Preprocessing</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Apply standardization/normalization due to different scales
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Consider log transformation for target if needed
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Encode time features cyclically (hour, day)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Create interaction terms for highly correlated features
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Model Selection</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  Linear regression for baseline
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  Random Forest for feature importance
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  XGBoost for performance
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  Neural networks for complex patterns
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Key Insights</h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Alert priority and privilege escalations are the strongest predictors</li>
              <li>• Time-based features show interesting patterns worth exploring</li>
              <li>• Target distribution is relatively normal with some outliers</li>
              <li>• No missing data makes preprocessing straightforward</li>
            </ul>
          </div>
        </div>

        {/* Model Training Results */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Model Training Results
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Training Performance</h3>
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-green-800 dark:text-green-200 font-medium">R² Score</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">0.8047</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">80.47% variance explained</p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800 dark:text-blue-200 font-medium">Mean Absolute Error</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">8.68 min</span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Average prediction error</p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-800 dark:text-purple-200 font-medium">RMSE</span>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">10.97 min</span>
                  </div>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">Root mean square error</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Test Data Performance</h3>
              <div className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-800 dark:text-yellow-200 font-medium">Predictions within 10%</span>
                    <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">82.0%</span>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">High accuracy predictions</p>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-orange-800 dark:text-orange-200 font-medium">Predictions within 20%</span>
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">97.0%</span>
                  </div>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">Very good accuracy</p>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-red-800 dark:text-red-200 font-medium">MAPE</span>
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">6.04%</span>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">Mean absolute percentage error</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 dark:bg-gray-600 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Model Quality Assessment</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Excellent R² score ({">"}0.8)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">97% predictions within 20%</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Low bias (mean prediction ≈ mean actual)</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Consistent across priority levels</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Ready for production use</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Strong feature engineering</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Model Performance by Priority */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Performance by Alert Priority
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">Priority 1</div>
              <div className="text-sm text-red-800 dark:text-red-200 mt-1">R²: 0.713</div>
              <div className="text-sm text-red-700 dark:text-red-300">MAE: 8.5 min</div>
              <div className="text-xs text-red-600 dark:text-red-400 mt-1">49 samples</div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">Priority 2</div>
              <div className="text-sm text-orange-800 dark:text-orange-200 mt-1">R²: 0.594</div>
              <div className="text-sm text-orange-700 dark:text-orange-300">MAE: 8.0 min</div>
              <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">43 samples</div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">Priority 3</div>
              <div className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">R²: 0.549</div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">MAE: 10.1 min</div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">38 samples</div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">Priority 4</div>
              <div className="text-sm text-blue-800 dark:text-blue-200 mt-1">R²: 0.700</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">MAE: 8.8 min</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">32 samples</div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Priority 5</div>
              <div className="text-sm text-purple-800 dark:text-purple-200 mt-1">R²: 0.738</div>
              <div className="text-sm text-purple-700 dark:text-purple-300">MAE: 8.2 min</div>
              <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">38 samples</div>
            </div>
          </div>
          
          <div className="mt-6 bg-indigo-50 dark:bg-indigo-900 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Key Insights</h4>
            <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
              <li>• Model performs consistently across all priority levels</li>
              <li>• Higher priority alerts (4-5) show slightly better R² scores</li>
              <li>• MAE remains relatively stable (8.0-10.1 minutes)</li>
              <li>• All priority levels achieve good prediction accuracy</li>
            </ul>
          </div>
        </div>

        {/* Generated Visualizations */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Model Performance Visualizations
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Training & Analysis</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Linear Regression Evaluation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive model performance analysis</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-500">📊 linear_regression_evaluation.png</span>
                    <a 
                      href="/visualizations/static/linear_regression_evaluation.png" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Feature Importance</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Linear regression coefficients analysis</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-500">📊 feature_importance_lr.png</span>
                    <a 
                      href="/visualizations/static/feature_importance_lr.png" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Test Performance</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Model evaluation on test data</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-500">📊 model_test_performance.png</span>
                    <a 
                      href="/visualizations/static/model_test_performance.png" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Data Analysis</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Dataset Overview</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Target distribution and train/test comparison</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-blue-600 dark:text-blue-400">📊 data_overview.png</span>
                    <a 
                      href="/visualizations/static/data_overview.png" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Feature Analysis</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">Individual feature relationships</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-green-600 dark:text-green-400">📊 feature_analysis.png</span>
                    <a 
                      href="/visualizations/static/feature_analysis.png" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-green-600 dark:text-green-400 hover:underline"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Correlation Heatmap</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Feature correlation matrix</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-purple-600 dark:text-purple-400">📊 correlation_heatmap.png</span>
                    <a 
                      href="/visualizations/static/correlation_heatmap.png" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Model Usage & Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/reports/model_test_performance_report.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center block"
            >
              Make Predictions
            </a>
            <a 
              href="/models/best_linear_regression_model.pkl" 
              download
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center block"
            >
              Download Model
            </a>
            <a 
              href="/reports/model_results_summary.txt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center block"
            >
              View Reports
            </a>
          </div>
          
          <div className="mt-6 bg-green-50 dark:bg-green-900 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">🎉 Model Training Complete!</h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Your linear regression model has been successfully trained and tested with excellent performance. 
              The model is ready for production use with 80.47% variance explained and 97% of predictions within 20% accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
