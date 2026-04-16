"use client";

import { SimulationResult } from "@/types/simulation";

type ScenarioExplanationProps = {
  result: SimulationResult;
};

export function ScenarioExplanation({ result }: ScenarioExplanationProps) {
  const { kpis, optimizedTotalMonths, baselineTotalMonths, controls } = result;
  const accelerationPct = ((kpis.monthsSaved / baselineTotalMonths) * 100).toFixed(1);
  const strongestLevers = [
    ["Data cleaning automation", controls.dataCleaningAutomationPct],
    ["Enrollment acceleration", controls.enrollmentAccelerationPct],
    ["Protocol digitization", controls.protocolDigitizationPct],
    ["Regulatory parallelization", controls.regulatoryParallelizationPct],
    ["Site activation reduction", controls.siteActivationReductionPct],
    ["Launch prep acceleration", controls.launchPrepAccelerationPct],
    ["Quality risk mitigation", controls.qualityRiskMitigationPct],
  ]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label]) => label);

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-6 shadow-sm">
      <h3 className="text-lg font-semibold tracking-tight text-slate-900">
        Scenario explanation
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">
        Under this strategic scenario, the development program compresses from{" "}
        <span className="font-semibold text-slate-900">{baselineTotalMonths} months</span>{" "}
        to <span className="font-semibold text-slate-900">{optimizedTotalMonths} months</span>,
        representing an estimated <span className="font-semibold text-indigo-700">{accelerationPct}% time reduction</span>.
        The model attributes most of the cycle-time improvement to{" "}
        <span className="font-medium text-slate-900">{strongestLevers.join(", ")}</span>.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">
        This portfolio of improvements shifts the projected launch to{" "}
        <span className="font-semibold text-slate-900">{kpis.projectedLaunchDateLabel}</span>{" "}
        and pulls forward approximately{" "}
        <span className="font-semibold text-emerald-700">${kpis.revenuePulledForwardBillion.toFixed(2)}B</span>{" "}
        in modeled revenue timing impact.
      </p>
    </div>
  );
}
