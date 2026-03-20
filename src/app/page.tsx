import Link from "next/link";

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-palace-dark"
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.06) 0%, transparent 60%)",
      }}
    >
      <h1 className="text-4xl font-light text-white/90 mb-2 tracking-tight">
        Mind Palace
      </h1>
      <p className="text-white/50 mb-12 text-center max-w-md">
        Discover patterns in your thoughts. Your insights await in the
        constellation.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/insights"
          className="px-8 py-3 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 text-violet-200 border border-violet-500/30 transition-all text-center"
        >
          View insights
        </Link>
        <Link
          href="/insights?add=1"
          className="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 border border-white/20 transition-all text-center"
        >
          + Add entry
        </Link>
      </div>
    </div>
  );
}
