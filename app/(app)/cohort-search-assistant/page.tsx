const suggestedPrompts = [
  "Find high-volume oncology sites with open CRC cohorts.",
  "Show sites with enrollment under 60% and active outreach plans.",
  "List sites recruiting autoimmune participants in western US.",
];

const assistantResults = [
  {
    site: "Harbor Medical Center",
    reason: "High screening throughput, strong oncology referral network.",
    confidence: "92%",
  },
  {
    site: "Pacific Clinical Group",
    reason: "Strong neurology candidate pool, but requires staffing support.",
    confidence: "84%",
  },
];

export default function CohortSearchAssistantPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-sky-600">AI Workspace</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Cohort Search Assistant
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Use natural-language prompts to identify trial sites that match your cohort strategy.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <label htmlFor="assistant-query" className="text-sm font-medium text-slate-700">
          Ask TrialFlow AI
        </label>
        <textarea
          id="assistant-query"
          rows={4}
          readOnly
          defaultValue="Find sites that can enroll at least 10 melanoma patients this quarter and already have pre-screening workflows in place."
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-700"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt) => (
            <span
              key={prompt}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600"
            >
              {prompt}
            </span>
          ))}
        </div>
        <button className="mt-4 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">
          Run Search
        </button>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Assistant Results</h3>
        <p className="mt-1 text-sm text-slate-500">
          Ranked by expected enrollment performance and operational readiness.
        </p>

        <div className="mt-4 space-y-3">
          {assistantResults.map((result) => (
            <article key={result.site} className="rounded-lg border border-slate-100 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-medium text-slate-900">{result.site}</p>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  Confidence {result.confidence}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{result.reason}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
