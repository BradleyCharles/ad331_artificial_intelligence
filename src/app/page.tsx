import Link from "next/link";

export default function Home() {
  const weeks = [
    { number: 1, title: "Development Environment Setup and Data Exploration", description: "The goal of this assignment is to establish a functional development environment for Machine Learning, demonstrate proficiency with essential Python libraries, and apply basic data exploration and visualization techniques to understand a real-world dataset." },
    { number: 2, title: "Linear Regression, Data Cleaning, and Feature Engineering", description: "The goal of this assignment is to apply the principles of the ML lifecycle by selecting a real-world dataset, implementing necessary data cleaning and feature engineering steps, and training a simple Linear Regression model to predict a continuous target variable." },
    { number: 3, title: "Building a Simple Neural Network for Classification", description: "The goal of this assignment is to introduce the foundational concepts of Deep Learning by having you build, train, and evaluate a simple Feedforward Neural Network (FNN) using a major deep learning framework (TensorFlow/Keras, PyTorch or scikit-learn)." },
    { number: 4, title: "", description: "" },
    { number: 5, title: "", description: "" },
    { number: 6, title: "", description: "" },
    { number: 7, title: "", description: "" },
    { number: 8, title: "", description: "" },
    { number: 9, title: "", description: "" },
    { number: 10, title: "", description: "" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Course Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">AD331</h1>
          <h2 className="text-2xl md:text-3xl font-semibold">Artificial Intelligence</h2>
         </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Assignments</h3>
        </div>

        {/* Weeks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {weeks.map((week) => (
            <Link
              key={week.number}
              href={`/week${week.number}`}
              className="group bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-600"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    Week {week.number}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {week.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {week.description}
                </p>
                <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                  View Assignments
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Course Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Python Programming</h4>
              <p className="text-gray-600 dark:text-gray-300">Hands-on coding with Python, NumPy, Pandas, and scikit-learn</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">FastAPI Backend</h4>
              <p className="text-gray-600 dark:text-gray-300">Modern API development with FastAPI for assignment management</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Deep Learning</h4>
              <p className="text-gray-600 dark:text-gray-300">TensorFlow and PyTorch for neural networks and deep learning</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
