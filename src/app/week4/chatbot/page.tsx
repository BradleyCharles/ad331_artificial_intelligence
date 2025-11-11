import Link from "next/link";
import Chatbot from "../Chatbot";

export default function Week4Chatbot() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/week4" className="text-blue-600 dark:text-blue-400 hover:underline">
                ← Back to Week 4
              </Link>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">Week 4 Chatbot</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Interact with the TinyLlama model and explore how different parameters shape its responses.
              </p>
            </div>
            <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium">
              LLM Playground
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Chatbot />
      </div>
    </div>
  );
}
