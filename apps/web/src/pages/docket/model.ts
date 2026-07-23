/**
 * The Docket — Indian Court Backlogs
 *
 * All data is hand-built from publicly available aggregated sources:
 *   - National Judicial Data Grid (NJDG): njdg.gov.in — pending case counts by state/level
 *   - eCourts Mission Mode Project reports (2023-24)
 *   - Department of Justice, Ministry of Law & Justice: Annual Report 2022-23
 *   - Supreme Court of India: Annual Report 2022-23
 *   - Law Commission of India: Report No. 245 (Arrears and Backlog)
 *   - DAKSH India court efficiency reports
 *
 * Data notes:
 *   - State-level figures are approximate as of late 2023 / early 2024.
 *   - Figures are rounded to the nearest thousand; totals may not sum exactly.
 *   - India does not publish a single authoritative real-time dataset; numbers
 *     here are cross-referenced from the sources above. Exact current figures
 *     should be verified at njdg.gov.in.
 *   - Singapore comparison data: eLitigation Annual Report 2023, Singapore
 *     Judiciary Statistics 2023, MinLaw digitalization reports.
 */

// ─── Pending cases by state (district + subordinate courts only) ──────────────
// Unit: thousands of pending cases.

export interface StatePending {
  state: string;
  pending: number;       // thousands
  civilPct: number;      // 0-100
  criminalPct: number;   // 0-100
  avgYears: number;      // avg time a case has been pending
  region: "North" | "South" | "East" | "West" | "Central" | "Northeast";
}

export const statePending: StatePending[] = [
  { state: "Uttar Pradesh",       pending: 7820, civilPct: 38, criminalPct: 62, avgYears: 5.2, region: "North" },
  { state: "Maharashtra",         pending: 4250, civilPct: 45, criminalPct: 55, avgYears: 4.8, region: "West" },
  { state: "West Bengal",         pending: 2980, civilPct: 42, criminalPct: 58, avgYears: 5.6, region: "East" },
  { state: "Bihar",               pending: 2640, civilPct: 36, criminalPct: 64, avgYears: 6.1, region: "East" },
  { state: "Rajasthan",           pending: 2120, civilPct: 41, criminalPct: 59, avgYears: 4.4, region: "North" },
  { state: "Madhya Pradesh",      pending: 1980, civilPct: 40, criminalPct: 60, avgYears: 4.7, region: "Central" },
  { state: "Gujarat",             pending: 1620, civilPct: 48, criminalPct: 52, avgYears: 3.9, region: "West" },
  { state: "Tamil Nadu",          pending: 1480, civilPct: 50, criminalPct: 50, avgYears: 3.6, region: "South" },
  { state: "Karnataka",           pending: 1180, civilPct: 46, criminalPct: 54, avgYears: 3.8, region: "South" },
  { state: "Andhra Pradesh",      pending:  980, civilPct: 44, criminalPct: 56, avgYears: 4.1, region: "South" },
  { state: "Odisha",              pending:  890, civilPct: 37, criminalPct: 63, avgYears: 5.0, region: "East" },
  { state: "Haryana",             pending:  820, civilPct: 43, criminalPct: 57, avgYears: 4.3, region: "North" },
  { state: "Delhi",               pending:  790, civilPct: 47, criminalPct: 53, avgYears: 4.0, region: "North" },
  { state: "Punjab",              pending:  720, civilPct: 44, criminalPct: 56, avgYears: 4.6, region: "North" },
  { state: "Jharkhand",           pending:  640, civilPct: 35, criminalPct: 65, avgYears: 5.4, region: "East" },
  { state: "Telangana",           pending:  340, civilPct: 46, criminalPct: 54, avgYears: 3.5, region: "South" },
  { state: "Uttarakhand",         pending:  380, civilPct: 40, criminalPct: 60, avgYears: 4.2, region: "North" },
  { state: "Kerala",              pending:  360, civilPct: 52, criminalPct: 48, avgYears: 3.2, region: "South" },
  { state: "Assam",               pending:  350, civilPct: 38, criminalPct: 62, avgYears: 5.3, region: "Northeast" },
  { state: "Chhattisgarh",        pending:  320, civilPct: 37, criminalPct: 63, avgYears: 4.9, region: "Central" },
];

// ─── Trend: total pending cases across all courts (millions) ──────────────────

export interface TrendPoint {
  year: number;
  total: number;        // millions, all courts
  district: number;     // millions, district + subordinate
  highCourt: number;    // millions
  supreme: number;      // thousands (note: different unit!)
}

export const trendData: TrendPoint[] = [
  { year: 2015, total: 26.4, district: 22.8, highCourt: 3.5,  supreme: 62 },
  { year: 2016, total: 27.9, district: 24.0, highCourt: 3.7,  supreme: 66 },
  { year: 2017, total: 29.1, district: 25.1, highCourt: 3.9,  supreme: 70 },
  { year: 2018, total: 29.8, district: 25.8, highCourt: 3.9,  supreme: 73 },
  { year: 2019, total: 32.6, district: 28.2, highCourt: 4.3,  supreme: 76 },
  { year: 2020, total: 36.1, district: 31.3, highCourt: 4.7,  supreme: 71 }, // COVID-year spike
  { year: 2021, total: 38.4, district: 33.2, highCourt: 5.0,  supreme: 73 },
  { year: 2022, total: 41.0, district: 35.5, highCourt: 5.4,  supreme: 78 },
  { year: 2023, total: 44.7, district: 38.4, highCourt: 5.8,  supreme: 80 },
  { year: 2024, total: 49.6, district: 43.5, highCourt: 6.1,  supreme: 82 },
];

// ─── Court-level breakdown ────────────────────────────────────────────────────

export interface CourtLevel {
  level: string;
  shortLabel: string;
  pending: number;       // millions (except Supreme Court: thousands)
  pendingUnit: "M" | "K";
  judgesSanctioned: number;
  judgesActual: number;
  vacancyPct: number;
  avgDisposalYears: number;
  annualFiling: number;  // millions
  annualDisposal: number;
  disposalRate: number;  // annualDisposal / annualFiling (%)
}

export const courtLevels: CourtLevel[] = [
  {
    level: "District & Subordinate Courts",
    shortLabel: "District",
    pending: 43.5,
    pendingUnit: "M",
    judgesSanctioned: 24631,
    judgesActual: 18334,
    vacancyPct: 25.6,
    avgDisposalYears: 4.8,
    annualFiling: 21.4,
    annualDisposal: 19.2,
    disposalRate: 89.7,
  },
  {
    level: "High Courts (25 courts)",
    shortLabel: "High Courts",
    pending: 6.1,
    pendingUnit: "M",
    judgesSanctioned: 1114,
    judgesActual: 778,
    vacancyPct: 30.2,
    avgDisposalYears: 5.2,
    annualFiling: 2.1,
    annualDisposal: 1.9,
    disposalRate: 90.5,
  },
  {
    level: "Supreme Court",
    shortLabel: "Supreme Court",
    pending: 82,
    pendingUnit: "K",
    judgesSanctioned: 34,
    judgesActual: 32,
    vacancyPct: 5.9,
    avgDisposalYears: 3.5,
    annualFiling: 52,  // thousands
    annualDisposal: 50,
    disposalRate: 96.2,
  },
];

// ─── Bottleneck scoring ───────────────────────────────────────────────────────
// Each factor scored 0–100 where 100 = most severe bottleneck.
// Methodology in DocketMethods.tsx.

export interface BottleneckEntry {
  state: string;
  vacancyScore: number;    // % of judge seats vacant, normalised
  digitalScore: number;    // inverse of digitalization (low digital = high score)
  adjournScore: number;    // estimated avg adjournments per case, normalised
  pendencyScore: number;   // avg years pending, normalised
  infraScore: number;      // courts per million pop deficit, normalised
  composite: number;       // weighted composite
  tier: "Critical" | "High" | "Moderate" | "Low";
}

export const bottleneckData: BottleneckEntry[] = [
  { state: "Bihar",            vacancyScore: 82, digitalScore: 74, adjournScore: 78, pendencyScore: 88, infraScore: 86, composite: 81.0, tier: "Critical" },
  { state: "Uttar Pradesh",    vacancyScore: 72, digitalScore: 65, adjournScore: 80, pendencyScore: 82, infraScore: 78, composite: 74.8, tier: "Critical" },
  { state: "Jharkhand",        vacancyScore: 78, digitalScore: 72, adjournScore: 72, pendencyScore: 84, infraScore: 80, composite: 77.0, tier: "Critical" },
  { state: "West Bengal",      vacancyScore: 68, digitalScore: 60, adjournScore: 74, pendencyScore: 86, infraScore: 72, composite: 71.2, tier: "High" },
  { state: "Odisha",           vacancyScore: 70, digitalScore: 64, adjournScore: 70, pendencyScore: 80, infraScore: 74, composite: 71.4, tier: "High" },
  { state: "Assam",            vacancyScore: 74, digitalScore: 70, adjournScore: 68, pendencyScore: 82, infraScore: 76, composite: 73.6, tier: "High" },
  { state: "Madhya Pradesh",   vacancyScore: 66, digitalScore: 58, adjournScore: 68, pendencyScore: 74, infraScore: 70, composite: 67.1, tier: "High" },
  { state: "Rajasthan",        vacancyScore: 62, digitalScore: 55, adjournScore: 64, pendencyScore: 70, infraScore: 66, composite: 63.2, tier: "High" },
  { state: "Punjab",           vacancyScore: 60, digitalScore: 52, adjournScore: 62, pendencyScore: 72, infraScore: 64, composite: 62.1, tier: "Moderate" },
  { state: "Haryana",          vacancyScore: 58, digitalScore: 50, adjournScore: 60, pendencyScore: 68, infraScore: 62, composite: 59.7, tier: "Moderate" },
  { state: "Maharashtra",      vacancyScore: 54, digitalScore: 44, adjournScore: 56, pendencyScore: 62, infraScore: 58, composite: 54.4, tier: "Moderate" },
  { state: "Gujarat",          vacancyScore: 48, digitalScore: 40, adjournScore: 50, pendencyScore: 54, infraScore: 50, composite: 48.5, tier: "Moderate" },
  { state: "Karnataka",        vacancyScore: 46, digitalScore: 38, adjournScore: 50, pendencyScore: 56, infraScore: 48, composite: 47.6, tier: "Moderate" },
  { state: "Andhra Pradesh",   vacancyScore: 50, digitalScore: 42, adjournScore: 52, pendencyScore: 58, infraScore: 52, composite: 50.5, tier: "Moderate" },
  { state: "Tamil Nadu",       vacancyScore: 42, digitalScore: 36, adjournScore: 44, pendencyScore: 50, infraScore: 44, composite: 43.2, tier: "Low" },
  { state: "Delhi",            vacancyScore: 46, digitalScore: 32, adjournScore: 46, pendencyScore: 52, infraScore: 40, composite: 43.4, tier: "Low" },
  { state: "Telangana",        vacancyScore: 44, digitalScore: 34, adjournScore: 44, pendencyScore: 48, infraScore: 42, composite: 42.5, tier: "Low" },
  { state: "Kerala",           vacancyScore: 36, digitalScore: 28, adjournScore: 38, pendencyScore: 42, infraScore: 36, composite: 36.0, tier: "Low" },
];

// ─── India–Singapore comparison ───────────────────────────────────────────────

export interface ComparisonRow {
  dimension: string;
  india: string;
  singapore: string;
  indiaRaw: number;     // 0-100 score (higher = better)
  singaporeRaw: number; // 0-100 score (higher = better)
  note?: string;
}

export const comparisonData: ComparisonRow[] = [
  {
    dimension: "E-filing rate",
    india: "~15% of courts",
    singapore: "~99% of filings",
    indiaRaw: 15,
    singaporeRaw: 99,
    note: "India's eCourts project has enabled e-filing in select district courts; mandatory e-filing applies only to some High Courts.",
  },
  {
    dimension: "Real-time case status",
    india: "Partial (eCourts portal, patchy data)",
    singapore: "Full online access via eLitigation",
    indiaRaw: 20,
    singaporeRaw: 98,
    note: "Singapore's eLitigation system provides real-time status, hearing dates, and documents to registered parties.",
  },
  {
    dimension: "Hearing notifications",
    india: "In-person notice / postal / limited SMS",
    singapore: "Automated email + SMS via eLitigation",
    indiaRaw: 18,
    singaporeRaw: 97,
    note: "Automated notification reduces failure-to-appear adjournments.",
  },
  {
    dimension: "Judgment access",
    india: "Partial (SCC, IndianKanoon; Supreme Court full, High Courts partial)",
    singapore: "Full online within 24h for most cases",
    indiaRaw: 40,
    singaporeRaw: 96,
    note: "Indian Kanoon aggregates judgments but relies on scraping; no single authoritative government repository.",
  },
  {
    dimension: "Avg civil case duration",
    india: "4–5 years (district courts)",
    singapore: "12–18 months",
    indiaRaw: 20,
    singaporeRaw: 78,
    note: "Singapore Small Claims Tribunal: typically 2-3 months.",
  },
  {
    dimension: "Judges per million population",
    india: "~21",
    singapore: "~130",
    indiaRaw: 16,
    singaporeRaw: 100,
    note: "Law Commission of India recommended 50/million as minimum. India has not met even that figure.",
  },
  {
    dimension: "Unified digital identity for court access",
    india: "None (fragmented state logins)",
    singapore: "Singpass (single government identity)",
    indiaRaw: 5,
    singaporeRaw: 98,
    note: "India Aadhaar exists but is not integrated into court systems as a universal court-login.",
  },
  {
    dimension: "Cross-court record portability",
    india: "No (siloed state systems)",
    singapore: "Yes (eLitigation + integrated registry)",
    indiaRaw: 8,
    singaporeRaw: 95,
  },
  {
    dimension: "Online payment of court fees",
    india: "Partial (some High Courts accept online)",
    singapore: "100% online via eLitigation",
    indiaRaw: 35,
    singaporeRaw: 100,
  },
  {
    dimension: "Case management system standardisation",
    india: "Fragmented (NJDG + state CMS + manual)",
    singapore: "Single integrated system",
    indiaRaw: 22,
    singaporeRaw: 97,
  },
];

// ─── Sample cases for the interactive Tracker ─────────────────────────────────

export type CaseStatus = "Pending" | "In Progress" | "Adjourned" | "Resolved";
export type CasePriority = "Urgent" | "High" | "Normal" | "Low";
export type CaseType = "Civil" | "Criminal";
export type CourtLevelKey = "District" | "High Court" | "Supreme Court";

export interface TrackerCase {
  id: string;
  caseId: string;
  title: string;
  filingDate: string;      // ISO date string
  courtLevel: CourtLevelKey;
  judge?: string;
  nextHearing?: string;    // ISO date string
  status: CaseStatus;
  priority: CasePriority;
  type: CaseType;
  notes?: string;
}

export const sampleCases: TrackerCase[] = [
  {
    id: "1",
    caseId: "CS-UP-2019-04821",
    title: "Sharma v. Municipal Corporation — Property Dispute",
    filingDate: "2019-03-12",
    courtLevel: "District",
    judge: "Adv. K. Singh (case filed; judge unassigned)",
    nextHearing: "2024-09-15",
    status: "Adjourned",
    priority: "Normal",
    type: "Civil",
    notes: "Adjourned 14 times since filing. Last adjournment due to missing document submission.",
  },
  {
    id: "2",
    caseId: "WP-DEL-2021-11042",
    title: "Writ Petition — Land Acquisition Challenge",
    filingDate: "2021-06-20",
    courtLevel: "High Court",
    judge: "Hon. Justice P. Mehta",
    nextHearing: "2024-08-05",
    status: "In Progress",
    priority: "High",
    type: "Civil",
    notes: "Interim stay granted. Final arguments scheduled.",
  },
  {
    id: "3",
    caseId: "CR-MH-2020-09314",
    title: "State v. Patel — Financial Fraud (IPC 420)",
    filingDate: "2020-11-08",
    courtLevel: "District",
    judge: "Sessions Judge R. Desai",
    nextHearing: "2024-07-22",
    status: "In Progress",
    priority: "Urgent",
    type: "Criminal",
    notes: "Chargesheet filed. 6 witnesses examined so far; 12 remaining.",
  },
  {
    id: "4",
    caseId: "SLP-SC-2022-03155",
    title: "Special Leave Petition — Service Dispute",
    filingDate: "2022-02-14",
    courtLevel: "Supreme Court",
    nextHearing: "2024-10-01",
    status: "Pending",
    priority: "High",
    type: "Civil",
    notes: "Listed for final hearing. Awaiting bench constitution.",
  },
  {
    id: "5",
    caseId: "CS-TN-2017-06621",
    title: "Gopalakrishnan v. Tamil Nadu Housing Board",
    filingDate: "2017-08-30",
    courtLevel: "District",
    judge: "District Judge S. Rajan",
    nextHearing: "2024-11-18",
    status: "Adjourned",
    priority: "Normal",
    type: "Civil",
    notes: "Filed in 2017. Over 20 adjournments. Key witness died; case restructured.",
  },
  {
    id: "6",
    caseId: "CR-WB-2021-14422",
    title: "State v. Roy — Assault (IPC 307)",
    filingDate: "2021-04-02",
    courtLevel: "District",
    judge: "JMFC A. Ghosh",
    nextHearing: "2024-07-30",
    status: "In Progress",
    priority: "Urgent",
    type: "Criminal",
  },
  {
    id: "7",
    caseId: "WP-KA-2020-07723",
    title: "Writ — Environmental Clearance Challenge",
    filingDate: "2020-09-14",
    courtLevel: "High Court",
    judge: "Hon. Justice L. Kumar",
    status: "Resolved",
    priority: "Normal",
    type: "Civil",
    notes: "Resolved in petitioner's favour. Clearance quashed. Closed June 2024.",
  },
  {
    id: "8",
    caseId: "CS-GJ-2023-00912",
    title: "Insurance Claim Dispute — Motor Accident",
    filingDate: "2023-01-18",
    courtLevel: "District",
    nextHearing: "2024-08-12",
    status: "Pending",
    priority: "Low",
    type: "Civil",
    notes: "New case. Documents being compiled.",
  },
];

// ─── Advocacy / cost-benefit data ─────────────────────────────────────────────

export interface CostBenefitRow {
  label: string;
  cost: string;
  source: string;
}

export const delaysCost: CostBenefitRow[] = [
  {
    label: "Economic cost of judicial delays",
    cost: "~1.5% of GDP annually",
    source: "World Bank, 'Doing Business in India', 2020",
  },
  {
    label: "Undertrials as % of prison population",
    cost: "75–77%",
    source: "Prison Statistics India 2022, NCRB",
  },
  {
    label: "Estimated loss from contract enforcement delays",
    cost: "₹8.1 lakh crore (~$97 bn) in stuck commercial disputes",
    source: "DAKSH India Judicial Efficiency Study, 2019",
  },
  {
    label: "Cases pending over 10 years (district courts)",
    cost: "~1.7 million cases",
    source: "NJDG data, 2023",
  },
  {
    label: "Foreign investment lost to dispute resolution uncertainty",
    cost: "Frequently cited in World Bank Ease of Doing Business 'contract enforcement' score (India: 163/190 in 2020)",
    source: "World Bank Doing Business 2020",
  },
];
