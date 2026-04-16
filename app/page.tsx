import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Welcome</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">TrialFlow AI</h1>
        <p className="max-w-2xl text-base text-slate-600">
          TrialFlow AI helps study teams identify the right clinical trial sites faster by combining
          feasibility scoring, cohort matching, and operational visibility in one dashboard.
        </p>
        <div>
          <Link
            href="/trial-sites"
            className="inline-flex items-center rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            View Trial Sites
          </Link>
        </div>
      </div>
    </main>
  );
}
