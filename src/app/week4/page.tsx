import Link from "next/link";
import TestCases from "./TestCases";

export default function Week4() {
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
                Week 4: Large Language Models (LLMs)
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Experimenting with LLMs using Hugging Face Transformers - Parameter Tuning and Interactive Chat
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                Week 4
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Assignment Overview */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Assignment Overview
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              This assignment focuses on gaining practical experience with state-of-the-art Large Language Models (LLMs) 
              using the Hugging Face Transformers library. We're using the <strong>TinyLlama-1.1B-Chat</strong> model to 
              experiment with text generation and parameter tuning.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                  Core Tasks
                </h3>
                <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    <span>Environment setup with Hugging Face Transformers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    <span>Model loading from Hugging Face Hub</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    <span>Text generation implementation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    <span>Parameter experimentation and analysis</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                  Parameters Tested
                </h3>
                <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span><strong>Temperature:</strong> Controls randomness (0.2, 0.7, 1.2)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span><strong>Top-P:</strong> Nucleus sampling (0.5, 0.9, 1.0)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span><strong>Max New Tokens:</strong> Output length (40, 100, 200)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Model Information
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <strong>Model:</strong> TinyLlama/TinyLlama-1.1B-Chat-v1.0 | 
                <strong> Framework:</strong> PyTorch | 
                <strong> Task:</strong> Text Generation (Chat)
              </p>
            </div>
          </div>
        </div>

        {/* Test Cases Section */}
        <div className="mb-8">
          <TestCases />
        </div>

        {/* Chatbot CTA */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Ready to chat with the model?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Launch the interactive chatbot to experiment with TinyLlama responses in real time.
              </p>
            </div>
            <Link
              href="/week4/chatbot"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Open Chatbot ↗
            </Link>
          </div>
        </div>

        {/* Analysis Section */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Parameter Analysis Guide
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                Temperature
              </h3>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <li><strong>Low (0.2):</strong> More deterministic, focused outputs. Good for factual responses.</li>
                <li><strong>Medium (0.7):</strong> Balanced creativity and coherence. Good default for most tasks.</li>
                <li><strong>High (1.2):</strong> More creative and diverse outputs. Good for creative writing.</li>
              </ul>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                Top-P (Nucleus Sampling)
              </h3>
              <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                <li><strong>Low (0.5):</strong> Considers only high-probability tokens. More conservative outputs.</li>
                <li><strong>Medium (0.9):</strong> Balanced token selection. Good for most use cases.</li>
                <li><strong>High (1.0):</strong> Considers all tokens. Maximum diversity in outputs.</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">
                Max New Tokens
              </h3>
              <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
                <li><strong>Short (40):</strong> Concise, brief responses. Good for quick answers.</li>
                <li><strong>Medium (100):</strong> Balanced length. Good for detailed explanations.</li>
                <li><strong>Long (200):</strong> Comprehensive responses. Good for detailed content.</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-indigo-50 dark:bg-indigo-900 rounded-lg p-6">
            <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3">
              Key Insights from Experiments
            </h4>
            <ul className="space-y-2 text-sm text-indigo-700 dark:text-indigo-300">
              <li>• <strong>Temperature</strong> has the most noticeable effect on output style and creativity</li>
              <li>• <strong>Top-P</strong> works best when combined with appropriate temperature settings</li>
              <li>• <strong>Max New Tokens</strong> directly controls response length and detail level</li>
              <li>• Parameter combinations should be tuned based on the specific task requirements</li>
              <li>• Lower temperature + lower top-p = more focused, factual responses</li>
              <li>• Higher temperature + higher top-p = more creative, diverse responses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
