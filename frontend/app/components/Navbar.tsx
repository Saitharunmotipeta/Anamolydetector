"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-slate-900"
        >
          AnomalyDetector
        </Link>

        <nav className="flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/dashboard" className="hover:text-slate-900">
            Dashboard
          </Link>
          <Link href="/upload" className="hover:text-slate-900">
            Upload
          </Link>
          <Link href="/metrics" className="hover:text-slate-900">
            Metrics
          </Link>
          <Link href="/rca" className="hover:text-slate-900">
            RCA
          </Link>
        </nav>
      </div>
    </header>
  );
}