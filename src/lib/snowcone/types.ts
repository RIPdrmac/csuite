// ─── Snowcone Content Types ────────────────────────────────────────

export type ContentFormat =
  | 'instagram_single'
  | 'instagram_carousel'
  | 'instagram_story'
  | 'linkedin_post'
  | 'linkedin_carousel'
  | 'x_tweet'
  | 'x_thread'
  | 'pricing_card'
  | 'ad_creative';

export type ContentStatus = 'draft' | 'queued' | 'posted' | 'testing' | 'winner' | 'cut';
export type ScheduleSlot = 'morning' | 'midday' | 'evening' | 'nightowl';

export interface GenerateRequest {
  productId: string;
  personaId: 'main' | 'starter' | 'pro' | 'agency';
  formats: ContentFormat[];
  angle?: string; // e.g. "anti-styleseat", "data-ownership", "roi-comparison"
  language?: string;
}

export interface GeneratedContent {
  id: string;
  productId: string;
  productName: string;
  personaId: string;
  format: ContentFormat;
  content: {
    hook: string;
    body: string;
    cta: string;
    hashtags: string[];
  };
  carousel?: CarouselSlide[];
  pricingCard?: PricingCardData;
  status: ContentStatus;
  scheduledFor?: string;
  scheduledSlot?: ScheduleSlot;
  platform: 'instagram' | 'linkedin' | 'x' | 'all';
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  createdAt: string;
  postedAt?: string;
}

export interface CarouselSlide {
  slideNumber: number;
  title: string;
  body: string;
  accent?: string;
}

export interface PricingCardData {
  productName: string;
  niche: string;
  tier: 'starter' | 'pro' | 'agency';
  price: number;
  features: string[];
  cta: string;
  badge?: string;
  antiCompetitor?: string;
}

export interface ContentSchedule {
  id: string;
  contentId: string;
  platform: 'instagram' | 'linkedin' | 'x';
  scheduledFor: string; // ISO datetime
  slot: ScheduleSlot;
  status: 'pending' | 'posted' | 'failed' | 'cancelled';
  notificationSent: boolean;
}

// 3x daily schedule across platforms
export const DAILY_SCHEDULE: { slot: ScheduleSlot; time: string; platforms: string[]; description: string }[] = [
  { slot: 'morning', time: '08:30', platforms: ['linkedin', 'instagram'], description: 'Professional audience, high engagement' },
  { slot: 'midday', time: '12:30', platforms: ['instagram', 'x'], description: 'Lunch scroll, casual discovery' },
  { slot: 'evening', time: '18:00', platforms: ['instagram', 'linkedin'], description: 'After-work decision makers' },
  { slot: 'nightowl', time: '02:00', platforms: ['x', 'instagram'], description: 'Low competition, nightowl entrepreneurs' },
];

// Angles for copy generation
export const CONTENT_ANGLES = [
  { id: 'anti-styleseat', label: 'Anti-StyleSeat', description: 'Stop paying 25% per booking. Own your platform.' },
  { id: 'data-ownership', label: 'Data Ownership', description: 'Your clients. Your data. Your business. No platform lock-in.' },
  { id: 'roi-comparison', label: 'ROI Comparison', description: 'One-time $197 vs $500+/year on monthly tools.' },
  { id: 'ai-intelligence', label: 'AI Intelligence', description: 'Claude-connected. Your business has a brain now.' },
  { id: 'deploy-speed', label: '60-Second Deploy', description: 'Live in 60 seconds. Not 6 weeks.' },
  { id: 'webos-concept', label: 'webOS Concept', description: 'Not a website. An operating system for your business.' },
  { id: 'custom-dev-cost', label: 'Custom Dev Cost', description: '$397 vs $5K-$15K for custom development.' },
  { id: 'white-label', label: 'White-Label Platform', description: 'Your brand. Your platform. Unlimited locations.' },
];
