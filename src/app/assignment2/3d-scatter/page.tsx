import Link from "next/link";

export default function Scatter3DPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/assignment2" className="text-green-600 dark:text-green-400 hover:underline">
                ← Back to Assignment 2
              </Link>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                3D Scatter Plot
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                3D visualization of key security features
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                3D Interactive
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              3D Feature Visualization
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This 3D interactive plot shows the relationship between three key security features:
              <strong> Logins, Failed Logins, and Data Transfer</strong>. The color represents the time to detection.
            </p>
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">3D Controls:</h3>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>• <strong>Rotate:</strong> Click and drag to rotate the 3D view</li>
                <li>• <strong>Zoom:</strong> Use mouse wheel or pinch gestures</li>
                <li>• <strong>Pan:</strong> Right-click and drag to move the view</li>
                <li>• <strong>Reset:</strong> Double-click to reset to original view</li>
                <li>• <strong>Hover:</strong> Hover over points for detailed information</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-4 text-center">
            <iframe
              src="/visualizations/interactive/interactive_3d_scatter.html"
              width="100%"
              height="700"
              className="border-0 rounded-lg"
              title="3D Interactive Scatter Plot"
            />
          </div>

          <div className="mt-6 bg-gray-50 dark:bg-gray-600 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Feature Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">X-Axis: Logins</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Number of logins in the last 24 hours. Higher values may indicate normal user activity.
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Y-Axis: Failed Logins</h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Number of failed login attempts. Higher values suggest potential security threats.
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
                <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Z-Axis: Data Transfer</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Data transfer in MB. Higher values may indicate data exfiltration attempts.
                </p>
              </div>
            </div>
            
            <div className="mt-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Pattern Interpretation:</h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• <strong>Clusters in corners:</strong> Distinct behavioral patterns</li>
                <li>• <strong>Diagonal patterns:</strong> Correlated features</li>
                <li>• <strong>Color gradients:</strong> Detection time patterns</li>
                <li>• <strong>Outliers:</strong> Unusual security events</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
