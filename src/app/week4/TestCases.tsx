"use client";

import { useState } from "react";

interface TestCaseResult {
  parameter_name: string;
  parameter_value: number;
  prompt: string;
  generated_text: string;
}

interface TestCaseExperiment {
  experiment_name: string;
  prompt: string;
  results: TestCaseResult[];
}

export default function TestCases() {
  const [experiments, setExperiments] = useState<TestCaseExperiment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTestCases = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/week4/test-cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExperiments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run test cases");
      console.error("Error running test cases:", err);
    } finally {
      setLoading(false);
    }
  };

  const getParameterLabel = (name: string, value: number): string => {
    switch (name) {
      case "temperature":
        return `Temperature: ${value}`;
      case "top_p":
        return `Top-P: ${value}`;
      case "max_new_tokens":
        return `Max New Tokens: ${value}`;
      default:
        return `${name}: ${value}`;
    }
  };

  const getParameterDescription = (name: string): string => {
    switch (name) {
      case "temperature":
        return "Controls randomness: Lower (0.2) = more deterministic, Higher (1.2) = more creative";
      case "top_p":
        return "Nucleus sampling: Lower (0.5) = fewer token options, Higher (1.0) = all tokens considered";
      case "max_new_tokens":
        return "Output length: Lower (40) = shorter responses, Higher (200) = longer responses";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          LLM Parameter Experimentation Test Cases
        </h2>
        <button
          onClick={runTestCases}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Run Test Cases
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}

      {experiments.length === 0 && !loading && (
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 text-center">
          <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-blue-800 dark:text-blue-200 text-lg mb-2">Ready to Run Test Cases</p>
          <p className="text-blue-600 dark:text-blue-300 text-sm">
            Click the "Run Test Cases" button to execute three experiments:
          </p>
          <ul className="text-blue-600 dark:text-blue-300 text-sm mt-4 space-y-1 text-left max-w-md mx-auto">
            <li>• Temperature Experiment (0.2, 0.7, 1.2)</li>
            <li>• Top-P Experiment (0.5, 0.9, 1.0)</li>
            <li>• Max New Tokens Experiment (40, 100, 200)</li>
          </ul>
        </div>
      )}

      {experiments.map((experiment, expIdx) => (
        <div key={expIdx} className="mb-8 last:mb-0">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg p-6 mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              {experiment.experiment_name}
            </h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Prompt:</p>
              <p className="text-gray-800 dark:text-white italic">"{experiment.prompt}"</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {experiment.results.map((result, resultIdx) => (
              <div
                key={resultIdx}
                className="bg-gray-50 dark:bg-gray-600 rounded-lg p-6 border border-gray-200 dark:border-gray-500"
              >
                <div className="mb-4">
                  <div className="inline-block bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                    {getParameterLabel(result.parameter_name, result.parameter_value)}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {getParameterDescription(result.parameter_name)}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 min-h-[200px]">
                  <p className="text-sm text-gray-800 dark:text-white whitespace-pre-wrap">
                    {result.generated_text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {expIdx < experiments.length - 1 && (
            <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>
          )}
        </div>
      ))}

      {experiments.length > 0 && (
        <div className="mt-8 bg-green-50 dark:bg-green-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
            Analysis Summary
          </h4>
          <div className="space-y-3 text-sm text-green-700 dark:text-green-300">
            <div>
              <strong>Temperature Experiment:</strong> Lower values (0.2) produce more focused, deterministic outputs,
              while higher values (1.2) generate more creative and diverse text. The middle value (0.7) balances creativity and coherence.
            </div>
            <div>
              <strong>Top-P Experiment:</strong> Lower Top-P (0.5) restricts token selection to high-probability tokens,
              resulting in more conservative outputs. Higher Top-P (1.0) considers all tokens, allowing for more diverse responses.
            </div>
            <div>
              <strong>Max New Tokens Experiment:</strong> Shorter token limits (40) produce concise responses,
              while longer limits (200) allow for more detailed and comprehensive outputs.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

