import Link from "next/link";

export default function CorrelationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/week2" className="text-purple-600 dark:text-purple-400 hover:underline">
                ← Back to Week 2
              </Link>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                Interactive Correlation Heatmap
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Interactive feature correlation matrix
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium">
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
              Feature Correlation Analysis
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This interactive heatmap shows the correlation between all features in your dataset. 
              Understanding these relationships is crucial for feature selection and model interpretation.
            </p>
            <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">How to Read:</h3>
              <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                <li>• <strong>Red (positive):</strong> Features increase together</li>
                <li>• <strong>Blue (negative):</strong> Features move in opposite directions</li>
                <li>• <strong>White (neutral):</strong> No strong relationship</li>
                <li>• <strong>Hover:</strong> See exact correlation values</li>
                <li>• <strong>Click:</strong> Focus on specific feature relationships</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-4 text-center">
            <iframe
              src="/visualizations/interactive/interactive_correlation.html"
              width="100%"
              height="600"
              className="border-0 rounded-lg"
              title="Interactive Correlation Heatmap"
            />
          </div>

          <div className="mt-6 bg-gray-50 dark:bg-gray-600 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Correlation Interpretation Guide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Correlation Strength:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• <strong>0.7 - 1.0:</strong> Very strong correlation</li>
                  <li>• <strong>0.5 - 0.7:</strong> Strong correlation</li>
                  <li>• <strong>0.3 - 0.5:</strong> Moderate correlation</li>
                  <li>• <strong>0.1 - 0.3:</strong> Weak correlation</li>
                  <li>• <strong>0.0 - 0.1:</strong> Negligible correlation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Key Insights:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• <strong>High correlations:</strong> May indicate redundancy</li>
                  <li>• <strong>Target correlations:</strong> Most important for prediction</li>
                  <li>• <strong>Negative correlations:</strong> Inverse relationships</li>
                  <li>• <strong>Diagonal (1.0):</strong> Perfect self-correlation</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg p-4">
              <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Model Implications:</h4>
              <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                <li>• <strong>Multicollinearity:</strong> High correlations between features can affect model stability</li>
                <li>• <strong>Feature Selection:</strong> Remove highly correlated features to avoid redundancy</li>
                <li>• <strong>Target Correlation:</strong> Features with high correlation to target are most predictive</li>
                <li>• <strong>Interaction Terms:</strong> Consider creating interaction features for correlated pairs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
