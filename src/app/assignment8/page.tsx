"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RunConfig = {
  baseModel: string;
  dataset: string;
  objective: string;
  learningRate: number;
  epochs: number;
  batchSize: number;
  gradAccum: number;
  warmupRatio: number;
  maxSeqLength: number;
  loraR: number;
  loraAlpha: number;
  loraDropout: number;
};

type ChecklistItem = { id: string; label: string; done: boolean };

type MetricRow = {
  label: string;
  accuracy: number;
  f1: number;
  loss: number;
  notes: string;
};

const starterConfig: RunConfig = {
  baseModel: "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
  dataset: "data/assignment8/custom_dataset.jsonl",
  objective: "Improve stance classification with tighter calibration and robustness to noisy spans.",
  learningRate: 0.0002,
  epochs: 3,
  batchSize: 32,
  gradAccum: 2,
  warmupRatio: 0.08,
  maxSeqLength: 512,
  loraR: 16,
  loraAlpha: 32,
  loraDropout: 0.1,
};

const starterChecklist: ChecklistItem[] = [
  { id: "dataset", label: "Freeze the dataset snapshot and document splits", done: false },
  { id: "baseline", label: "Record baseline metrics before additional fine-tuning", done: false },
  { id: "lora", label: "Apply/verify adapter injection and trainable parameter count", done: false },
  { id: "eval", label: "Evaluate on held-out set + adversarial/noise set", done: false },
  { id: "report", label: "Write short report: what changed, why, and metrics", done: false },
];

const starterMetrics: MetricRow[] = [
  { label: "Zero-shot baseline", accuracy: 0.624, f1: 0.588, loss: 1.42, notes: "No task-specific tuning" },
  { label: "LoRA warm start", accuracy: 0.781, f1: 0.762, loss: 0.89, notes: "2 epochs, lr=2e-4" },
];

export default function Assignment8() {
  const [config, setConfig] = useState<RunConfig>(starterConfig);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(starterChecklist);
  const [metrics, setMetrics] = useState<MetricRow[]>(starterMetrics);
  const [status, setStatus] = useState(
    "Use this template to plan your additional fine-tuning run and plug it into your backend or notebooks."
  );

  const completion = useMemo(() => {
    const done = checklist.filter((item) => item.done).length;
    return Math.round((done / checklist.length) * 100);
  }, [checklist]);

  const updateConfig = <K extends keyof RunConfig>(key: K, value: RunConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const toggleChecklist = (id: string) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  const saveTemplate = () => {
    setStatus("Template saved locally. Connect these values to your API call or training notebook when ready.");
  };

  const simulateRun = () => {
    const newRow: MetricRow = {
      label: `Planned run #${metrics.length + 1}`,
      accuracy: Math.max(0.65, Math.min(0.9, metrics[metrics.length - 1]?.accuracy + 0.015)),
      f1: Math.max(0.62, Math.min(0.9, metrics[metrics.length - 1]?.f1 + 0.02)),
      loss: Math.max(0.4, metrics[metrics.length - 1]?.loss - 0.05),
      notes: `Draft: ${config.epochs} epochs, lr=${config.learningRate}, r=${config.loraR}`,
    };
    setMetrics((prev) => [...prev, newRow]);
    setStatus("Draft run added. Swap this simulation with real metrics once your job completes.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-slate-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <Link href="/" className="text-indigo-600 dark:text-indigo-300 hover:underline">
              ← Back to Course
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">Assignment 8 · Additional Fine-Tuning</h1>
            <p className="text-slate-600 dark:text-gray-300">Plan, track, and document your second-stage tuning pass.</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100 px-4 py-2 rounded-full text-sm font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              Template Ready
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 space-y-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-slate-200/60 dark:border-gray-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Run Configuration</h2>
              <button
                onClick={saveTemplate}
                className="px-3 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Save Template
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-gray-300">Base model</label>
                <select
                  value={config.baseModel}
                  onChange={(e) => updateConfig("baseModel", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
                >
                  <option>TinyLlama/TinyLlama-1.1B-Chat-v1.0</option>
                  <option>microsoft/phi-2</option>
                  <option>HuggingFaceH4/zephyr-7b-beta</option>
                  <option>tiiuae/falcon-7b-instruct</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-gray-300">Dataset path</label>
                <input
                  value={config.dataset}
                  onChange={(e) => updateConfig("dataset", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
                  placeholder="data/assignment8/custom_dataset.jsonl"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 dark:text-gray-300">Objective</label>
                <textarea
                  value={config.objective}
                  onChange={(e) => updateConfig("objective", e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 pt-2">
              <Field
                label="Learning rate"
                value={config.learningRate}
                onChange={(val) => updateConfig("learningRate", val)}
                step="0.00005"
              />
              <Field label="Epochs" value={config.epochs} onChange={(val) => updateConfig("epochs", val)} step="1" />
              <Field
                label="Batch size"
                value={config.batchSize}
                onChange={(val) => updateConfig("batchSize", val)}
                step="4"
              />
              <Field
                label="Gradient accumulation"
                value={config.gradAccum}
                onChange={(val) => updateConfig("gradAccum", val)}
                step="1"
              />
              <Field
                label="Warmup ratio"
                value={config.warmupRatio}
                onChange={(val) => updateConfig("warmupRatio", val)}
                step="0.01"
              />
              <Field
                label="Max sequence length"
                value={config.maxSeqLength}
                onChange={(val) => updateConfig("maxSeqLength", val)}
                step="32"
              />
              <Field label="LoRA r" value={config.loraR} onChange={(val) => updateConfig("loraR", val)} step="4" />
              <Field
                label="LoRA alpha"
                value={config.loraAlpha}
                onChange={(val) => updateConfig("loraAlpha", val)}
                step="4"
              />
              <Field
                label="LoRA dropout"
                value={config.loraDropout}
                onChange={(val) => updateConfig("loraDropout", val)}
                step="0.02"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={simulateRun}
                className="px-4 py-2 rounded-lg font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Add Planned Run
              </button>
              <p className="text-sm text-slate-600 dark:text-gray-300">{status}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-slate-200/60 dark:border-gray-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Readiness Checklist</h3>
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100">
                {completion}% complete
              </span>
            </div>
            <div className="space-y-3">
              {checklist.map((item) => (
                <label key={item.id} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleChecklist(item.id)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-800 dark:text-gray-200">{item.label}</span>
                </label>
              ))}
            </div>
            <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/40 px-4 py-3 text-sm text-indigo-900 dark:text-indigo-100">
              Tip: swap this checklist for automated preflight checks (dataset hash, adapter params, GPU capacity) once
              you hook up the backend.
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-slate-200/60 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Evaluation Template</h3>
              <span className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900 px-3 py-1 rounded-full">
                Metrics to replace
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-800">
                <thead className="bg-slate-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-gray-200">Run</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-gray-200">
                      Accuracy
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-gray-200">F1</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-gray-200">Loss</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-gray-200">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                  {metrics.map((row) => (
                    <tr key={row.label} className="hover:bg-slate-50 dark:hover:bg-gray-800/60">
                      <td className="px-3 py-2 text-sm font-medium text-slate-900 dark:text-white">{row.label}</td>
                      <td className="px-3 py-2 text-sm text-slate-800 dark:text-gray-200">{row.accuracy.toFixed(3)}</td>
                      <td className="px-3 py-2 text-sm text-slate-800 dark:text-gray-200">{row.f1.toFixed(3)}</td>
                      <td className="px-3 py-2 text-sm text-slate-800 dark:text-gray-200">{row.loss.toFixed(2)}</td>
                      <td className="px-3 py-2 text-sm text-slate-600 dark:text-gray-300">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-slate-200/60 dark:border-gray-800 p-5">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Deliverables</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-gray-200">
                <li>• Notebook or script that launches the updated fine-tune</li>
                <li>• Eval results vs. baseline with clear metric definitions</li>
                <li>• Short write-up: what changed, why, and risks observed</li>
                <li>• Saved adapter weights + configuration for reproducibility</li>
              </ul>
            </div>
            <div className="bg-indigo-600 text-white rounded-xl shadow-lg p-5 space-y-2">
              <h4 className="text-lg font-semibold">Integration Notes</h4>
              <p className="text-sm opacity-90">
                Replace the simulation handlers with calls to your backend endpoint (e.g., `/api/assignment8/train`) once
                it is available. Mirror the payload shape from this form to keep things consistent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: string;
};

function Field({ label, value, onChange, step = "0.01" }: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-600 dark:text-gray-300">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        step={step}
        className="mt-1 w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
      />
    </label>
  );
}
