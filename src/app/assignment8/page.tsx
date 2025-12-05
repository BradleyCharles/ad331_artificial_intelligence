"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PerClassMetrics = {
  label_id: number;
  label_name: string;
  precision: number;
  recall: number;
  f1: number;
  support: number;
};

type ErrorExample = {
  text: string;
  true_label: string;
  predicted_label: string;
  predicted_score: number;
  reason: string;
};

type EvaluationResult = {
  checkpoint: string;
  dataset: {
    source: string;
    num_rows: number;
    class_distribution: { factual: number; opinion: number };
    notes: string[];
  };
  metrics: {
    accuracy: number;
    precision_macro: number;
    recall_macro: number;
    f1_macro: number;
    per_class: PerClassMetrics[];
  };
  confusion_matrix: {
    labels: string[];
    normalized: number[][];
    raw: number[][];
    image_path: string;
  };
  error_analysis: {
    worst_class: PerClassMetrics;
    examples: ErrorExample[];
    rationale: string;
  };
  runtime_seconds: number;
};

const formatMetric = (value?: number, digits = 3) =>
  typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits) : "—";

export default function Assignment8() {
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runEvaluation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/assignment8/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || `Evaluation failed with status ${response.status}`);
      }

      const data = (await response.json()) as EvaluationResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error while running evaluation.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void runEvaluation();
  }, []);

  const worstClass = result?.error_analysis.worst_class;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950">
      <header className="bg-white/90 dark:bg-gray-900/80 backdrop-blur border-b border-slate-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="text-emerald-600 dark:text-emerald-300 hover:underline">
              ← Back to Course
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">Assignment 8 · Model Evaluation</h1>
            <p className="text-slate-600 dark:text-gray-300">
              Quantitatively score the Assignment 7 classifier with macro metrics, a confusion matrix, and targeted error
              analysis.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => runEvaluation()}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Scoring…" : "Run Evaluation"}
            </button>
            <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-200 text-sm">
              Checkpoint: {result?.checkpoint ?? "—"}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error} — ensure the backend is running at http://localhost:8000.
          </div>
        )}

        <section className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-slate-200/60 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Macro Metrics</h2>
                <p className="text-sm text-slate-600 dark:text-gray-300">
                  Test split size: {result?.dataset.num_rows ?? "—"} • Runtime:{" "}
                  {result ? `${result.runtime_seconds}s` : "—"}
                </p>
              </div>
              <span className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-900 px-3 py-1 rounded-full">
                Held-out test set
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard label="Accuracy" value={result?.metrics.accuracy} />
              <MetricCard label="Precision (macro)" value={result?.metrics.precision_macro} />
              <MetricCard label="Recall (macro)" value={result?.metrics.recall_macro} />
              <MetricCard label="F1 (macro)" value={result?.metrics.f1_macro} accent />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-slate-200/60 dark:border-gray-800 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Test Set Snapshot</h3>
            <div className="flex items-center justify-between text-sm text-slate-700 dark:text-gray-200">
              <span>Source</span>
              <span className="font-semibold">{result?.dataset.source ?? "local"}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-700 dark:text-gray-200">
              <span>Factual</span>
              <span className="font-semibold">{result?.dataset.class_distribution.factual ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-700 dark:text-gray-200">
              <span>Opinion</span>
              <span className="font-semibold">{result?.dataset.class_distribution.opinion ?? "—"}</span>
            </div>
            {result?.dataset.notes?.length ? (
              <div className="rounded-lg bg-slate-50 dark:bg-gray-800 px-3 py-2 text-xs text-slate-600 dark:text-gray-300">
                {result.dataset.notes.join(" ")}
              </div>
            ) : null}
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-slate-200/60 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Normalized Confusion Matrix</h3>
              <span className="text-xs text-slate-600 dark:text-gray-300">
                Percent of true class along rows
              </span>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800">
              {result?.confusion_matrix.image_path ? (
                <img
                  src={result.confusion_matrix.image_path}
                  alt="Assignment 8 confusion matrix"
                  className="w-full h-auto"
                />
              ) : (
                <ConfusionTable matrix={result?.confusion_matrix.normalized} labels={result?.confusion_matrix.labels} />
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-slate-200/60 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Per-Class Scores</h3>
            <div className="mt-4 space-y-3">
              {result?.metrics.per_class.map((item) => (
                <div
                  key={item.label_id}
                  className="rounded-lg border border-slate-200 dark:border-gray-800 px-3 py-2 bg-slate-50 dark:bg-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white capitalize">{item.label_name}</span>
                    <span className="text-xs text-slate-600 dark:text-gray-300">support: {item.support}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-700 dark:text-gray-200 mt-2">
                    <span>P: {formatMetric(item.precision, 2)}</span>
                    <span>R: {formatMetric(item.recall, 2)}</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                      F1: {formatMetric(item.f1, 2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-slate-200/60 dark:border-gray-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Error Analysis</h3>
              <p className="text-sm text-slate-600 dark:text-gray-300">
                Worst-performing class: {worstClass?.label_name ?? "—"} (F1 {formatMetric(worstClass?.f1, 2)})
              </p>
            </div>
            <span className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200 bg-indigo-50 dark:bg-indigo-900 px-3 py-1 rounded-full">
              Qualitative review
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {result?.error_analysis.examples.length ? (
              result.error_analysis.examples.map((example, idx) => (
                <article
                  key={idx}
                  className="rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-600 dark:text-gray-300">
                    <span>Misclassified {example.true_label}</span>
                    <span className="text-emerald-700 dark:text-emerald-300">
                      → predicted {example.predicted_label} ({formatMetric(example.predicted_score, 2)})
                    </span>
                  </div>
                  <p className="text-slate-900 dark:text-white text-sm leading-relaxed">{example.text}</p>
                  <p className="text-xs text-slate-600 dark:text-gray-300">{example.reason}</p>
                </article>
              ))
            ) : (
              <div className="col-span-2 text-sm text-slate-600 dark:text-gray-300">No misclassifications found.</div>
            )}
          </div>

          {result?.error_analysis.rationale ? (
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-100">
              {result.error_analysis.rationale}
            </div>
          ) : null}
        </section>

        <section className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-slate-200/60 dark:border-gray-800 p-6 space-y-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Why macro F1?</h3>
          <p className="text-sm text-slate-700 dark:text-gray-200">
            Accuracy alone can overstate performance when one class dominates. Macro-averaged F1 balances precision and
            recall per class, so the minority label (often &ldquo;opinion&rdquo;) cannot hide behind a strong majority
            class. It is the primary score reported above.
          </p>
        </section>
      </main>
    </div>
  );
}

function MetricCard({ label, value, accent = false }: { label: string; value?: number; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 shadow-sm ${
        accent
          ? "bg-emerald-600 text-white border-emerald-500"
          : "bg-slate-50 dark:bg-gray-800 border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white"
      }`}
    >
      <p className={accent ? "text-xs uppercase tracking-wide text-emerald-100" : "text-xs uppercase tracking-wide text-slate-600 dark:text-gray-300"}>
        {label}
      </p>
      <p className="text-2xl font-bold">{formatMetric(value)}</p>
    </div>
  );
}

function ConfusionTable({ matrix, labels }: { matrix?: number[][]; labels?: string[] }) {
  if (!matrix || !labels) {
    return <div className="p-4 text-sm text-slate-600 dark:text-gray-300">No confusion matrix available.</div>;
  }

  return (
    <table className="w-full text-sm text-slate-800 dark:text-gray-200">
      <thead className="bg-slate-100 dark:bg-gray-800">
        <tr>
          <th className="px-3 py-2 text-left">True / Pred</th>
          {labels.map((label) => (
            <th key={label} className="px-3 py-2 text-left capitalize">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {matrix.map((row, rowIdx) => (
          <tr key={labels[rowIdx]} className="divide-x divide-slate-200 dark:divide-gray-800">
            <th className="px-3 py-2 font-medium capitalize bg-slate-50 dark:bg-gray-800">{labels[rowIdx]}</th>
            {row.map((value, colIdx) => (
              <td key={colIdx} className="px-3 py-2">
                {(value * 100).toFixed(1)}%
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
