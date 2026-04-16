export type SiteStatus = "Planning" | "Recruiting" | "Active" | "At Risk";

export type TrialSite = {
  id: string;
  name: string;
  principalInvestigator: string;
  location: string;
  therapeuticArea: string;
  enrollmentTarget: number;
  enrolledPatients: number;
  openCohorts: string[];
  status: SiteStatus;
  lastUpdated: string;
};

export const trialSites: TrialSite[] = [
  {
    id: "site-101",
    name: "Harbor Medical Center",
    principalInvestigator: "Dr. Maya Patel",
    location: "Boston, MA",
    therapeuticArea: "Oncology",
    enrollmentTarget: 60,
    enrolledPatients: 44,
    openCohorts: ["CRC-1L", "Melanoma-2L"],
    status: "Active",
    lastUpdated: "2026-04-12",
  },
  {
    id: "site-114",
    name: "Summit Research Institute",
    principalInvestigator: "Dr. Kevin Walsh",
    location: "Denver, CO",
    therapeuticArea: "Autoimmune",
    enrollmentTarget: 40,
    enrolledPatients: 18,
    openCohorts: ["RA-Bio", "Lupus-IND"],
    status: "Recruiting",
    lastUpdated: "2026-04-14",
  },
  {
    id: "site-126",
    name: "Pacific Clinical Group",
    principalInvestigator: "Dr. Alejandra Cruz",
    location: "San Diego, CA",
    therapeuticArea: "Neurology",
    enrollmentTarget: 35,
    enrolledPatients: 27,
    openCohorts: ["ALS-Phase2"],
    status: "At Risk",
    lastUpdated: "2026-04-10",
  },
  {
    id: "site-130",
    name: "Riverbend University Hospital",
    principalInvestigator: "Dr. Nathan Kim",
    location: "Chicago, IL",
    therapeuticArea: "Cardiology",
    enrollmentTarget: 50,
    enrolledPatients: 32,
    openCohorts: ["HFpEF-Prime", "AF-Device"],
    status: "Planning",
    lastUpdated: "2026-04-15",
  },
];

export const dashboardStats = [
  {
    label: "Total Trial Sites",
    value: trialSites.length.toString(),
    detail: "Across 4 therapeutic areas",
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
    detail: "of 185 target participants",
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
