"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";

type RCAResponse = {
  root_cause: string;
  impact: string;
  affected_endpoints: string[];
  recommended_actions: string[];
  risk_level: "low" | "medium" | "high" | "critical";
  confidence: number;
};

type RCAResultPayload = {
  available?: boolean;
  generated_at?: string;
  rca?: RCAResponse;
  context_used?: any;
};

export default function RCAPage() {
  const [rca, setRca] = useState<RCAResponse | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [context, setContext] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loadLatest = async () => {
    try {
      setLoading(true);
      const res = await api.get<RCAResultPayload>("/rca/latest");

      if (res.data?.available && res.data.rca) {
        setRca(res.data.rca);
        setGeneratedAt(res.data.generated_at ?? null);
        setContext(res.data.context_used ?? null);
      } else {
        setRca(null);
        setGeneratedAt(null);
        setContext(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLatest();
  }, []);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      await api.post("/rca/generate");
      await loadLatest();
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 bg-slate-50">
        Running AI RCA…
      </div>
    );
  }

  if (!rca) {
    return (
      <div className="min-h-screen bg-slate-50 p-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-slate-900">
            AI Root Cause Analysis
          </h1>

          <div className="bg-white rounded-2xl border shadow-sm p-8">
            <p className="text-slate-600">
              No RCA report exists yet.
            </p>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="mt-6 px-6 py-3 rounded-xl bg-cyan-600 text-white font-medium hover:bg-cyan-700 disabled:opacity-50 transition"
            >
              {generating ? "Analyzing…" : "Generate RCA Report"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const riskClass =
    rca.risk_level === "low"
      ? "bg-emerald-600"
      : rca.risk_level === "medium"
      ? "bg-amber-500"
      : rca.risk_level === "high"
      ? "bg-orange-600"
      : "bg-red-600";

  const fallback = (v: any, text = "No data available") =>
    !v || v === "Unknown" || (Array.isArray(v) && v.length === 0)
      ? <span className="text-slate-400 italic">{text}</span>
      : v;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              AI Root Cause Analysis
            </h1>

            {generatedAt && (
              <p className="text-slate-500 mt-1 text-sm">
                Last analyzed on {new Date(generatedAt).toLocaleString()}
              </p>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50 transition"
          >
            {generating ? "Analyzing…" : "Generate New Report"}
          </button>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`rounded-2xl p-6 text-white shadow-sm ${riskClass}`}>
            <p className="text-sm opacity-80">Risk Level</p>
            <p className="text-2xl font-bold uppercase mt-1">
              {rca.risk_level}
            </p>
          </div>

          <div className="rounded-2xl p-6 bg-emerald-600 text-white shadow-sm">
            <p className="text-sm opacity-80">Confidence</p>
            <p className="text-2xl font-bold mt-1">
              {(rca.confidence * 100).toFixed(0)}%
            </p>
          </div>

          <div className="rounded-2xl p-6 bg-slate-900 text-white shadow-sm">
            <p className="text-sm opacity-80">Analysis Type</p>
            <p className="text-2xl font-bold mt-1">
              Log-Based RCA
            </p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            <Section title="Root Cause">
              {fallback(rca.root_cause)}
            </Section>

            <Section title="Business / System Impact">
              {fallback(rca.impact)}
            </Section>

            <Section title="Affected Components">
              {rca.affected_endpoints?.length ? (
                <div className="flex flex-wrap gap-2">
                  {rca.affected_endpoints.map((ep, i) => (
                    <span
                      key={i}
                      className="px-4 py-1.5 rounded-full bg-slate-200 text-sm text-slate-700"
                    >
                      {ep}
                    </span>
                  ))}
                </div>
              ) : (
                fallback([], "No affected components detected")
              )}
            </Section>

            <Section title="Recommended Corrective Actions">
              {rca.recommended_actions?.length ? (
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  {rca.recommended_actions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              ) : (
                fallback([], "No recommended actions yet")
              )}
            </Section>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-6">

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold mb-2 text-slate-900">
                AI Assessment Notes
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                This report is generated using AI-based correlation across logs,
                anomalies and endpoint stability patterns.
              </p>
            </div>

            {context && (
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h3 className="font-semibold mb-2 text-slate-900">
                  Context Used
                </h3>

                {/* 🔥 SCROLLABLE + LIMITED HEIGHT */}
                <div className="bg-slate-100 rounded-xl p-4 max-h-72 overflow-y-auto text-xs text-slate-700 shadow-inner">
                  <pre>
                    {JSON.stringify(context, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm p-6">
      <h2 className="font-semibold text-slate-900 mb-3">{title}</h2>
      <div className="leading-relaxed text-slate-700">
        {children}
      </div>
    </div>
  );
}
