import type { ClinicalTrialSite } from "@/seed/clinical-trial-sites";

export type FeasibilityLabel = "High potential" | "Moderate" | "At risk";

export type FeasibilityInput = Pick<
  ClinicalTrialSite,
  | "eligiblePatientCount"
  | "historicalEnrollmentRate"
  | "retentionRate"
  | "previousTrialCount"
  | "startupDays"
>;

type FeasibilityMetric = keyof FeasibilityInput;

export type FeasibilityMetricBounds = Record<FeasibilityMetric, { min: number; max: number }>;

export const FEASIBILITY_WEIGHTS: Record<FeasibilityMetric, number> = {
  eligiblePatientCount: 0.25,
  historicalEnrollmentRate: 0.3,
  retentionRate: 0.2,
  previousTrialCount: 0.15,
  startupDays: 0.1,
};

const feasibilityLabelColorClasses: Record<FeasibilityLabel, string> = {
  "High potential": "bg-emerald-100 text-emerald-700",
  Moderate: "bg-amber-100 text-amber-700",
  "At risk": "bg-rose-100 text-rose-700",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalize(value: number, min: number, max: number) {
  if (min === max) {
    return 1;
  }
  return clamp((value - min) / (max - min), 0, 1);
}

export function createFeasibilityMetricBounds(sites: FeasibilityInput[]): FeasibilityMetricBounds {
  const initialBounds: FeasibilityMetricBounds = {
    eligiblePatientCount: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
    historicalEnrollmentRate: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
    retentionRate: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
    previousTrialCount: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
    startupDays: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
  };

  return sites.reduce((bounds, site) => {
    bounds.eligiblePatientCount.min = Math.min(bounds.eligiblePatientCount.min, site.eligiblePatientCount);
    bounds.eligiblePatientCount.max = Math.max(bounds.eligiblePatientCount.max, site.eligiblePatientCount);
    bounds.historicalEnrollmentRate.min = Math.min(
      bounds.historicalEnrollmentRate.min,
      site.historicalEnrollmentRate,
    );
    bounds.historicalEnrollmentRate.max = Math.max(
      bounds.historicalEnrollmentRate.max,
      site.historicalEnrollmentRate,
    );
    bounds.retentionRate.min = Math.min(bounds.retentionRate.min, site.retentionRate);
    bounds.retentionRate.max = Math.max(bounds.retentionRate.max, site.retentionRate);
    bounds.previousTrialCount.min = Math.min(bounds.previousTrialCount.min, site.previousTrialCount);
    bounds.previousTrialCount.max = Math.max(bounds.previousTrialCount.max, site.previousTrialCount);
    bounds.startupDays.min = Math.min(bounds.startupDays.min, site.startupDays);
    bounds.startupDays.max = Math.max(bounds.startupDays.max, site.startupDays);

    return bounds;
  }, initialBounds);
}

export function calculateFeasibilityScore(site: FeasibilityInput, bounds: FeasibilityMetricBounds) {
  const weightedScore =
    normalize(
      site.eligiblePatientCount,
      bounds.eligiblePatientCount.min,
      bounds.eligiblePatientCount.max,
    ) *
      FEASIBILITY_WEIGHTS.eligiblePatientCount +
    normalize(
      site.historicalEnrollmentRate,
      bounds.historicalEnrollmentRate.min,
      bounds.historicalEnrollmentRate.max,
    ) *
      FEASIBILITY_WEIGHTS.historicalEnrollmentRate +
    normalize(site.retentionRate, bounds.retentionRate.min, bounds.retentionRate.max) *
      FEASIBILITY_WEIGHTS.retentionRate +
    normalize(
      site.previousTrialCount,
      bounds.previousTrialCount.min,
      bounds.previousTrialCount.max,
    ) *
      FEASIBILITY_WEIGHTS.previousTrialCount +
    (1 - normalize(site.startupDays, bounds.startupDays.min, bounds.startupDays.max)) *
      FEASIBILITY_WEIGHTS.startupDays;

  return Math.round(weightedScore * 100);
}

export function getScoringBounds(sites: FeasibilityInput[]) {
  return createFeasibilityMetricBounds(sites);
}

export function getFeasibilityScore(site: FeasibilityInput, bounds: FeasibilityMetricBounds) {
  return calculateFeasibilityScore(site, bounds);
}

export function getFeasibilityLabel(feasibilityScore: number): FeasibilityLabel {
  if (feasibilityScore >= 80) {
    return "High potential";
  }
  if (feasibilityScore >= 60) {
    return "Moderate";
  }
  return "At risk";
}

export function evaluateSiteFeasibility(site: FeasibilityInput, bounds: FeasibilityMetricBounds) {
  const score = calculateFeasibilityScore(site, bounds);
  return {
    score,
    label: getFeasibilityLabel(score),
  };
}

export function getProjectedMonthlyEnrollment(
  historicalEnrollmentRate: number,
  retentionRate: number,
) {
  return Number((historicalEnrollmentRate * (retentionRate / 100)).toFixed(1));
}

export function getFeasibilityLabelColorClass(label: FeasibilityLabel) {
  return feasibilityLabelColorClasses[label];
}
