import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteStatusBadge } from "@/components/site-status-badge";
import { getSiteById, trialSites } from "@/lib/trial-sites";

type SiteDetailPageProps = {
  params: Promise<{ siteId: string }>;
};

export function generateStaticParams() {
  return trialSites.map((site) => ({ siteId: site.id }));
}

export default async function SiteDetailPage({ params }: SiteDetailPageProps) {
  const { siteId } = await params;
  const site = getSiteById(siteId);

  if (!site) {
    notFound();
  }

  const enrollmentProgress = Math.round((site.enrolledPatients / site.enrollmentTarget) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/trial-sites" className="text-sm font-medium text-sky-700 hover:text-sky-900">
            ← Back to trial sites
          </Link>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{site.name}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {site.location} · PI: {site.principalInvestigator}
          </p>
        </div>
        <SiteStatusBadge status={site.status} />
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Enrollment Progress</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{enrollmentProgress}%</p>
          <p className="text-xs text-slate-500">
            {site.enrolledPatients}/{site.enrollmentTarget} participants
          </p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Therapeutic Area</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{site.therapeuticArea}</p>
          <p className="text-xs text-slate-500">Primary trial focus</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Last Updated</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{site.lastUpdated}</p>
          <p className="text-xs text-slate-500">Most recent site check-in</p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Open Cohorts</h3>
          <ul className="mt-4 space-y-3">
            {site.openCohorts.map((cohort) => (
              <li key={cohort} className="rounded-lg border border-slate-100 p-3">
                <p className="font-medium text-slate-900">{cohort}</p>
                <p className="text-sm text-slate-500">
                  Eligibility checks and pre-screening currently enabled.
                </p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Site Notes</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="rounded-lg border border-slate-100 p-3">
              Weekly monitoring call completed.
            </li>
            <li className="rounded-lg border border-slate-100 p-3">
              Query turnaround time is currently within SLA.
            </li>
            <li className="rounded-lg border border-slate-100 p-3">
              Next data quality review scheduled for Tuesday.
            </li>
          </ul>
        </article>
      </section>
    </div>
  );
}
