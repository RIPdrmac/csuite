// ─── CSUITE v0.0 Data Models ───────────────────────────────────────

export type OfferStatus = 'Idea' | 'Building' | 'Live' | 'Testing' | 'Scaling' | 'Cut';

export type DecisionMode = 'AUTO' | 'HOLD' | 'OVER';

export type DecisionStatus =
  | 'Drafting'
  | 'Deliberating'
  | 'Awaiting approval'
  | 'Approved'
  | 'Overridden'
  | 'Executed'
  | 'Logged'
  | 'Outcome recorded';

export type ConfidenceLevel = 'Mastery' | 'High' | 'Solid' | 'Moderate' | 'Low' | 'Insufficient';

export type ConsequenceClass = 'Critical' | 'High' | 'Medium' | 'Low';

export type AgentName = 'PRODUCT' | 'GROWTH' | 'FINANCE' | 'PROTOCOL' | 'BRAND' | 'TALENT';

export type DecisionType = 'Niche Selection' | 'Template Build' | 'Pricing' | 'Upsell' | 'Cut' | 'Launch' | 'Pivot';

export type ContentType = 'Hook' | 'Landing Page' | 'CTA' | 'Email' | 'Ad' | 'Affiliate' | 'Outbound';

export type ContentStatus = 'Draft' | 'Review' | 'Active' | 'Testing' | 'Paused' | 'Archived';

export type LearningEventType = 'Launch' | 'Sale' | 'Failure' | 'Override' | 'Pivot' | 'Cut';

// ─── Core Interfaces ───────────────────────────────────────────────

export interface Offer {
  id: string;
  name: string;
  niche: string;
  status: OfferStatus;
  price: number;
  traffic: number;
  conversionRate: number;
  affiliateAttachRate: number;
  revenue: number;
  nextMove: string;
  createdAt: string;
}

export interface Decision {
  id: string;
  title: string;
  offerId: string;
  offerName: string;
  decisionType: DecisionType;
  mode: DecisionMode;
  consequenceClass: ConsequenceClass;
  status: DecisionStatus;
  leadRecommendation: string;
  dissentSummary: string;
  confidence: ConfidenceLevel;
  vetoed: boolean;
  createdAt: string;
}

export interface AgentRecommendation {
  agent: AgentName;
  recommendation: string;
  confidence: ConfidenceLevel;
  rationale: string;
  risk: string;
  status: 'pending' | 'accepted' | 'dismissed';
}

export interface LearningEvent {
  id: string;
  date: string;
  eventType: LearningEventType;
  title: string;
  result: string;
  recommendation: string;
  overridden: boolean;
  lesson: string;
}

export interface KPIStats {
  currentMRR: number;
  targetMRR: number;
  gap: number;
  daysLeft: number;
  requiredDailyPace: number;
  currentDailyPace: number;
  totalOffers: number;
  liveOffers: number;
  openDecisions: number;
  conversionAvg: number;
  websitesCreated: number;
  websitesSold: number;
  totalRevenue: number;
  affiliateRevenue: number;
  templateRevenue: number;
  avgOrderValue: number;
  adSpend: number;
  roas: number;
  customersTotal: number;
  affiliateAttachAvg: number;
}

export type TodoPriority = 'critical' | 'high' | 'medium' | 'low';
export type TodoStatus = 'todo' | 'in-progress' | 'done' | 'blocked';
export type TodoPermission = 'human' | 'approve' | 'auto';

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  priority: TodoPriority;
  status: TodoStatus;
  permission: TodoPermission;
  agent?: AgentName;
  dueDate?: string;
  createdAt: string;
}

export interface AgentLog {
  id: string;
  agent: AgentName;
  timestamp: string;
  action: string;
  recommendation: string;
  confidence: ConfidenceLevel;
  accepted: boolean | null;
  outcome?: string;
}

export interface AdaptiveInsight {
  id: string;
  message: string;
  bias: 'speed' | 'clarity' | 'revenue' | 'repeatability' | 'focus';
  priority: 'high' | 'medium' | 'low';
}

export interface Blocker {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium';
  offerId?: string;
  description: string;
  suggestedAction: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'decision' | 'offer' | 'learning' | 'system';
  title: string;
  description: string;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  status: ContentStatus;
  offerId?: string;
  offerName?: string;
  content: string;
  metrics?: {
    impressions?: number;
    clicks?: number;
    conversions?: number;
  };
  createdAt: string;
}
