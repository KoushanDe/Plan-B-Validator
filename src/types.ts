export interface ProfileData {
  currentProfession: string;
  industry: string;
  yearsExperience?: number;
  country: string;
  city: string;
}

export interface FinancialsData {
  monthlyIncome: number;
  liquidSavings: number;
  monthlyExpenses: number;
  dependents?: number;
  debtObligations?: number;
  emergencyFundMonths: number;
}

export interface PlanBData {
  title: string;
  description: string;
  reason: string;
  timelineMonths: number;
  iWillQuitMyJob: boolean;
  expectedIncome3Months?: number;
  expectedIncome6Months?: number;
  expectedIncome12Months?: number;
  targetCountry?: string;
  targetCity?: string;
}

export interface ConstraintsData {
  successDefinition: string;
  biggestFear: string;
  acceptableDownside: string;
  minimumAcceptableSalary?: number;
  acceptableMonthsWithoutIncome?: number;
  familyPressureLevel: number; // 1 to 5
}

export interface PsychologyData {
  [key: string]: number; // field name matches the question's camelCase field mapping
}

export interface ResearchOptions {
  enableResearch: boolean;
}

export interface AnalyzeRequest {
  profile: ProfileData;
  financials: FinancialsData;
  planB: PlanBData;
  constraints: ConstraintsData;
  psychology: PsychologyData;
  researchOptions: ResearchOptions;
}

export interface QuestionnaireQuestion {
  id: string | number;
  text: string;
  field: string; // camelCase field name, e.g. uncertaintyTolerance
}

export type Verdict = "take_the_leap" | "take_with_caution" | "delay" | "do_not_take_now";

export interface OpportunityCost {
  score: number;
  band: string; // e.g. "Low", "Medium", "High"
  summary: string;
  [key: string]: any;
}

export interface ResearchContext {
  corporate_salary_range?: string;
  marketValueAssessment?: any;
  [key: string]: any;
}

export interface ReentryByGapItem {
  gap_months: number;
  gap_label: "3_months" | "6_months" | "9_months" | "12_plus_months";
  difficulty_score: number;
  difficulty_band: string;
  typical_weeks_to_offer_min: number;
  typical_weeks_to_offer_max: number;
  notes: string;
}

export interface CurrentMarketConditionForHiring {
  summary: string;
  overall_reentry_score: number;
  overall_band: "easy" | "moderate" | "difficult" | "very_difficult" | string;
  recommended_minimum_gap_months: number;
  reentry_by_gap?: ReentryByGapItem[];
  salary_sources?: string[];
  market_notes?: string;
}

export interface ValidationResults {
  verdict: Verdict;
  feasibilityScore: number;
  riskScore: number;
  runwayMonths: number;
  confidence: number;
  opportunityCost: OpportunityCost;
  recommendationSummary: string;
  majorReasons: string[];
  redFlags: string[];
  nextSteps: string[];
  personalitySummary: string;
  expectedFailureMode: string;
  safestNextMove: string;
  suggestedFallbackPlan: string;
  researchContext: ResearchContext;
  marketValueAssessment?: any;
  currentMarketConditionForHiring?: CurrentMarketConditionForHiring;
  [key: string]: any;
}

export type SSEStage =
  | "SANITIZE"
  | "RESUME_PROFILE"
  | "RUNWAY"
  | "PSYCHOLOGY"
  | "RESUME_MARKET_VALUE"
  | "RESEARCH"
  | "SCORING"
  | "OPENAI_CORE"
  | "GEMINI_DEEP"
  | "COMPLETE";

export interface SSEMessage {
  stage: SSEStage;
  message: string;
  timestamp?: string;
  result?: ValidationResults;
}
