import { getFeasibilityLabelColorClass } from "@/lib/feasibility-score";
import {
  DEFAULT_COHORT_QUERY,
  suggestedCohortPrompts,
  searchCohortSites,
} from "@/lib/cohort-search-assistant";

type CohortSearchAssistantPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function CohortSearchAssistantPage({
  searchParams,
}: CohortSearchAssistantPageProps) {
  const resolvedSearchParams = await searchParams;
  const requestQuery = resolvedSearchParams?.q?.trim() || DEFAULT_COHORT_QUERY;
  const searchOutput = searchCohortSites(requestQuery);
  const hasResults = searchOutput.recommendations.length > 0;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">AI Workspace</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Cohort Search Assistant
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Enter a plain-English request and TrialFlow AI will apply rules-based matching over trial
          site data to return ranked recommendations.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <form method="get" className="space-y-3">
          <label htmlFor="assistant-query" className="text-sm font-semibold text-slate-700">
            Ask TrialFlow AI (plain English)
          </label>
          <textarea
            id="assistant-query"
            name="q"
            rows={4}
            defaultValue={requestQuery}
            className="w-full rounded-xl border border-slate-300 p-3 text-sm leading-6 text-slate-700"
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Run Search
            </button>
            <span className="text-xs text-slate-500">
              Example: &quot;Show Phase 2 oncology sites with fast startup in the Northeast.&quot;
            </span>
          </div>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestedCohortPrompts.map((prompt) => (
            <a
              key={prompt}
              href={`/cohort-search-assistant?q=${encodeURIComponent(prompt)}`}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 transition hover:border-slate-300 hover:bg-white"
            >
              {prompt}
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Assistant Recommendations</h3>
            <p className="mt-1 text-sm text-slate-500">
              Ranked by weighted fit score across therapeutic match, startup speed, and enrollment
              readiness.
            </p>
          </div>
          <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">
            {hasResults ? `${searchOutput.recommendations.length} matches` : "No matches"}
          </span>
        </div>

        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="text-sm font-medium text-slate-900">Summary</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{searchOutput.summary}</p>
        </div>

        <div className="mt-5 space-y-3">
          {searchOutput.recommendations.length === 0 ? (
            <article className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-5">
              <p className="font-semibold text-slate-900">No exact site matches found</p>
              <p className="mt-2 text-sm text-slate-600">
                Broaden your request by removing strict constraints like region, phase, or startup
                speed.
              </p>
            </article>
          ) : (
            searchOutput.recommendations.map((recommendation, index) => (
              <article key={recommendation.site.id} className="rounded-xl border border-slate-100 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">
                      #{index + 1} {recommendation.site.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {recommendation.site.region} · {recommendation.site.therapeuticArea} · PI{" "}
                      {recommendation.site.principalInvestigator}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">
                      Score {recommendation.fitScore}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getFeasibilityLabelColorClass(
                        recommendation.feasibilityLabel,
                      )}`}
                    >
                      {recommendation.feasibilityLabel}
                    </span>
                  </div>
                </div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {recommendation.rationale.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
