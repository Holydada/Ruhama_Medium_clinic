export const PageLoader = () => (
  <div
    className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-slate-400"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div className="h-10 w-10 rounded-full border-2 border-sky-500/30 border-t-sky-500 animate-spin" />
    <p className="text-sm">Loading module…</p>
  </div>
);
