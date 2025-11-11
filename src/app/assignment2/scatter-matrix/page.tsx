import Link from "next/link";

export default function ScatterMatrixPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/assignment2" className="text-blue-600 dark:text-blue-400 hover:underline">
                ← Back to Assignment 2
              </Link>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                Interactive Scatter Matrix
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Interactive feature relationships visualization
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                Interactive
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Feature Scatter Matrix
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This interactive visualization shows the relationships between different features in your dataset. 
              Each point represents a data sample, and the color indicates the time to detection (target variable).
            </p>
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How to Use:</h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Hover over points to see detailed information</li>
                <li>• Click and drag to zoom into specific areas</li>
                <li>• Use the toolbar to reset zoom or download the plot</li>
                <li>• Different subplots show relationships between different feature pairs</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-4 text-center">
            <iframe
              src="/visualizations/interactive/interactive_scatter_matrix.html"
              width="100%"
              height="800"
              className="border-0 rounded-lg"
              title="Interactive Scatter Matrix"
            />
          </div>

          <div className="mt-6 bg-gray-50 dark:bg-gray-600 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Interpretation Guide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">What to Look For:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• <strong>Linear relationships:</strong> Straight diagonal patterns</li>
                  <li>• <strong>Correlations:</strong> Clear positive or negative trends</li>
                  <li>• <strong>Clusters:</strong> Groups of similar data points</li>
                  <li>• <strong>Outliers:</strong> Points far from the main pattern</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Color Coding:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• <strong>Blue (low):</strong> Fast detection times</li>
                  <li>• <strong>Yellow (medium):</strong> Moderate detection times</li>
                  <li>• <strong>Red (high):</strong> Slow detection times</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
