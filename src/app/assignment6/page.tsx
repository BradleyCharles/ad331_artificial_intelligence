/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";

type TestId = "variation" | "noise" | "compliance";

interface ExtractionTest {
  id: TestId;
  name: string;
  why: string;
  how: string;
  examples: string[];
  buildPrompt: (input: string) => string;
}

interface RunResult {
  testId: TestId;
  prompt: string;
  output: string;
  notes: string[];
  evaluation: Evaluation;
}

const schemaSpec = `{
  "name": "",
  "price": 0.00,
  "date": ""
}`;

const tests: ExtractionTest[] = [
  {
    id: "variation",
    name: "Test 1 — Accuracy Under Variation",
    why:
      "Check robustness to phrasing changes. Tiny models memorize patterns; varied wording tests whether it truly extracts fields.",
    how:
      "Send multiple phrasings (punctuation changes, order swaps, slang, typos). Expect identical JSON across forms.",
    examples: [
      'Input A: "John bought the item on March 3rd for $14.99."',
      'Input B: "Purchased by J. Peters on 3/3 for fourteen ninety-nine."',
      'Input C: "Yo! John snagged it — 14.99 bucks — date: 2023-03-03."',
    ],
    buildPrompt: (input) =>
      [
        "Extract structured data into this exact JSON schema:",
        schemaSpec,
        "",
        "Rules:",
        "- Always return valid JSON (no prose).",
        '- Keys: name (string), price (float), date (YYYY-MM-DD or source format string).',
        "- If a field is missing, keep its default value.",
        "- Be consistent across paraphrases.",
        "",
        "Input:",
        input,
      ].join("\n"),
  },
  {
    id: "noise",
    name: "Test 2 — Noise Injection",
    why:
      "Ensure the model ignores distractions and extracts only target fields when surrounded by fluff or extra entities.",
    how:
      "Wrap target data in headers, emojis, unrelated text, extra names/numbers. Check it picks the true fields.",
    examples: [
      "⭐️⭐️⭐️⭐️ Review by Mike ⭐️⭐️⭐️⭐️",
      "BTW my sister Jane bought something else yesterday for $40.",
      "",
      "Actual review:",
      "I grabbed the SuperBrush for $12.50 on 2024-02-12. Great tool.",
    ],
    buildPrompt: (input) =>
      [
        "Extract only the intended fields into JSON:",
        schemaSpec,
        "",
        "Rules:",
        "- Ignore unrelated names, prices, dates, or emojis.",
        "- No extra keys, no prose, no bullet points.",
        "- If multiple candidates exist, choose the one in the actual review context, not in noise.",
        "- Return ONLY a single JSON object (not an array) matching the schema above. Do not explain, do not list steps.",
        "- The first non-whitespace character must be '{' and the last must be '}'.",
        "- Do not duplicate the object. Do not wrap in brackets.",
        "",
        "Input:",
        input,
      ].join("\n"),
  },
  {
    id: "compliance",
    name: "Test 3 — Format Compliance",
    why:
      "Tiny models often follow content but break JSON. Validate strict schema compliance and type consistency.",
    how:
      "Send many inputs; ensure the model never hallucinates keys, keeps types, and returns valid JSON every time.",
    examples: [
      "Criteria:",
      "- Valid JSON (no trailing commas, no unescaped quotes).",
      "- Keys exactly: name, price, date.",
      '- Types: name as string, price as number (e.g., 12.50), date as string.',
      '- Use \"\" or 0.00 if missing.',
    ],
    buildPrompt: (input) =>
      [
        "Output must be valid JSON matching exactly:",
        schemaSpec,
        "",
        "Compliance checks:",
        "- No missing keys, no extra keys.",
        "- No trailing commas or comments.",
        "- Use empty string or 0.00 if a value is absent.",
        "- Return ONLY the JSON object above. Do not explain, do not add text.",
        "",
        "Input:",
        input,
      ].join("\n"),
  },
];

const variationInputs = [
  "John bought the item on March 3rd for $14.99.",
  "Purchased by J. Peters on 3/3 for fourteen ninety-nine.",
  "Yo! John snagged it — 14.99 bucks — date: 2023-03-03.",
  "On 3 March, the buyer John paid 14.99 USD.",
  "Price: $14.99; Name: John; Date: 2023-03-03.",
];

const noiseInput = [
  "⭐️⭐️⭐️⭐️ Review by Mike ⭐️⭐️⭐️⭐️\nBTW my sister Jane bought something else yesterday for $40.\n\nActual review:\nI grabbed the SuperBrush for $12.50 on 2024-02-12. Great tool.",
];

const complianceInputs = [
  "Customer: Alice\nPrice paid: $19.95\nDate: 2024-01-15",
  "Receipt: name=Bob, amount=9.5 dollars, purchased on 9/5/2023",
  "Clara picked this up for 0 dollars (promo) on 2023-12-01",
];

async function callLlm(prompt: string) {
  const response = await fetch("http://localhost:8000/api/assignment4/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      max_new_tokens: 140,
      temperature: 0.7,
      top_p: 0.9,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Backend error: ${response.status} ${detail}`);
  }

  const data = await response.json();
  return data.generated_text as string;
}

export default function Assignment6() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RunResult[]>([]);
  const [finalOutput, setFinalOutput] = useState<RunResult | null>(null);

  const finalPrompt = [
    "Extract the fields name, price, date into this exact JSON object:",
    schemaSpec,
    "",
    "Hard constraints:",
    "- Output a SINGLE JSON object only (no array, no extra text).",
    "- First non-space char must be '{' and last must be '}'.",
    "- Keys: name (string), price (float), date (string).",
    "- If missing, keep defaults (\"\", 0.00, \"\").",
    "- Ignore noise, unrelated names/prices/dates/emojis.",
    "",
    "Input:",
  ].join("\n");

  const evaluate = (text: string): Evaluation => {
    // Strip common markdown fences the model might add
    const cleaned = text
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```$/, "")
      .trim();

    let formatScore = 1;
    let typeScore = 1;
    let clarityScore = 2;
    const notes: string[] = [];

    if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
      formatScore = 4;
    } else {
      notes.push("Output is not a single JSON object.");
    }

    try {
      const parsed = JSON.parse(cleaned);
      const hasKeys =
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed) &&
        ["name", "price", "date"].every((k) => Object.prototype.hasOwnProperty.call(parsed, k));
      if (hasKeys) {
        formatScore = 5;
      } else {
        notes.push("Missing required keys or extra structure.");
      }
      const priceOk = typeof parsed?.price === "number";
      const nameOk = typeof parsed?.name === "string";
      const dateOk = typeof parsed?.date === "string";
      typeScore = [priceOk, nameOk, dateOk].filter(Boolean).length === 3 ? 5 : 3;
      if (!priceOk || !nameOk || !dateOk) notes.push("Types not matching schema.");
      clarityScore = cleaned.length < 400 ? 5 : 3;
    } catch {
      notes.push("JSON parse failed.");
    }

    const overall = Math.min(5, Math.round((formatScore + typeScore + clarityScore) / 3));
    return { formatScore, styleScore: typeScore, clarityScore, overall, notes };
  };

  const runTests = async () => {
    setLoading(true);
    setError(null);
    setResults([]);
    setFinalOutput(null);
    try {
      const newResults: RunResult[] = [];

      // Test 1: variation, multiple inputs
      for (const variant of variationInputs) {
        const prompt = tests.find((t) => t.id === "variation")!.buildPrompt(variant);
        const output = await callLlm(prompt);
        newResults.push({
          testId: "variation",
          prompt,
          output,
          notes: ["Check that extracted JSON matches across all variants."],
          evaluation: evaluate(output),
        });
      }

      // Test 2: noise
      for (const noisy of noiseInput) {
        const prompt = tests.find((t) => t.id === "noise")!.buildPrompt(noisy);
        const output = await callLlm(prompt);
        newResults.push({
          testId: "noise",
          prompt,
          output,
          notes: ["Ensure JSON uses the true review values, not noise fields."],
          evaluation: evaluate(output),
        });
      }

      // Test 3: compliance
      for (const comp of complianceInputs) {
        const prompt = tests.find((t) => t.id === "compliance")!.buildPrompt(comp);
        const output = await callLlm(prompt);
        newResults.push({
          testId: "compliance",
          prompt,
          output,
          notes: ["Validate JSON syntax and schema keys/types."],
          evaluation: evaluate(output),
        });
      }

      setResults(newResults);

      // Final optimized prompt run using best elements (strict single-object schema)
      const finalInput = "Sample: I grabbed the SuperBrush for $12.50 on 2024-02-12. Great tool.";
      const finalPromptFull = [finalPrompt, finalInput].join("\n");
      const finalOut = await callLlm(finalPromptFull);
      setFinalOutput({
        testId: "compliance",
        prompt: finalPromptFull,
        output: finalOut,
        notes: ["Final optimized prompt using strict JSON and noise-ignore rules."],
        evaluation: evaluate(finalOut),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error during run.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="bg-white/90 dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="text-indigo-700 dark:text-indigo-300 hover:underline"
              >
                - Back to Course
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                Assignment 6: Prompt Engineering for Structured Extraction
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                Evaluate TinyLlama on extracting Name, Price, Date into strict JSON under varied conditions.
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100 px-3 py-1 rounded-full text-sm font-semibold">
                Structured Extraction
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 space-y-8">
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <svg
                  className="w-7 h-7 mr-3 text-indigo-600"
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
                LLM Extraction Test Plan
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mt-3">
                Focus on structured data extraction: Name, Price, Date. Three tests target
                robustness to wording changes, noise injection, and strict JSON compliance.
              </p>
            </div>
            <div className="hidden md:flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-400 shadow-inner shadow-amber-300/70">
              <svg
                className="w-8 h-8 text-amber-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 18h6m-4 3h2m-5-6a6 6 0 1111.196-2.348c-.26.69-.781 1.412-1.436 2.085-.63.648-1.41 1.25-1.76 2.096-.21.522-.286 1.14-.286 1.667H9.286c0-.527-.076-1.145-.286-1.667-.35-.846-1.13-1.448-1.76-2.096-.655-.673-1.176-1.395-1.436-2.085A5.998 5.998 0 017 12"
                />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-indigo-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-indigo-900 dark:text-indigo-100">
                - Robustness to wording variations (paraphrases, slang, reordered fields)
              </p>
            </div>
            <div className="bg-emerald-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-emerald-900 dark:text-emerald-100">
                - Noise injection: ignore fluff, emojis, misleading names/prices
              </p>
            </div>
            <div className="bg-sky-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-sky-900 dark:text-sky-100">
                - Strict JSON compliance: fixed keys, valid syntax, correct types
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Test Inputs & Prompts
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Click run to execute all three tests (variation set, noise example, compliance set) against the TinyLlama endpoint.
              </p>
            </div>
            <button
              onClick={runTests}
              disabled={loading}
              className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? "Running tests..." : "Run all tests"}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Outputs & Checks
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Review prompts and outputs. Validate JSON and consistency across variants.
              </p>
            </div>
            <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full">
              {results.length} runs
            </span>
          </div>

          {results.length === 0 && (
            <div className="text-gray-600 dark:text-gray-300 text-sm">
              Run the tests to see prompts and outputs.
            </div>
          )}

          <div className="space-y-6">
            {tests.map((test) => {
              const testRuns = results.filter((r) => r.testId === test.id);
              return (
                <div
                  key={test.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {test.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{test.why}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm text-right">
                      {test.how}
                    </p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 space-y-3">
                    <p className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
                      Example setup
                    </p>
                    <pre className="text-xs bg-gray-900/80 text-gray-100 rounded-lg p-3 overflow-auto max-h-48">
                      {test.examples.join("\n")}
                    </pre>
                    <p className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
                      Schema
                    </p>
                    <pre className="text-xs bg-gray-900/80 text-gray-100 rounded-lg p-3 overflow-auto max-h-32">
                      {schemaSpec}
                    </pre>
                    <div className="space-y-4">
                      {testRuns.length === 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Run tests to see outputs.
                        </p>
                      )}
                      {testRuns.map((run, idx) => (
                        <div
                          key={`${run.testId}-${idx}`}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
                            Variant {idx + 1}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
                            <div className="p-3">
                              <p className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-1">
                                Prompt Sent
                              </p>
                              <pre className="text-xs bg-gray-900/80 text-gray-100 rounded-lg p-3 overflow-auto max-h-48">
                                {run.prompt}
                              </pre>
                            </div>
                            <div className="p-3">
                              <p className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-1">
                                Model Output
                              </p>
                              <div className="text-sm leading-relaxed whitespace-pre-wrap break-words bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 rounded-lg p-3 ring-1 ring-indigo-100 dark:ring-indigo-800 shadow-sm max-h-48 overflow-auto">
                                {run.output}
                              </div>
                              {run.notes.length > 0 && (
                                <ul className="mt-2 text-xs text-gray-600 dark:text-gray-300 list-disc list-inside">
                                  {run.notes.map((n, i) => (
                                    <li key={i}>{n}</li>
                                  ))}
                                </ul>
                              )}
                              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-700 dark:text-gray-200">
                                <div className="bg-indigo-50 dark:bg-gray-700 rounded p-2">
                                  Format: {run.evaluation.formatScore}/5
                                </div>
                                <div className="bg-indigo-50 dark:bg-gray-700 rounded p-2">
                                  Types: {run.evaluation.styleScore}/5
                                </div>
                                <div className="bg-indigo-50 dark:bg-gray-700 rounded p-2">
                                  Clarity: {run.evaluation.clarityScore}/5
                                </div>
                                <div className="bg-indigo-50 dark:bg-gray-700 rounded p-2">
                                  Overall: {run.evaluation.overall}/5
                                </div>
                              </div>
                              {run.evaluation.notes.length > 0 && (
                                <ul className="mt-2 text-xs text-gray-600 dark:text-gray-300 list-disc list-inside">
                                  {run.evaluation.notes.map((note, idxNote) => (
                                    <li key={idxNote}>{note}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {finalOutput && (
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Final Optimized Prompt & Output
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Combines strict single-object schema, noise-ignore rule, and concise decoding settings.
                </p>
              </div>
              <span className="text-xs font-semibold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 px-3 py-1 rounded-full">
                Overall {finalOutput.evaluation.overall}/5
              </span>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-1">
                Prompt
              </p>
              <pre className="text-xs bg-gray-900/80 text-gray-100 rounded-lg p-3 overflow-auto max-h-56">
                {finalOutput.prompt}
              </pre>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-1">
                Output
              </p>
              <div className="text-sm leading-relaxed whitespace-pre-wrap break-words bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 rounded-lg p-3 ring-1 ring-emerald-100 dark:ring-emerald-800 shadow-sm max-h-48 overflow-auto">
                {finalOutput.output}
              </div>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-700 dark:text-gray-200">
                <div className="bg-emerald-50 dark:bg-gray-700 rounded p-2">
                  Format: {finalOutput.evaluation.formatScore}/5
                </div>
                <div className="bg-emerald-50 dark:bg-gray-700 rounded p-2">
                  Types: {finalOutput.evaluation.styleScore}/5
                </div>
                <div className="bg-emerald-50 dark:bg-gray-700 rounded p-2">
                  Clarity: {finalOutput.evaluation.clarityScore}/5
                </div>
                <div className="bg-emerald-50 dark:bg-gray-700 rounded p-2">
                  Overall: {finalOutput.evaluation.overall}/5
                </div>
              </div>
              {finalOutput.evaluation.notes.length > 0 && (
                <ul className="mt-2 text-xs text-gray-600 dark:text-gray-300 list-disc list-inside">
                  {finalOutput.evaluation.notes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
