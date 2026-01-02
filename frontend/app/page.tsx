import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full bg-white text-slate-800">

      {/* TOP BAR */}
      <section className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            AnomalyDetector
          </h1>

          <Link
            href="/dashboard"
            className="text-sm font-medium text-cyan-600 hover:text-cyan-700"
          >
            Go to Dashboard →
          </Link>
        </div>
      </section>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
            Intelligent Log Analysis & Anomaly Detection Platform
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            A unified system to collect, process, analyze, and visualize system
            and application logs. Identify anomalies, detect security risks,
            monitor system health, and gain actionable insights using data-driven
            intelligence.
          </p>

          <p className="mt-4 text-slate-600">
            Transform raw logs into structured data, meaningful metrics, and
            AI-powered root cause analysis — all from a single platform.
          </p>

        </div>

        {/* IMAGE PLACEHOLDER */}
        <div className="h-[420px] rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                  <img
                  src="/zd.gif"
            alt="Dashboard Preview"
            className="h-full w-full object-contain"
          />
        </div>

      </section>

      {/* SERVICES SECTION */}
      <section className="bg-slate-50 py-28">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT – CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              {
                title: "Log Ingestion",
                desc: "Collect raw logs from applications, servers, and services in multiple formats.",
              },
              {
                title: "Structured Parsing",
                desc: "Convert unstructured logs into structured, queryable data.",
              },
              {
                title: "Anomaly Detection",
                desc: "Detect unusual patterns, spikes, failures, and suspicious activities.",
              },
              {
                title: "Severity Classification",
                desc: "Categorize anomalies based on impact and risk levels.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
              >
                <h3 className="font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* RIGHT – IMAGE */}
          <div className="h-[420px] rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
              <img
                src="/landpage.jpeg"
                alt="System Architecture Diagram"
                className="h-full w-full object-contain"
              />
            </div>

        </div>
      </section>

      {/* STEP BY STEP EXECUTION */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <h2 className="text-4xl font-semibold text-slate-900 text-center">
          How the System Works
        </h2>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            {
              step: "01",
              title: "Upload Logs",
              desc: "Upload application or system logs securely into the platform.",
            },
            {
              step: "02",
              title: "Parse & Store",
              desc: "Logs are parsed, structured, and stored efficiently for analysis.",
            },
            {
              step: "03",
              title: "Detect Anomalies",
              desc: "Machine learning models identify abnormal behavior and patterns.",
            },
            {
              step: "04",
              title: "Visualize & Analyze",
              desc: "Insights are visualized using interactive dashboards and charts.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-xl border border-slate-200 bg-white"
            >
              <span className="text-cyan-600 font-semibold">
                {item.step}
              </span>
              <h3 className="mt-3 font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT YOU GET SECTION */}
      <section className="bg-slate-50 py-28">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div>
            <h2 className="text-4xl font-semibold text-slate-900">
              What You Get After Analysis
            </h2>

            <ul className="mt-8 space-y-4 text-slate-600">
              <li>• Severity-wise anomaly distribution</li>
              <li>• Log classification counts by type</li>
              <li>• Timeline-based anomaly trends</li>
              <li>• Error spikes and failure patterns</li>
              <li>• Suspicious activity detection</li>
              <li>• AI-assisted root cause explanations</li>
            </ul>
          </div>

          {/* IMAGE PLACEHOLDER */}
          <div className="h-[420px] rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm">
            <img
                src="/graph.jpg"
                alt="System Architecture Diagram"
                className="h-full w-full object-contain"
              />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-7xl mx-auto px-6 py-32 text-center">
        <h2 className="text-4xl font-semibold text-slate-900">
          From Raw Logs to Actionable Intelligence
        </h2>

        <p className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto">
          Gain visibility into system behavior, detect anomalies early, and
          understand issues faster through intelligent analysis and clear
          visualizations.
        </p>

        <div className="mt-10 flex justify-center gap-6">
          <Link
            href="/upload"
            className="px-10 py-4 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-700 transition"
          >
            Start Analyzing Logs
          </Link>

          <Link
            href="/rca"
            className="px-10 py-4 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
          >
            Explore RCA
          </Link>
        </div>
      </section>

    </div>
  );
}