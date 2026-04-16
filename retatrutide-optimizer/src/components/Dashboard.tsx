"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  CircleDollarSign,
  ShieldAlert,
  Timer,
} from "lucide-react";
import { ControlSlider } from "@/components/dashboard/control-slider";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ScenarioExplanation } from "@/components/dashboard/scenario-explanation";
import { SectionCard } from "@/components/dashboard/section-card";
import { TimelineChart } from "@/components/dashboard/timeline-chart";
import {
  defaultAssumptions,
  defaultControls,
  formatMonths,
  formatUsdBillions,
  runSimulation,
} from "@/lib/simulation";
import { OptimizationControls } from "@/types/simulation";

const controlsConfig: {
  key: keyof OptimizationControls;
  label: string;
  description: string;
}[] = [
  {
    key: "protocolDigitizationPct",
    label: "Protocol Digitization",
    description: "Improve design speed and amendment cycle efficiency.",
  },
  {
    key: "siteActivationReductionPct",
    label: "Site Activation Compression",
    description: "Reduce startup lag for trial site onboarding.",
  },
  {
    key: "enrollmentAccelerationPct",
    label: "Enrollment Acceleration",
    description: "Increase recruitment throughput with patient analytics.",
  },
  {
    key: "dataCleaningAutomationPct",
    label: "Data Cleaning Automation",
    description: "Automate reconciliation and lock-cycle bottlenecks.",
  },
  {
    key: "regulatoryParallelizationPct",
    label: "Regulatory Parallelization",
    description: "Enable rolling submission and cross-functional review prep.",
  },
  {
    key: "launchPrepAccelerationPct",
    label: "Launch Readiness Acceleration",
    description: "Pull manufacturing, market access, and medical affairs forward.",
  },
  {
    key: "qualityRiskMitigationPct",
    label: "Quality Risk Mitigation",
    description: "Lower execution risk through QA automation and visibility.",
  },
];

export default function Dashboard() {
  const [controls, setControls] =
    useState<OptimizationControls>(defaultControls);
  const simulation = useMemo(
    () => runSimulation(defaultAssumptions, controls),
    [controls],
  );

  const onControlChange = (key: keyof OptimizationControls, value: number) => {
    setControls((previous) => ({ ...previous, [key]: value }));
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-8 lg:px-10 lg:py-10">
      <header className="mb-8 rounded-3xl border border-indigo-200/70 bg-white p-8 shadow-sm ring-1 ring-slate-100">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
          Executive Simulation Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">
          Retatrutide Time-to-Market Optimizer
        </h1>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-700 lg:text-base">
          Strategic scenario model illustrating how software and operational
          improvements can compress development-to-launch timelines for Eli
          Lilly&apos;s investigational obesity candidate retatrutide. Outputs
          reflect directional business planning assumptions only.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-medium text-slate-700">
            Browser-based simulation
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-medium text-slate-700">
            No external data sources
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-medium text-slate-700">
            Demo environment
          </span>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          <SectionCard
            title="Baseline Timeline Assumptions"
            subtitle="Reference development plan used as comparator"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Program Start", `${defaultAssumptions.programStartYear}`],
                ["Discovery & Design", formatMonths(defaultAssumptions.discoveryMonths)],
                ["Phase I", formatMonths(defaultAssumptions.phase1Months)],
                ["Phase II", formatMonths(defaultAssumptions.phase2Months)],
                ["Phase III", formatMonths(defaultAssumptions.phase3Months)],
                ["Regulatory Review", formatMonths(defaultAssumptions.regulatoryMonths)],
                [
                  "Launch Readiness",
                  formatMonths(defaultAssumptions.launchReadinessMonths),
                ],
                [
                  "Peak Annual Revenue Assumption",
                  formatUsdBillions(defaultAssumptions.peakAnnualRevenueBillion),
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Optimization Controls"
            subtitle="Tune intervention intensity by capability area"
          >
            <div className="grid gap-4">
              {controlsConfig.map((control) => (
                <ControlSlider
                  key={control.key}
                  label={control.label}
                  description={control.description}
                  value={controls[control.key]}
                  onChange={(value) => onControlChange(control.key, value)}
                />
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard
            title="Projected Impact Summary"
            subtitle="Comparative outcomes under current optimization settings"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <KpiCard
                title="Projected Launch Date"
                value={simulation.kpis.projectedLaunchDateLabel}
                helpText={`Program duration: ${formatMonths(simulation.optimizedTotalMonths)}`}
                icon={CalendarClock}
                tone="indigo"
              />
              <KpiCard
                title="Months Saved"
                value={`${simulation.kpis.monthsSaved.toFixed(0)} months`}
                helpText={`Baseline ${simulation.baselineTotalMonths}m → Optimized ${simulation.optimizedTotalMonths}m`}
                icon={Timer}
                tone="emerald"
              />
              <KpiCard
                title="Revenue Pulled Forward"
                value={formatUsdBillions(simulation.kpis.revenuePulledForwardBillion)}
                helpText="Directional estimate based on launch timing shift"
                icon={CircleDollarSign}
                tone="amber"
              />
              <KpiCard
                title="Development Risk Score"
                value={`${simulation.kpis.developmentRiskScore}/100`}
                helpText="Lower score indicates lower modeled execution risk"
                icon={ShieldAlert}
                tone="rose"
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Timeline Comparison"
            subtitle="Baseline versus optimized phase durations"
          >
            <TimelineChart phases={simulation.phases} />
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
              <span>{simulation.baselineTotalMonths}m baseline</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
              <span>{simulation.optimizedTotalMonths}m optimized</span>
            </div>
          </SectionCard>

          <ScenarioExplanation result={simulation} />
        </div>
      </section>

      <footer className="mt-8 rounded-2xl border border-slate-200 bg-white/80 px-6 py-4 text-xs leading-6 text-slate-600">
        Strategic simulation only. This dashboard is a demonstration artifact
        for business scenario planning and does not represent medical guidance,
        clinical-trial probability, or regulatory outcome prediction.
      </footer>
    </main>
  );
}
