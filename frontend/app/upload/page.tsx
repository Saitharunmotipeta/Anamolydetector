"use client";

import { useState } from "react";
import { api } from "../lib/api";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      // multipart override so axios doesn't force JSON
      await api.post("/logs/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push("/metrics");
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert("Upload failed. Please ensure your file is a valid .log or .txt file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        {/* LEFT – IMAGE */}
        <div className="flex justify-center">
          <div className="w-full max-w-md h-[420px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
            <img
              src="/placeholders/upload-illustration.png"
              alt="Upload Logs Illustration"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* RIGHT – UPLOAD SIDE */}
        <div>
          <h1 className="text-4xl font-semibold text-slate-900">
            Upload Log Files
          </h1>

          <p className="mt-4 text-slate-600 leading-relaxed">
            Upload system or application logs to analyze anomalies, detect
            unusual patterns, and generate real-time metrics dashboards.
          </p>

          {/* CARD */}
          <div className="mt-10 border border-slate-200 rounded-2xl p-10 bg-white shadow-sm">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center">

              <p className="text-slate-600 font-medium">
                Drag & drop your log file here
              </p>

              <p className="mt-2 text-sm text-slate-500">
                or browse from your computer
              </p>

              <input
                type="file"
                accept=".log,.txt"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-6 block w-full text-sm text-slate-600
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0
                           file:bg-cyan-600 file:text-white
                           hover:file:bg-cyan-700"
              />

              {file && (
                <p className="mt-4 text-sm text-emerald-600">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {/* INFO */}
            <div className="mt-6 text-sm text-slate-500 space-y-2">
              <p>• Supported formats: <b>.log</b>, <b>.txt</b></p>
              <p>• Excel files are NOT supported</p>
              <p>• Include timestamp, level, endpoint, status & response time if possible</p>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="mt-8 w-full py-3 rounded-lg bg-cyan-600 text-white font-medium
                         hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Uploading & Analyzing…" : "Upload & Analyze"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
