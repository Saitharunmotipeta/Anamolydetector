export default function Topbar() {
  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      <div className="text-sm text-gray-500">
        Observability & Anomaly Monitoring
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm">
          U
        </div>
      </div>
    </header>
  );
}
