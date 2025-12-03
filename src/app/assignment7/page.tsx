/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";

interface SplitDistribution {
  factual: number;
  opinion: number;
  total: number;
}

interface TrainResponse {
  dataset: {
    source: string;
    num_rows: number;
    class_distribution: {
      train: SplitDistribution;
      validation: SplitDistribution;
      test: SplitDistribution;
    };
    notes?: string[];
  };
  lora_config: {
    r: number;
    alpha: number;
    dropout: number;
    target_modules: string[];
  };
  train_metrics: {
    training_loss: number | null;
    epochs: number;
    samples_trained: number;
  };
  eval_metrics: Record<string, number>;
  test_metrics: Record<string, number>;
  baseline_metrics: {
    strategy: string;
    majority_label: number;
    predicted_label: string;
    accuracy: number;
  };
  sample_predictions: Prediction[];
}

interface Prediction {
  text: string;
  predicted_label: string;
  score: number;
  label_id: number;
}

interface TestCaseResult extends Prediction {
  case_text: string;
}

const checklist = [
  "Load news statements and tokenize with the RoBERTa tokenizer.",
  "Stratified train/validation/test split with balanced factual vs opinion labels.",
  "Inject LoRA adapters into attention query/value projections (roberta-base).",
  "Fine-tune only adapter parameters; keep the frozen TinyLlama path intact.",
  "Evaluate accuracy, precision/recall/F1, and compare to a majority-class baseline.",
];

const metricLabel = (label: string) =>
  label
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function Assignment7() {
  const [datasetName, setDatasetName] = useState("SetFit/subj");
  const [maxSamples, setMaxSamples] = useState(1000);
  const [epochs, setEpochs] = useState(10);
  const [learningRate, setLearningRate] = useState(0.0005);
  const [warmupRatio, setWarmupRatio] = useState(0.06);
  const [labelSmoothing, setLabelSmoothing] = useState(0.05);
  const [batchSize, setBatchSize] = useState(16);
  const [gradAccum, setGradAccum] = useState(1);
  const [maxLength, setMaxLength] = useState(256);
  const [loraR, setLoraR] = useState(32);
  const [loraAlpha, setLoraAlpha] = useState(64);
  const [loraDropout, setLoraDropout] = useState(0.1);
  const [classificationThreshold, setClassificationThreshold] = useState(0.5);
  const [trainResult, setTrainResult] = useState<TrainResponse | null>(null);
  const [trainError, setTrainError] = useState<string | null>(null);
  const [training, setTraining] = useState(false);

  const [textToClassify, setTextToClassify] = useState(
    "Analysts expect the rate hike to slow hiring through early 2025."
  );
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [predictError, setPredictError] = useState<string | null>(null);
  const [testCasesRunning, setTestCasesRunning] = useState(false);
  const [testCaseError, setTestCaseError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);

  const testStatements = [
    "The unemployment rate fell to 3.5% in the latest report.",
    "I think the new policy will destroy small businesses.",
    "Scientists confirmed water exists on the moon.",
    "The mayor is the worst leader our city has ever had.",
    "Analysts say the merger could reshape the tech industry.",
    "In my opinion, the movie was boring and predictable.",
    "Data show that global temperatures have risen over the past century.",
    "Critics argue the budget is unfair to rural communities.",
    "The spacecraft entered orbit around Mars at 3:24 PM GMT.",
    "Many fans believe this is the greatest album of the decade.",
  ];

  const handleTrain = async () => {
    setTraining(true);
    setTrainError(null);
    setTrainResult(null);
    try {
      const response = await fetch("http://localhost:8000/api/assignment7/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataset_name: datasetName || null,
          max_samples: maxSamples,
          num_train_epochs: epochs,
          learning_rate: learningRate,
          warmup_ratio: warmupRatio,
          label_smoothing: labelSmoothing,
          per_device_train_batch_size: batchSize,
          gradient_accumulation_steps: gradAccum,
          max_length: maxLength,
          lora_r: loraR,
          lora_alpha: loraAlpha,
          lora_dropout: loraDropout,
          classification_threshold: classificationThreshold,
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || `Training failed with status ${response.status}`);
      }

      const data = (await response.json()) as TrainResponse;
      setTrainResult(data);
    } catch (err) {
      setTrainError(err instanceof Error ? err.message : "Unexpected error during training.");
    } finally {
      setTraining(false);
    }
  };

  const handlePredict = async () => {
    setPredicting(true);
    setPredictError(null);
    setPrediction(null);
    try {
      const response = await fetch("http://localhost:8000/api/assignment7/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToClassify }),
      });
      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || `Prediction failed with status ${response.status}`);
      }
      const data = (await response.json()) as Prediction;
      setPrediction(data);
    } catch (err) {
      setPredictError(err instanceof Error ? err.message : "Unexpected error during inference.");
    } finally {
      setPredicting(false);
    }
  };

  const renderMetricCards = (title: string, metrics?: Record<string, number>) => {
    if (!metrics) return null;
    const entries = Object.entries(metrics).filter(([, value]) => typeof value === "number");
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h4>
          <span className="text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900 px-3 py-1 rounded-full">
            Metrics
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="rounded-lg bg-indigo-50 dark:bg-gray-700 px-4 py-3 border border-indigo-100 dark:border-gray-600"
            >
              <p className="text-xs text-indigo-700 dark:text-indigo-200">{metricLabel(key)}</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {Number.isFinite(value) ? value.toFixed(3) : "—"}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="bg-white/80 dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-indigo-700 dark:text-indigo-300 hover:underline">
                ← Back to Course
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                Assignment 7: Parameter-Efficient Fine-Tuning (PEFT)
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                Fine-tune RoBERTa with LoRA to classify news statements as factual vs opinion while keeping
                TinyLlama pathways untouched.
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100 px-3 py-1 rounded-full text-sm font-semibold">
                RoBERTa + LoRA
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 space-y-8">
        <section className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <svg
                  className="w-7 h-7 mr-3 text-indigo-500"
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
                Transfer Learning Plan
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                We bolt LoRA adapters onto the frozen <code>roberta-base</code> encoder to cheaply specialize it for
                news factual-vs-opinion classification. The bundled dataset is a small, balanced JSONL sample loaded
                through <code>datasets</code>, but you can point to any Hugging Face dataset with <code>text</code> and
                <code>label</code> fields.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {checklist.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 bg-slate-50 dark:bg-gray-800 rounded-lg p-4 border border-slate-200 dark:border-gray-700"
                  >
                    <span className="inline-flex w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 items-center justify-center text-sm font-semibold">
                      ✓
                    </span>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-blue-500 text-white rounded-xl p-6 shadow-lg">
              <p className="text-sm uppercase tracking-wide opacity-80">Model Stack</p>
              <h3 className="text-2xl font-bold mt-2">RoBERTa + LoRA</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>• Base: roberta-base (sequence classification head)</li>
                <li>• Adapters: LoRA (r, alpha, dropout configurable)</li>
                <li>• Tokenizer: RoBERTa fast tokenizer</li>
                <li>• Metrics: accuracy, precision, recall, F1</li>
                <li>• Baseline: majority-class accuracy on the test split</li>
              </ul>
              <div className="mt-4 bg-white/15 rounded-lg px-4 py-3 text-sm leading-relaxed">
                Train on a few hundred rows to keep runtime light; LoRA keeps only adapter weights trainable so the
                TinyLlama path remains unchanged.
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Fine-tune & Evaluate</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Configure a dataset and LoRA hyperparameters, then run a short training loop.
                  </p>
                </div>
                <button
                  onClick={handleTrain}
                  disabled={training}
                  className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
                >
                  {training ? "Training..." : "Run Training"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">HF Dataset (optional)</label>
                  <input
                    type="text"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    placeholder="e.g. SetFit/subj"
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Defaults to the HF hub dataset SetFit/subj.</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Max Samples</label>
                  <input
                    type="number"
                    value={maxSamples}
                    onChange={(e) => setMaxSamples(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Keeps training light; splits stay stratified.</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Epochs</label>
                  <input
                    type="number"
                    value={epochs}
                    min={1}
                    step={0.5}
                    onChange={(e) => setEpochs(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Fewer epochs than full fine-tuning.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Learning Rate</label>
                  <input
                    type="number"
                    value={learningRate}
                    step={0.00005}
                    onChange={(e) => setLearningRate(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">LoRA r</label>
                  <input
                    type="number"
                    value={loraR}
                    min={1}
                    onChange={(e) => setLoraR(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">LoRA α</label>
                  <input
                    type="number"
                    value={loraAlpha}
                    min={1}
                    onChange={(e) => setLoraAlpha(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">LoRA Dropout</label>
                  <input
                    type="number"
                    value={loraDropout}
                    step={0.01}
                    min={0}
                    max={0.5}
                    onChange={(e) => setLoraDropout(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Warmup Ratio</label>
                  <input
                    type="number"
                    value={warmupRatio}
                    step={0.01}
                    min={0}
                    max={0.5}
                    onChange={(e) => setWarmupRatio(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Batch Size</label>
                  <input
                    type="number"
                    value={batchSize}
                    min={1}
                    onChange={(e) => setBatchSize(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Grad Accumulation</label>
                  <input
                    type="number"
                    value={gradAccum}
                    min={1}
                    onChange={(e) => setGradAccum(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Max Length</label>
                  <input
                    type="number"
                    value={maxLength}
                    min={64}
                    max={512}
                    onChange={(e) => setMaxLength(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Label Smoothing</label>
                  <input
                    type="number"
                    value={labelSmoothing}
                    step={0.01}
                    min={0}
                    max={1}
                    onChange={(e) => setLabelSmoothing(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Classification Threshold</label>
                  <input
                    type="number"
                    value={classificationThreshold}
                    step={0.01}
                    min={0}
                    max={1}
                    onChange={(e) => setClassificationThreshold(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Probability cutoff for predicting opinion.</p>
                </div>
              </div>

              {trainError && (
                <div className="bg-red-50 dark:bg-red-900/40 text-red-800 dark:text-red-200 rounded-lg px-4 py-3 text-sm">
                  {trainError}
                </div>
              )}
            </div>

            {trainResult && (
              <div className="space-y-6">
                {renderMetricCards("Validation Metrics", trainResult.eval_metrics)}
                {renderMetricCards("Test Metrics", trainResult.test_metrics)}

                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Baseline vs LoRA</h4>
                    <span className="text-xs text-emerald-700 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-900 px-3 py-1 rounded-full">
                      Majority Baseline
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-emerald-50 dark:bg-gray-800 border border-emerald-100 dark:border-gray-700 rounded-lg px-4 py-3">
                      <p className="text-xs uppercase text-emerald-700 dark:text-emerald-200">Baseline Accuracy</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {trainResult.baseline_metrics.accuracy.toFixed(3)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Majority: {trainResult.baseline_metrics.predicted_label}
                      </p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-gray-800 border border-indigo-100 dark:border-gray-700 rounded-lg px-4 py-3">
                      <p className="text-xs uppercase text-indigo-700 dark:text-indigo-200">Test Accuracy</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {trainResult.test_metrics.accuracy?.toFixed(3)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Gain vs baseline:{" "}
                        {(trainResult.test_metrics.accuracy - trainResult.baseline_metrics.accuracy).toFixed(3)}
                      </p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-gray-800 border border-indigo-100 dark:border-gray-700 rounded-lg px-4 py-3">
                      <p className="text-xs uppercase text-indigo-700 dark:text-indigo-200">F1 Score</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {trainResult.test_metrics.f1?.toFixed(3)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Precision/Recall: {trainResult.test_metrics.precision?.toFixed(3)} /{" "}
                        {trainResult.test_metrics.recall?.toFixed(3)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Dataset Snapshot</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Default dataset: <code>SetFit/subj</code> from the Hugging Face hub (subjective vs objective). Uses{" "}
                <code>datasets</code> for loading and stratified splits, with a local jsonl fallback.
              </p>
              {trainResult ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(trainResult.dataset.class_distribution).map(([split, stats]) => (
                      <div key={split} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                        <p className="text-xs uppercase text-gray-500 dark:text-gray-400">{split}</p>
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          {stats.factual} factual / {stats.opinion} opinion
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Total: {stats.total}</p>
                      </div>
                    ))}
                  </div>
                  {trainResult.dataset.notes?.length ? (
                    <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                      {trainResult.dataset.notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Run training to view split sizes and class balance.
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Try the Classifier</h4>
                <span className="text-xs text-indigo-700 dark:text-indigo-200 bg-indigo-50 dark:bg-indigo-900 px-3 py-1 rounded-full">
                  Inference
                </span>
              </div>
              <textarea
                value={textToClassify}
                onChange={(e) => setTextToClassify(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePredict}
                  disabled={predicting}
                  className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
                >
                  {predicting ? "Classifying..." : "Classify Statement"}
                </button>
                <button
                  onClick={async () => {
                    setTestCasesRunning(true);
                    setTestCaseError(null);
                    setTestResults([]);
                    try {
                      const results: TestCaseResult[] = [];
                      for (const text of testStatements) {
                        const response = await fetch("http://localhost:8000/api/assignment7/predict", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ text }),
                        });
                        if (!response.ok) {
                          const detail = await response.text();
                          throw new Error(detail || `Test case failed with status ${response.status}`);
                        }
                        const data = (await response.json()) as Prediction;
                        results.push({ ...data, case_text: text });
                      }
                      setTestResults(results);
                    } catch (err) {
                      setTestCaseError(err instanceof Error ? err.message : "Unexpected error during test cases.");
                    } finally {
                      setTestCasesRunning(false);
                    }
                  }}
                  disabled={testCasesRunning}
                  className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
                >
                  {testCasesRunning ? "Running 10 cases..." : "Run 10 Test Cases"}
                </button>
              </div>
              {predictError && (
                <div className="bg-red-50 dark:bg-red-900/40 text-red-800 dark:text-red-200 rounded-lg px-4 py-3 text-sm">
                  {predictError}
                </div>
              )}
              {prediction && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-slate-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-800 dark:text-gray-100">{prediction.text}</p>
                  <div className="mt-2 flex items-center gap-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        prediction.predicted_label === "opinion"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
                      }`}
                    >
                      {prediction.predicted_label}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Confidence: {prediction.score.toFixed(3)}
                    </span>
                  </div>
                </div>
              )}
              {testCaseError && (
                <div className="bg-red-50 dark:bg-red-900/40 text-red-800 dark:text-red-200 rounded-lg px-4 py-3 text-sm">
                  {testCaseError}
                </div>
              )}
              {testResults.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white">Batch Test Cases (10)</h5>
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Uses the same predict endpoint for quick sanity checks.
                    </span>
                  </div>
                  <div className="space-y-2">
                    {testResults.map((res, idx) => (
                      <div
                        key={`${res.case_text}-${idx}`}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-slate-50 dark:bg-gray-800"
                      >
                        <p className="text-sm text-gray-800 dark:text-gray-100">{res.case_text}</p>
                        <div className="mt-2 flex items-center gap-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              res.predicted_label === "opinion"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
                            }`}
                          >
                            {res.predicted_label}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">Confidence: {res.score.toFixed(3)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
