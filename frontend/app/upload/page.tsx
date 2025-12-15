"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async () => {
  if (!file) return;

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("file", file, file.name);

    const res = await api.post(
      "/logs/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("UPLOAD RESPONSE:", res.data);

    await api.post("/anomalies/run");
    await api.post("/anomalies/security");
    await api.get("/metrics/daily");

    router.push("/metrics");
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err?.response || err);
    alert("Upload failed — check console");
  } finally {
    setLoading(false);
  }
};
return (
  <div className="max-w-xl mx-auto relative z-50">
    <h1 className="text-2xl font-semibold mb-4">Upload Logs</h1>

    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* File picker (click-safe) */}
      <label className="block cursor-pointer">
        <input
          type="file"
          accept=".log,.txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />

        <div className="w-full border-2 border-dashed border-indigo-400 rounded-lg p-6 text-center text-gray-600 hover:bg-indigo-50">
          {file ? file.name : "Click here to select a log file"}
        </div>
      </label>

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Processing..." : "Upload & Analyze"}
      </button>
    </div>
  </div>
);
}
