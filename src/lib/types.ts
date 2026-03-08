// ============================================================
// Core Report Structure
// ============================================================

export interface Report {
  id: string;
  companyName: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
  sections: {
    overview?: CompanyOverview;
    market?: MarketLandscape;
    people?: PeopleOrg;
    perception?: PublicPerception;
    financial?: FinancialOutlook;
    fit?: StrategicFit;
  };
}

export type SectionKey = keyof Report["sections"];

export type SectionStatus = "idle" | "loading" | "complete" | "error";

export interface SectionState<T> {
  status: SectionStatus;
  data: T | null;
  error?: string;
}

// ============================================================
// Section 1: Company Overview
// ============================================================

export interface CompanyOverview {
  description: string;
  founded: string;
  headquarters: string;
  employeeCount: string;
  website: string;
  mission: string;
  techStack: string[];
  fundingHistory: FundingRound[];
  timeline: TimelineEvent[];
  recentNews: NewsItem[];
}

export interface FundingRound {
  date: string;
  round: string;
  amount: string;
  investors: string[];
  valuation?: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type:
    | "founding"
    | "funding"
    | "product"
    | "milestone"
    | "acquisition"
    | "other";
}

export interface NewsItem {
  title: string;
  source: string;
  date: string;
  url: string;
  summary: string;
}

// ============================================================
// Section 2: Market & Competitive Landscape
// ============================================================

export interface MarketLandscape {
  marketSize: string;
  marketGrowthRate: string;
  competitors: Competitor[];
  positioning: string;
  messagingAnalysis: string;
  industryTrends: string[];
  competitiveRisks: string[];
  competitiveAdvantages: string[];
}

export interface Competitor {
  name: string;
  description: string;
  website?: string;
  differentiators: string[];
  strengths: string[];
  weaknesses: string[];
  estimatedSize?: string;
}

// ============================================================
// Section 3: People & Organization
// ============================================================

export interface PeopleOrg {
  leadership: Leader[];
  boardMembers: BoardMember[];
  teamSize: string;
  departments: string[];
  hiringTrends: HiringAnalysis;
  openRoles: OpenRole[];
  cultureSignals: CultureSignal[];
}

export interface Leader {
  name: string;
  title: string;
  linkedinUrl?: string;
  background?: string;
}

export interface BoardMember {
  name: string;
  title: string;
  organization?: string;
  linkedinUrl?: string;
}

export interface HiringAnalysis {
  summary: string;
  trendingDepartments: string[];
  signals: string[];
}

export interface OpenRole {
  title: string;
  department: string;
  location: string;
  url?: string;
}

export interface CultureSignal {
  source: string;
  signal: string;
  sentiment: "positive" | "neutral" | "negative";
}

// ============================================================
// Section 4: Public Perception
// ============================================================

export interface PublicPerception {
  overallSentiment: string;
  sentimentScore: number;
  redditDiscussions: SentimentItem[];
  reviews: ReviewSummary;
  pressCoverage: PressItem[];
  videos: Video[];
}

export interface SentimentItem {
  source: string;
  title: string;
  content: string;
  sentiment: "positive" | "neutral" | "negative";
  url?: string;
  date?: string;
}

export interface ReviewSummary {
  averageRating?: number;
  totalReviews?: number;
  platforms: string[];
  themes: {
    positive: string[];
    negative: string[];
  };
  highlights: string[];
}

export interface PressItem {
  title: string;
  source: string;
  date: string;
  url: string;
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
}

export interface Video {
  title: string;
  url: string;
  embedUrl?: string;
  speaker?: string;
  date?: string;
  description?: string;
}

// ============================================================
// Section 5: Financial Outlook & Exit
// ============================================================

export interface FinancialOutlook {
  revenueEstimate: string;
  growthTrajectory: string;
  burnRate?: string;
  runway?: string;
  profitability: string;
  exitStrategy: ExitAnalysis;
  comparableExits: ComparableExit[];
}

export interface ExitAnalysis {
  mostLikelyPath: string;
  reasoning: string;
  timeline?: string;
  potentialAcquirers: PotentialAcquirer[];
}

export interface PotentialAcquirer {
  name: string;
  reasoning: string;
  estimatedValue?: string;
}

export interface ComparableExit {
  company: string;
  exitType: string;
  acquirer?: string;
  value: string;
  date: string;
  relevance: string;
}

// ============================================================
// Section 6: How I Can Help
// ============================================================

export interface StrategicFit {
  orgGaps: OrgGap[];
  strategicChallenges: string[];
  skillAlignment: SkillMatch[];
  valuePropositions: string[];
  recommendation: string;
}

export interface OrgGap {
  area: string;
  description: string;
  impact: string;
  hasCurrentLeader: boolean;
  currentLeader?: string;
}

export interface SkillMatch {
  challenge: string;
  relevantSkill: string;
  evidence: string;
}

// ============================================================
// User Profile (for "How I Can Help")
// ============================================================

export interface UserProfile {
  name: string;
  title: string;
  summary: string;
  skills: string[];
  experience: ExperienceItem[];
  targetRoles: string[];
  education?: string;
  keyThemes?: Record<string, string>;
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  highlights: string[];
}

// ============================================================
// API Types
// ============================================================

export interface ResearchRequest {
  companyName: string;
  role?: string;
}

export interface SectionRequest {
  companyName: string;
  role?: string;
  context?: Record<string, unknown>;
}
