import {
  clinicalTrialSiteTherapeuticAreas,
  clinicalTrialSites,
  type ClinicalTrialSite,
} from "@/seed/clinical-trial-sites";
import {
  getFeasibilityLabel,
  getFeasibilityScore,
  getProjectedMonthlyEnrollment,
  getScoringBounds,
  type FeasibilityLabel,
} from "@/lib/feasibility-score";

export type SiteStatus = "Planning" | "Recruiting" | "Active" | "At Risk";

export type TrialSite = ClinicalTrialSite & {
  name: string;
  principalInvestigator: string;
  location: string;
  enrollmentTarget: number;
  enrolledPatients: number;
  openCohorts: string[];
  status: SiteStatus;
  lastUpdated: string;
};

export type SiteFeasibility = {
  site: TrialSite;
  feasibilityScore: number;
  projectedMonthlyEnrollment: number;
  feasibilityLabel: FeasibilityLabel;
};

const cohortMap: Record<string, string[]> = {
  Oncology: ["Solid Tumor 1L", "Adjuvant Biomarker Study"],
  Cardiology: ["HF Outcomes", "AF Screening"],
  Neurology: ["Cognitive Decline Registry", "Neuro-Inflammation Arm"],
  Endocrinology: ["Type 2D Metabolic Cohort", "GLP-1 Outcomes"],
  Immunology: ["Autoimmune Response Panel", "Biologic Optimization"],
  Pulmonology: ["COPD Exacerbation Track", "Asthma Severe Subset"],
  Gastroenterology: ["IBD Longitudinal Cohort", "Liver Fibrosis Panel"],
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getEnrollmentTarget(site: ClinicalTrialSite) {
  return clamp(Math.round(site.eligiblePatientCount * 0.22), 35, 140);
}

function getEnrolledPatients(site: ClinicalTrialSite, target: number) {
  const projectedQuarterlyEnrollment = site.historicalEnrollmentRate * 3;
  const retentionAdjusted = projectedQuarterlyEnrollment * (site.retentionRate / 100);
  return clamp(Math.round(retentionAdjusted), 10, target);
}

function getSiteStatus(site: ClinicalTrialSite, enrolledPatients: number, target: number): SiteStatus {
  if (site.startupDays > 120) {
    return "Planning";
  }
  if (site.retentionRate < 78) {
    return "At Risk";
  }
  const enrollmentProgress = enrolledPatients / target;
  if (enrollmentProgress < 0.55) {
    return "Recruiting";
  }
  return "Active";
}

function getOpenCohorts(therapeuticArea: string) {
  return cohortMap[therapeuticArea] ?? [`${therapeuticArea} Expansion Cohort`];
}

export const trialSites: TrialSite[] = clinicalTrialSites.map((site, index) => {
  const enrollmentTarget = getEnrollmentTarget(site);
  const enrolledPatients = getEnrolledPatients(site, enrollmentTarget);
  const dayOfMonth = String((index % 20) + 1).padStart(2, "0");

  return {
    ...site,
    name: site.siteName,
    principalInvestigator: site.piName,
    location: site.region,
    enrollmentTarget,
    enrolledPatients,
    openCohorts: getOpenCohorts(site.therapeuticArea),
    status: getSiteStatus(site, enrolledPatients, enrollmentTarget),
    lastUpdated: `2026-04-${dayOfMonth}`,
  };
});

const scoringBounds = getScoringBounds(trialSites);

export const trialSiteFeasibility: SiteFeasibility[] = trialSites.map((site) => {
  const feasibilityScore = getFeasibilityScore(site, scoringBounds);
  return {
    site,
    feasibilityScore,
    projectedMonthlyEnrollment: getProjectedMonthlyEnrollment(site.historicalEnrollmentRate, site.retentionRate),
    feasibilityLabel: getFeasibilityLabel(feasibilityScore),
  };
});

export const trialSiteFeasibilityRankings = [...trialSiteFeasibility].sort(
  (left, right) => right.feasibilityScore - left.feasibilityScore,
);

const averageFeasibilityScoreValue =
  trialSiteFeasibility.reduce((total, entry) => total + entry.feasibilityScore, 0) /
  trialSiteFeasibility.length;

export const dashboardOverview = {
  totalSites: trialSites.length,
  averageFeasibilityScore: Number(averageFeasibilityScoreValue.toFixed(1)),
  atRiskSites: trialSiteFeasibility.filter((entry) => entry.feasibilityLabel === "At risk").length,
  projectedMonthlyEnrollment: Number(
    trialSiteFeasibility
      .reduce((total, entry) => total + entry.projectedMonthlyEnrollment, 0)
      .toFixed(1),
  ),
};

export const dashboardStats = [
  {
    label: "Total Trial Sites",
    value: trialSites.length.toString(),
    detail: `Across ${clinicalTrialSiteTherapeuticAreas.length} therapeutic areas`,
  },
  {
    label: "Currently Active",
    value: trialSites
      .filter((site) => site.status === "Active" || site.status === "Recruiting")
      .length.toString(),
    detail: "Enrollment open this month",
  },
  {
    label: "Patients Enrolled",
    value: trialSites
      .reduce((total, site) => total + site.enrolledPatients, 0)
      .toString(),
    detail: `of ${trialSites.reduce((total, site) => total + site.enrollmentTarget, 0)} target participants`,
  },
  {
    label: "At-Risk Sites",
    value: trialSites.filter((site) => site.status === "At Risk").length.toString(),
    detail: "Needs follow-up in 48 hours",
  },
];

export function getSiteById(siteId: string) {
  return trialSites.find((site) => site.id === siteId);
}

export { getFeasibilityLabel, getFeasibilityScore, getProjectedMonthlyEnrollment, getScoringBounds };
export { clinicalTrialSites, clinicalTrialSiteTherapeuticAreas };
export type { ClinicalTrialSite };
