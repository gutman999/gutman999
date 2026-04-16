import type { FeasibilityLabel } from "@/lib/feasibility-score";
import { trialSiteFeasibility, type SiteFeasibility } from "@/lib/trial-sites";

export const DEFAULT_COHORT_QUERY =
  "Show sites best suited for a Phase 2 oncology study with fast startup time.";

export const suggestedCohortPrompts = [
  DEFAULT_COHORT_QUERY,
  "Find high-volume cardiology sites in the Northeast with strong retention.",
  "Recommend western region sites for an immunology trial with quick activation.",
];

type CohortSearchIntent = {
  rawQuery: string;
  phase: 1 | 2 | 3 | 4 | null;
  therapeuticArea: string | null;
  regions: string[];
  prefersFastStartup: boolean;
  needsHighEnrollment: boolean;
  prioritizesRetention: boolean;
};

export type CohortRecommendation = {
  site: SiteFeasibility["site"];
  fitScore: number;
  feasibilityLabel: FeasibilityLabel;
  rationale: string[];
};

export type CohortSearchResult = {
  confidence: number;
  summary: string;
  recommendations: CohortRecommendation[];
};

const therapeuticAreaAliases: Record<string, string> = {
  oncology: "Oncology",
  cardio: "Cardiology",
  cardiology: "Cardiology",
  neuro: "Neurology",
  neurology: "Neurology",
  endocrinology: "Endocrinology",
  endocrine: "Endocrinology",
  immunology: "Immunology",
  pulmonology: "Pulmonology",
  pulmonary: "Pulmonology",
  gastroenterology: "Gastroenterology",
  gastro: "Gastroenterology",
  rheumatology: "Rheumatology",
  dermatology: "Dermatology",
  "women's health": "Women’s Health",
  "womens health": "Women’s Health",
  infectious: "Infectious Disease",
  "infectious disease": "Infectious Disease",
  "rare disease": "Rare Disease",
};

const regionAliases: Record<string, string[]> = {
  northeast: ["Northeast"],
  southeast: ["Southeast"],
  midwest: ["Midwest"],
  southwest: ["Southwest"],
  mountain: ["Mountain"],
  "west coast": ["West"],
  "western us": ["West", "Southwest", "Mountain"],
  west: ["West"],
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalize(value: number, min: number, max: number) {
  if (max === min) {
    return 1;
  }
  return clamp((value - min) / (max - min), 0, 1);
}

function parsePhase(query: string): 1 | 2 | 3 | 4 | null {
  const match = query.match(/\bphase\s*(1|2|3|4|i|ii|iii|iv)\b/);
  if (!match) {
    return null;
  }
  const token = match[1];
  if (token === "1" || token === "i") {
    return 1;
  }
  if (token === "2" || token === "ii") {
    return 2;
  }
  if (token === "3" || token === "iii") {
    return 3;
  }
  return 4;
}

function parseTherapeuticArea(query: string, availableAreas: string[]) {
  for (const area of availableAreas) {
    if (query.includes(area.toLowerCase())) {
      return area;
    }
  }
  for (const [alias, area] of Object.entries(therapeuticAreaAliases)) {
    if (query.includes(alias)) {
      return area;
    }
  }
  return null;
}

function parseRegions(query: string, availableRegions: string[]) {
  const regions = new Set<string>();

  for (const region of availableRegions) {
    if (query.includes(region.toLowerCase())) {
      regions.add(region);
    }
  }

  for (const [alias, mappedRegions] of Object.entries(regionAliases)) {
    if (!query.includes(alias)) {
      continue;
    }
    mappedRegions.forEach((region) => regions.add(region));
  }

  return Array.from(regions);
}

function parseIntent(query: string, entries: SiteFeasibility[]): CohortSearchIntent {
  const normalizedQuery = query.trim().toLowerCase();
  const availableAreas = Array.from(new Set(entries.map((entry) => entry.site.therapeuticArea)));
  const availableRegions = Array.from(new Set(entries.map((entry) => entry.site.region)));

  return {
    rawQuery: query.trim(),
    phase: parsePhase(normalizedQuery),
    therapeuticArea: parseTherapeuticArea(normalizedQuery, availableAreas),
    regions: parseRegions(normalizedQuery, availableRegions),
    prefersFastStartup:
      normalizedQuery.includes("fast startup") ||
      normalizedQuery.includes("quick startup") ||
      normalizedQuery.includes("rapid startup") ||
      normalizedQuery.includes("quick activation"),
    needsHighEnrollment:
      normalizedQuery.includes("high-volume") ||
      normalizedQuery.includes("high volume") ||
      normalizedQuery.includes("best suited") ||
      normalizedQuery.includes("enroll") ||
      normalizedQuery.includes("enrollment"),
    prioritizesRetention:
      normalizedQuery.includes("retention") || normalizedQuery.includes("low dropout"),
  };
}

function getPhaseExperienceThreshold(phase: 1 | 2 | 3 | 4 | null) {
  if (phase === 1) {
    return 8;
  }
  if (phase === 2) {
    return 14;
  }
  if (phase === 3) {
    return 20;
  }
  if (phase === 4) {
    return 24;
  }
  return null;
}

function applyHardFilters(entries: SiteFeasibility[], intent: CohortSearchIntent) {
  let filtered = entries;

  if (intent.therapeuticArea) {
    const next = filtered.filter((entry) => entry.site.therapeuticArea === intent.therapeuticArea);
    if (next.length > 0) {
      filtered = next;
    }
  }

  if (intent.regions.length > 0) {
    const next = filtered.filter((entry) => intent.regions.includes(entry.site.region));
    if (next.length > 0) {
      filtered = next;
    }
  }

  if (intent.prefersFastStartup) {
    const next = filtered.filter((entry) => entry.site.startupDays <= 90);
    if (next.length > 0) {
      filtered = next;
    }
  }

  const phaseThreshold = getPhaseExperienceThreshold(intent.phase);
  if (phaseThreshold) {
    const next = filtered.filter((entry) => entry.site.previousTrialCount >= phaseThreshold);
    if (next.length > 0) {
      filtered = next;
    }
  }

  return filtered;
}

function rankRecommendations(entries: SiteFeasibility[], intent: CohortSearchIntent): CohortRecommendation[] {
  const startupMin = Math.min(...entries.map((entry) => entry.site.startupDays));
  const startupMax = Math.max(...entries.map((entry) => entry.site.startupDays));
  const enrollmentMin = Math.min(...entries.map((entry) => entry.projectedMonthlyEnrollment));
  const enrollmentMax = Math.max(...entries.map((entry) => entry.projectedMonthlyEnrollment));
  const retentionMin = Math.min(...entries.map((entry) => entry.site.retentionRate));
  const retentionMax = Math.max(...entries.map((entry) => entry.site.retentionRate));
  const trialCountMin = Math.min(...entries.map((entry) => entry.site.previousTrialCount));
  const trialCountMax = Math.max(...entries.map((entry) => entry.site.previousTrialCount));

  return entries
    .map((entry) => {
      const startupVelocity = 1 - normalize(entry.site.startupDays, startupMin, startupMax);
      const enrollmentPower = normalize(
        entry.projectedMonthlyEnrollment,
        enrollmentMin,
        enrollmentMax,
      );
      const retentionHealth = normalize(entry.site.retentionRate, retentionMin, retentionMax);
      const trialMaturity = normalize(entry.site.previousTrialCount, trialCountMin, trialCountMax);

      let fitScore =
        entry.feasibilityScore * 0.55 +
        startupVelocity * 14 +
        enrollmentPower * 16 +
        retentionHealth * 9 +
        trialMaturity * 6;

      if (intent.prefersFastStartup) {
        fitScore += startupVelocity * 10;
      }
      if (intent.needsHighEnrollment) {
        fitScore += enrollmentPower * 8;
      }
      if (intent.prioritizesRetention) {
        fitScore += retentionHealth * 10;
      }
      if (entry.site.status === "At Risk") {
        fitScore -= 10;
      } else if (entry.site.status === "Planning") {
        fitScore -= 5;
      }

      const roundedFitScore = clamp(Math.round(fitScore), 35, 99);
      const rationale = [
        `${entry.site.startupDays}-day startup and ${entry.site.previousTrialCount} prior trials completed.`,
        `${entry.projectedMonthlyEnrollment.toFixed(1)} projected enrollments per month with ${entry.site.retentionRate}% retention.`,
        `${entry.feasibilityLabel} feasibility profile in ${entry.site.therapeuticArea}.`,
      ];

      return {
        site: entry.site,
        fitScore: roundedFitScore,
        feasibilityLabel: entry.feasibilityLabel,
        rationale,
      };
    })
    .sort((left, right) => right.fitScore - left.fitScore)
    .slice(0, 5);
}

export function searchCohortSites(query: string): CohortSearchResult {
  const requestQuery = query.trim() || DEFAULT_COHORT_QUERY;
  const intent = parseIntent(requestQuery, trialSiteFeasibility);
  const filteredEntries = applyHardFilters(trialSiteFeasibility, intent);
  const rankingPool = filteredEntries.length > 0 ? filteredEntries : trialSiteFeasibility;
  const recommendations = rankRecommendations(rankingPool, intent);

  const confidence =
    recommendations.length === 0
      ? 55
      : clamp(
          Math.round(
            recommendations.reduce((sum, recommendation) => sum + recommendation.fitScore, 0) /
              recommendations.length,
          ),
          60,
          96,
        );

  const summary =
    recommendations.length === 0
      ? "No strong matches found. Try broadening your request by removing strict phase, region, or startup constraints."
      : `Top recommendation: ${recommendations[0].site.name} in ${recommendations[0].site.region} (${recommendations[0].fitScore}/100 fit). ${recommendations[0].site.startupDays}-day startup and ${recommendations[0].site.historicalEnrollmentRate.toFixed(1)}/month historical enrollment make it a strong option for this cohort.`;

  return {
    confidence,
    summary,
    recommendations,
  };
}
