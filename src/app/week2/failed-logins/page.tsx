import Link from "next/link";

export default function FailedLoginsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/week2" className="text-red-600 dark:text-red-400 hover:underline">
                ← Back to Week 2
              </Link>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                Failed Login Analysis
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Security threat patterns by hour of day
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm font-medium">
                Security Analysis
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Insights */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Key Security Insights
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">Peak Risk</div>
              <div className="text-sm text-red-800 dark:text-red-200">Highest failed login activity</div>
              <div className="text-lg font-semibold text-red-700 dark:text-red-300 mt-1">14:00-16:00</div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">Risk Hours</div>
              <div className="text-sm text-orange-800 dark:text-orange-200">High-risk periods identified</div>
              <div className="text-lg font-semibold text-orange-700 dark:text-orange-300 mt-1">8 Hours</div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">Low Risk</div>
              <div className="text-sm text-green-800 dark:text-green-200">Safest time periods</div>
              <div className="text-lg font-semibold text-green-700 dark:text-green-300 mt-1">02:00-06:00</div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">Security Implications</h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
              <li>• <strong>Peak Attack Hours:</strong> 14:00-16:00 show highest failed login activity</li>
              <li>• <strong>Coordinated Attacks:</strong> Patterns suggest organized threat campaigns</li>
              <li>• <strong>Detection Correlation:</strong> Higher failed logins lead to faster detection</li>
              <li>• <strong>Resource Planning:</strong> Security teams should focus coverage on high-risk periods</li>
            </ul>
          </div>
        </div>

        {/* Visualizations */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Interactive Analysis
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Static Analysis</h3>
              <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 dark:text-white mb-2">Comprehensive Hourly Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Complete analysis of failed login patterns by hour</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-500">📊 failed_logins_hourly_analysis.png</span>
                  <a 
                    href="/visualizations/static/failed_logins_hourly_analysis.png" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Full Size
                  </a>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Interactive Visualizations</h3>
              <div className="space-y-3">
                <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Hourly Bar Chart</h4>
                  <p className="text-sm text-red-700 dark:text-red-300">Interactive failed logins by hour with risk levels</p>
                  <div className="mt-2 text-xs text-red-600 dark:text-red-400">🌐 failed_logins_hourly_bar.html</div>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4">
                  <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">Scatter Analysis</h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">Failed logins vs detection time correlation</p>
                  <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">🌐 failed_logins_hourly_scatter.html</div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Heatmap</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Hour vs day of week patterns</p>
                  <div className="mt-2 text-xs text-purple-600 dark:text-purple-400">🌐 failed_logins_heatmap.html</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Risk Level Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">Low</div>
              <div className="text-sm text-green-800 dark:text-green-200 mt-1">&lt; 2 failed logins</div>
              <div className="text-lg font-semibold text-green-700 dark:text-green-300 mt-2">16 hours</div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">Medium</div>
              <div className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">2-4 failed logins</div>
              <div className="text-lg font-semibold text-yellow-700 dark:text-yellow-300 mt-2">6 hours</div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">High</div>
              <div className="text-sm text-orange-800 dark:text-orange-200 mt-1">4-6 failed logins</div>
              <div className="text-lg font-semibold text-orange-700 dark:text-orange-300 mt-2">2 hours</div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">Critical</div>
              <div className="text-sm text-red-800 dark:text-red-200 mt-1">&gt; 6 failed logins</div>
              <div className="text-lg font-semibold text-red-700 dark:text-red-300 mt-2">0 hours</div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Enhanced Monitoring</h4>
                <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• Increase monitoring during high-risk hours</li>
                  <li>• Implement real-time failed login alerts</li>
                  <li>• Deploy additional security measures</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Resource Allocation</h4>
                <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• Schedule security team coverage</li>
                  <li>• Focus resources on peak periods</li>
                  <li>• Consider automated responses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Analysis Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="/reports/failed_logins_analysis_report.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center block"
            >
              View Full Report
            </a>
            <a 
              href="/visualizations/static/failed_logins_hourly_analysis.png" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center block"
            >
              Download Analysis
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
