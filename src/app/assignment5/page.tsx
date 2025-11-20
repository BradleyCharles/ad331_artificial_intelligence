"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

interface RetrievedChunk {
  id: number;
  text: string;
  score: number;
}

interface RagResponse {
  question: string;
  answer: string;
  retrieved_chunks: RetrievedChunk[];
}

interface TestCase {
  id: string;
  title: string;
  description: string;
  question: string;
}

const testCases: TestCase[] = [
  {
    id: "factual",
    title: "Factual",
    description: "Directly answerable from the KB (exhaustion change).",
    question: "How is exhaustion handled in the 2024 rules?",
  },
  {
    id: "foil",
    title: "Foil / General",
    description: "Not in the KB; the model should admit it or rely on general knowledge.",
    question: "What is the best starter pokemon to choose in the GB version of Pokemon Red Version?",
  },
  {
    id: "synthesis",
    title: "Synthesis",
    description: "Needs to combine multiple KB chunks.",
    question:
      "How do weapon mastery updates interact with two-weapon fighting in 2024?",
  },
];

export default function Assignment5() {
  const [question, setQuestion] = useState(
    "How does weapon mastery change dual wielding in 2024?"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RagResponse | null>(null);
  const [runningTests, setRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<
    { meta: TestCase; response: RagResponse | null; error?: string }[]
  >([]);

  const queryRag = async (q: string): Promise<RagResponse> => {
    const response = await fetch(
      "http://localhost:8000/api/assignment5/rag-dnd",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      }
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  };

  const handleAsk = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError("Please enter a question before asking the RAG.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const data = await queryRag(question);
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to contact the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const runTestCases = async () => {
    setRunningTests(true);
    setTestResults([]);
    setError(null);
    const results: { meta: TestCase; response: RagResponse | null; error?: string }[] = [];

    for (const tc of testCases) {
      try {
        const response = await queryRag(tc.question);
        results.push({ meta: tc, response });
      } catch (err) {
        results.push({
          meta: tc,
          response: null,
          error:
            err instanceof Error
              ? err.message
              : "Failed to run this test case.",
        });
      }
    }

    setTestResults(results);
    setRunningTests(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white/80 dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="text-sky-700 dark:text-sky-300 hover:underline"
              >
                ← Back to Course
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                Assignment 5: Retrieval-Augmented Generation
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                Build a mini RAG system over a custom D&D 2024 knowledge base,
                then validate it with targeted test cases.
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-100 px-3 py-1 rounded-full text-sm font-semibold">
                Assignment 5
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 space-y-8">
        {/* Overview */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <svg
                className="w-7 h-7 mr-3 text-sky-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6l4 2m6 3V7a2 2 0 00-1-1.732l-7-4.042a2 2 0 00-2 0l-7 4.042A2 2 0 004 7v10a2 2 0 001 1.732l7 4.042a2 2 0 002 0l7-4.042A2 2 0 0022 17z"
                />
              </svg>
              RAG Pipeline Checklist
            </h2>
            <code className="bg-slate-100 dark:bg-gray-700 text-xs text-slate-700 dark:text-slate-200 px-3 py-1 rounded">
              KB: public/dnd_2024_rule_changes.txt
            </code>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-4 border border-slate-200 dark:border-gray-600">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                Knowledge Base
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                2–3 paragraph text chunks drawn from the curated D&D 2024 rules
                summary file. Chunked by blank lines; tiny fragments filtered
                out.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-4 border border-slate-200 dark:border-gray-600">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                Embedding & Indexing
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Uses `sentence-transformers/all-MiniLM-L6-v2` to embed each
                chunk; embeddings normalized and stored in memory for cosine
                similarity.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-4 border border-slate-200 dark:border-gray-600">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                Retrieval
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Queries are embedded, scored by dot product (cosine), and the
                top-k chunks hydrate the context window.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-4 border border-slate-200 dark:border-gray-600">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                Generation
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Retrieved text is woven into a prompt for TinyLlama via the
                shared `generate_text` wrapper, steering answers to KB content.
              </p>
            </div>
          </div>
        </section>

        {/* Live RAG Playground */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <svg
                className="w-7 h-7 mr-3 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h8m-8 4h6m5-9.5l-6 6-2-2-5 5"
                />
              </svg>
              Ask the D&D RAG
            </h2>
            <span className="text-xs uppercase font-semibold tracking-wide text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900 px-3 py-1 rounded-full">
              Live against backend
            </span>
          </div>

          <form
            onSubmit={handleAsk}
            className="space-y-4 bg-slate-50 dark:bg-gray-700 rounded-lg p-4 border border-slate-200 dark:border-gray-600"
          >
            <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Enter a rules question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-sky-400 min-h-[120px]"
              placeholder="Ask about 2024 PHB changes..."
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Thinking...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Ask the model
                  </>
                )}
              </button>
              {error && (
                <p className="text-sm text-red-600 dark:text-red-300">
                  {error}
                </p>
              )}
            </div>
          </form>

          {result && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Model Answer
                </h3>
                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {result.answer}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                  Retrieved Chunks
                </h4>
                <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
                  {result.retrieved_chunks.map((chunk) => (
                    <div
                      key={chunk.id}
                      className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded-md p-3"
                    >
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 mb-2">
                        <span className="font-semibold">Chunk #{chunk.id}</span>
                        <span className="bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-100 px-2 py-0.5 rounded-full">
                          {chunk.score.toFixed(3)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                        {chunk.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Test Cases */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <svg
                className="w-7 h-7 mr-3 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Assignment 5 Test Cases
            </h2>
            <button
              onClick={runTestCases}
              disabled={runningTests}
              className="inline-flex items-center bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              {runningTests ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Running all tests...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-3-3v6m-7 8l2-6m10 6l-2-6m-3 6l-2-6m4 6l2-6m-6-6l2-6m2 6l-2-6"
                    />
                  </svg>
                  Run 3 Test Cases
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {testCases.map((tc) => (
              <div
                key={tc.id}
                className="border border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-900/40 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-100">
                    {tc.title}
                  </h3>
                  <span className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200 bg-white/70 dark:bg-gray-800 px-2 py-1 rounded">
                    {tc.id}
                  </span>
                </div>
                <p className="text-sm text-amber-800 dark:text-amber-100 mt-2">
                  {tc.description}
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-200 mt-3 bg-white/70 dark:bg-gray-800 px-2 py-2 rounded">
                  Prompt: {tc.question}
                </p>
              </div>
            ))}
          </div>

          {testResults.length === 0 && !runningTests && (
            <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-6 text-center border border-slate-200 dark:border-gray-600">
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                Run the test suite to capture factual, foil, and synthesis behavior.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Each test invokes the backend RAG endpoint and returns retrieved chunks + answers for inspection.
              </p>
            </div>
          )}

          {testResults.length > 0 && (
            <div className="space-y-4">
              {testResults.map(({ meta, response, error }) => (
                <div
                  key={meta.id}
                  className="border border-slate-200 dark:border-gray-700 rounded-lg p-4 bg-slate-50 dark:bg-gray-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">
                        {meta.title}
                      </p>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {meta.question}
                      </h4>
                    </div>
                    <span className="text-xs bg-slate-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-1 rounded-full">
                      {error ? "Error" : "Completed"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {meta.description}
                  </p>

                  {error && (
                    <p className="text-sm text-red-600 dark:text-red-300">
                      {error}
                    </p>
                  )}

                  {response && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                      <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-md p-3">
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                          Answer
                        </p>
                        <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                          {response.answer}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-700 rounded-md p-3">
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300 mb-2">
                          Retrieved evidence
                        </p>
                        <div className="space-y-2 max-h-[220px] overflow-auto pr-1">
                          {response.retrieved_chunks.map((chunk) => (
                            <div
                              key={chunk.id}
                              className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded p-2"
                            >
                              <div className="flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-300 mb-1">
                                <span>Chunk #{chunk.id}</span>
                                <span className="text-sky-700 dark:text-sky-200">
                                  {chunk.score.toFixed(3)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                {chunk.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
