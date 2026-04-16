export type BaselineAssumptions = {
  programStartYear: number;
  discoveryMonths: number;
  phase1Months: number;
  phase2Months: number;
  phase3Months: number;
  regulatoryMonths: number;
  launchReadinessMonths: number;
  peakAnnualRevenueBillion: number;
};

export type OptimizationControls = {
  protocolDigitizationPct: number;
  siteActivationReductionPct: number;
  enrollmentAccelerationPct: number;
  dataCleaningAutomationPct: number;
  regulatoryParallelizationPct: number;
  launchPrepAccelerationPct: number;
  qualityRiskMitigationPct: number;
};

export type ProgramPhase = {
  label: string;
  baselineMonths: number;
  optimizedMonths: number;
};

export type SimulationKpis = {
  projectedLaunchDateLabel: string;
  projectedLaunchYear: number;
  monthsSaved: number;
  revenuePulledForwardBillion: number;
  developmentRiskScore: number;
};

export type SimulationResult = {
  assumptions: BaselineAssumptions;
  controls: OptimizationControls;
  phases: ProgramPhase[];
  baselineTotalMonths: number;
  optimizedTotalMonths: number;
  kpis: SimulationKpis;
};
