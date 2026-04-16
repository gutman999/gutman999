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

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-sky-600">AI Workspace</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Cohort Search Assistant
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter a plain-English request and TrialFlow AI will apply rules-based matching over trial
          site data to return ranked recommendations.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <form method="get" className="space-y-3">
          <label htmlFor="assistant-query" className="text-sm font-medium text-slate-700">
            Ask TrialFlow AI
          </label>
          <textarea
            id="assistant-query"
            name="q"
            rows={4}
            defaultValue={requestQuery}
            className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-700"
          />
          <button
            type="submit"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Run Search
          </button>
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

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Assistant Recommendations</h3>
            <p className="mt-1 text-sm text-slate-500">
              Ranked by weighted fit score across therapeutic match, startup speed, and enrollment
              readiness.
            </p>
          </div>
          <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">
            Rules-based assistant
          </span>
        </div>

        <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="text-sm font-medium text-slate-900">Summary</p>
          <p className="mt-1 text-sm text-slate-600">{searchOutput.summary}</p>
        </div>

        <div className="mt-4 space-y-3">
          {searchOutput.recommendations.length === 0 ? (
            <article className="rounded-lg border border-slate-100 p-4">
              <p className="font-medium text-slate-900">No exact site matches found</p>
              <p className="mt-1 text-sm text-slate-600">
                Broaden your query by removing strict constraints like fast startup or a specific
                region.
              </p>
            </article>
          ) : (
            searchOutput.recommendations.map((recommendation, index) => (
              <article key={recommendation.site.id} className="rounded-lg border border-slate-100 p-4">
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
