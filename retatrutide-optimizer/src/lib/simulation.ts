import {
  BaselineAssumptions,
  OptimizationControls,
  ProgramPhase,
  SimulationResult,
} from "@/types/simulation";

const MONTHS_IN_YEAR = 12;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const scaleDuration = (
  months: number,
  optimizationPct: number,
  maxImpactPct: number,
) => {
  const normalizedControl = clamp(optimizationPct, 0, 100) / 100;
  const reductionFactor = normalizedControl * maxImpactPct;
  return Math.max(1, Math.round(months * (1 - reductionFactor)));
};

export const defaultAssumptions: BaselineAssumptions = {
  programStartYear: 2026,
  discoveryMonths: 18,
  phase1Months: 12,
  phase2Months: 18,
  phase3Months: 30,
  regulatoryMonths: 12,
  launchReadinessMonths: 9,
  peakAnnualRevenueBillion: 12,
};

export const defaultControls: OptimizationControls = {
  protocolDigitizationPct: 45,
  siteActivationReductionPct: 35,
  enrollmentAccelerationPct: 40,
  dataCleaningAutomationPct: 55,
  regulatoryParallelizationPct: 30,
  launchPrepAccelerationPct: 35,
  qualityRiskMitigationPct: 50,
};

const makeBaselinePhases = (
  assumptions: BaselineAssumptions,
): Omit<ProgramPhase, "optimizedMonths">[] => [
  { label: "Discovery & Design", baselineMonths: assumptions.discoveryMonths },
  { label: "Phase I", baselineMonths: assumptions.phase1Months },
  { label: "Phase II", baselineMonths: assumptions.phase2Months },
  { label: "Phase III", baselineMonths: assumptions.phase3Months },
  { label: "Regulatory Review", baselineMonths: assumptions.regulatoryMonths },
  {
    label: "Launch Readiness",
    baselineMonths: assumptions.launchReadinessMonths,
  },
];

export const runSimulation = (
  assumptions: BaselineAssumptions,
  controls: OptimizationControls,
): SimulationResult => {
  const baselinePhases = makeBaselinePhases(assumptions);

  const discoveryOptimized = scaleDuration(
    assumptions.discoveryMonths,
    controls.protocolDigitizationPct,
    0.18,
  );
  const phase1Optimized = scaleDuration(
    assumptions.phase1Months,
    controls.siteActivationReductionPct,
    0.22,
  );
  const phase2Optimized = scaleDuration(
    assumptions.phase2Months,
    controls.enrollmentAccelerationPct,
    0.2,
  );
  const phase3WithEnrollment = scaleDuration(
    assumptions.phase3Months,
    controls.enrollmentAccelerationPct,
    0.15,
  );
  const phase3Optimized = scaleDuration(
    phase3WithEnrollment,
    controls.dataCleaningAutomationPct,
    0.1,
  );
  const regulatoryOptimized = scaleDuration(
    assumptions.regulatoryMonths,
    controls.regulatoryParallelizationPct,
    0.2,
  );
  const launchOptimized = scaleDuration(
    assumptions.launchReadinessMonths,
    controls.launchPrepAccelerationPct,
    0.25,
  );

  const optimizedPhases: ProgramPhase[] = [
    {
      ...baselinePhases[0],
      optimizedMonths: discoveryOptimized,
    },
    {
      ...baselinePhases[1],
      optimizedMonths: phase1Optimized,
    },
    {
      ...baselinePhases[2],
      optimizedMonths: phase2Optimized,
    },
    {
      ...baselinePhases[3],
      optimizedMonths: phase3Optimized,
    },
    {
      ...baselinePhases[4],
      optimizedMonths: regulatoryOptimized,
    },
    {
      ...baselinePhases[5],
      optimizedMonths: launchOptimized,
    },
  ];

  const baselineTotalMonths = baselinePhases.reduce(
    (total, phase) => total + phase.baselineMonths,
    0,
  );
  const optimizedTotalMonths = optimizedPhases.reduce(
    (total, phase) => total + phase.optimizedMonths,
    0,
  );
  const monthsSaved = baselineTotalMonths - optimizedTotalMonths;

  const projectedLaunchYear =
    assumptions.programStartYear + optimizedTotalMonths / MONTHS_IN_YEAR;
  const projectedLaunchDateLabel = `Q${((optimizedTotalMonths % MONTHS_IN_YEAR) / 3 | 0) + 1} ${Math.floor(projectedLaunchYear)}`;

  const annualRevenue = assumptions.peakAnnualRevenueBillion;
  const revenuePulledForwardBillion = Number(
    ((monthsSaved / MONTHS_IN_YEAR) * annualRevenue * 0.45).toFixed(2),
  );

  const riskReduction =
    controls.qualityRiskMitigationPct * 0.3 +
    controls.dataCleaningAutomationPct * 0.2 +
    controls.regulatoryParallelizationPct * 0.25 +
    controls.protocolDigitizationPct * 0.25;
  const developmentRiskScore = Number((100 - riskReduction).toFixed(1));

  return {
    assumptions,
    controls,
    phases: optimizedPhases,
    baselineTotalMonths,
    optimizedTotalMonths,
    kpis: {
      projectedLaunchDateLabel,
      projectedLaunchYear: Number(projectedLaunchYear.toFixed(2)),
      monthsSaved,
      revenuePulledForwardBillion,
      developmentRiskScore: clamp(developmentRiskScore, 5, 95),
    },
  };
};

export const formatMonths = (value: number) =>
  `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} months`;

export const formatUsdBillions = (value: number) =>
  `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}B`;
