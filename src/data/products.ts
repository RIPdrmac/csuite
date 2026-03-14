import { AgentName } from '@/types';

// ─── RIP (Research In Public) Product Line ─────────────────────────
// Real products from SOVD Platform template engine

export type PricingTier = 'starter' | 'pro' | 'agency';
export type ProductStatus = 'live' | 'staging' | 'building' | 'planned' | 'cut';
export type Platform = 'lemonsqueezy' | 'gumroad' | 'direct' | 'skool';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sovdTemplateId: string; // maps to SOVD template_id in sovd-platform/src/core/config/templates.ts
  sovdConfigured: boolean; // true if active in sovd.config.ts (has prompt chains, SMS, calendar)
  niche: string;
  description: string;
  status: ProductStatus;
  tiers: {
    starter: { price: number; features: string[] };
    pro: { price: number; features: string[] };
    agency: { price: number; features: string[] };
  };
  platforms: Platform[];
  affiliateStack: string[];
  targetAudience: string;
  searchVolume: 'high' | 'medium' | 'low';
  competition: 'high' | 'medium' | 'low';
  estimatedConversion: number;
  logoReady: boolean;
  landingPageReady: boolean;
  templateCompiles: boolean;
  lastTestedAt: string | null;
  socialCopy: SocialCopy[];
  createdAt: string;
}

export interface SocialCopy {
  id: string;
  platform: 'instagram' | 'tiktok' | 'linkedin' | 'x' | 'facebook';
  hook: string;
  body: string;
  cta: string;
  status: 'draft' | 'posted' | 'testing' | 'winner' | 'cut';
  impressions?: number;
  clicks?: number;
  conversions?: number;
  generatedAt: string;
}

export interface BudgetTracker {
  totalBudget: number;
  spent: number;
  remaining: number;
  dailyBudget: number;
  spendByPlatform: Record<string, number>;
  spendByProduct: Record<string, number>;
  revenueFromAds: number;
  organicRevenue: number;
  roas: number;
  costPerAcquisition: number;
  budgetAlerts: BudgetAlert[];
}

export interface BudgetAlert {
  id: string;
  type: 'warning' | 'critical' | 'recommendation';
  message: string;
  action: string;
  agent: AgentName;
  timestamp: string;
}

export interface CopyMemory {
  id: string;
  productId: string;
  type: 'ad' | 'social' | 'email' | 'landing' | 'hook';
  content: string;
  performance: 'winner' | 'testing' | 'underperforming' | 'cut';
  impressions: number;
  clicks: number;
  conversions: number;
  createdAt: string;
}

// ─── SOVD Product Line for RIP — 20 Templates × 3 Tiers = 60 SKUs ──────────
// sovdTemplateId maps to sovd-platform/src/core/config/templates.ts
// sovdConfigured = true means active in sovd.config.ts with prompt chains

const S = 'starter' as const, P = 'pro' as const, A = 'agency' as const;
const base = (extra: Partial<Product>): Product => ({
  id: '', name: '', slug: '', sovdTemplateId: '', sovdConfigured: false, niche: '', description: '',
  status: 'planned', tiers: { starter: { price: 0, features: [] }, pro: { price: 0, features: [] }, agency: { price: 0, features: [] } },
  platforms: ['lemonsqueezy'], affiliateStack: [], targetAudience: '', searchVolume: 'medium',
  competition: 'medium', estimatedConversion: 0.03, logoReady: false, landingPageReady: false,
  templateCompiles: false, lastTestedAt: null, socialCopy: [], createdAt: '2026-03-01', ...extra,
});

export const products: Product[] = [
  // ── LIVE (3) — configured in sovd.config.ts, ready to sell ──
  base({ id: 'p1', name: 'BarberBook', slug: 'barberbook', sovdTemplateId: 'barberBook', sovdConfigured: true, niche: 'Barbershops & Salons', description: 'AI-powered barbershop appointment management with no-show follow-up, revenue analytics, and client retention automation.', status: 'live', tiers: { starter: { price: 197, features: ['Appointment booking', 'Client database', 'Revenue tracking', 'SMS reminders', 'AI no-show follow-up'] }, pro: { price: 397, features: ['All Starter +', 'Multi-staff scheduling', 'Team analytics', 'Automated waitlist', 'Custom branding'] }, agency: { price: 997, features: ['All Pro +', 'White-label', 'Multi-location', 'API access', 'Priority support'] } }, affiliateStack: ['Calendly', 'Square', 'Mailchimp'], targetAudience: 'Independent barbers and small salon owners', searchVolume: 'high', estimatedConversion: 0.038, logoReady: true, templateCompiles: true, lastTestedAt: '2026-03-13' }),

  base({ id: 'p2', name: 'ChurchOS', slug: 'churchos', sovdTemplateId: 'churchOS', sovdConfigured: true, niche: 'Churches & Ministries', description: 'Member care, giving management, prayer request follow-up, and congregation analytics powered by AI.', status: 'live', tiers: { starter: { price: 197, features: ['Member directory', 'Giving tracking', 'Prayer requests', 'SMS follow-ups', 'Weekly reports'] }, pro: { price: 397, features: ['All Starter +', 'Volunteer scheduling', 'Event management', 'Multi-campus', 'Custom workflows'] }, agency: { price: 997, features: ['All Pro +', 'Denomination white-label', 'Multi-church mgmt', 'API access', 'Advanced analytics'] } }, affiliateStack: ['Tithe.ly', 'Planning Center', 'Mailchimp'], targetAudience: 'Pastors and church administrators', competition: 'low', estimatedConversion: 0.042, logoReady: true, templateCompiles: true, lastTestedAt: '2026-03-12' }),

  base({ id: 'p3', name: 'DJBook', slug: 'djbook', sovdTemplateId: 'djBook', sovdConfigured: true, niche: 'DJs & Event Entertainment', description: 'Gig booking, lead follow-up, deposit collection, review automation for DJs and event entertainers.', status: 'live', tiers: { starter: { price: 197, features: ['Gig calendar', 'Lead tracking', 'Invoice generation', 'Review requests', 'AI gig recaps'] }, pro: { price: 397, features: ['All Starter +', 'Contract management', 'Equipment tracking', 'Multi-DJ scheduling', 'Revenue intelligence'] }, agency: { price: 997, features: ['All Pro +', 'Agency white-label', 'Marketplace listing', 'API access', 'Custom integrations'] } }, affiliateStack: ['Honeybook', 'QuickBooks', 'Spotify for Artists'], targetAudience: 'Independent DJs and entertainment companies', competition: 'low', estimatedConversion: 0.035, logoReady: true, templateCompiles: true, lastTestedAt: '2026-03-11' }),

  // ── STAGING (5) — built, need listing on LemonSqueezy ──
  base({ id: 'p4', name: 'FreelanceOS', slug: 'freelanceos', sovdTemplateId: 'freelanceOS', sovdConfigured: false, niche: 'Freelancers & Solopreneurs', description: 'Complete freelance business operations — project management, invoicing, client CRM, and revenue analytics.', status: 'staging', tiers: { starter: { price: 197, features: ['Project tracking', 'Client CRM', 'Invoice generation', 'Time tracking', 'Revenue dashboard'] }, pro: { price: 397, features: ['All Starter +', 'Proposal templates', 'Contract management', 'Multi-client portal', 'AI follow-ups'] }, agency: { price: 997, features: ['All Pro +', 'Agency white-label', 'Team management', 'API access', 'Custom workflows'] } }, platforms: ['lemonsqueezy', 'gumroad'], affiliateStack: ['FreshBooks', 'Notion', 'ConvertKit', 'Calendly'], targetAudience: 'Freelance designers, developers, writers', searchVolume: 'high', competition: 'high', estimatedConversion: 0.028, templateCompiles: true }),

  base({ id: 'p5', name: 'RealtorBrain', slug: 'realtorbrain', sovdTemplateId: 'realtorBrain', sovdConfigured: false, niche: 'Real Estate Agents', description: 'AI-powered real estate CRM with lead management, showing scheduling, and transaction tracking.', status: 'staging', tiers: { starter: { price: 247, features: ['Lead CRM', 'Showing scheduler', 'Client follow-ups', 'Transaction tracker', 'Market alerts'] }, pro: { price: 447, features: ['All Starter +', 'Team lead routing', 'MLS integration prep', 'Nurture sequences', 'Revenue forecasting'] }, agency: { price: 1197, features: ['All Pro +', 'Brokerage white-label', 'Multi-agent mgmt', 'API access', 'Custom branding'] } }, affiliateStack: ['Calendly', 'DocuSign', 'Mailchimp', 'Canva Pro'], targetAudience: 'Independent agents and small brokerages', searchVolume: 'high', competition: 'high', estimatedConversion: 0.032, templateCompiles: true }),

  base({ id: 'p6', name: 'LawDraft', slug: 'lawdraft', sovdTemplateId: 'lawDraft', sovdConfigured: false, niche: 'Legal Services', description: 'Legal document drafting, client intake, case tracking, and billing management for small law practices.', status: 'staging', tiers: { starter: { price: 297, features: ['Document drafting', 'Client intake forms', 'Case tracker', 'Billing', 'Calendar sync'] }, pro: { price: 497, features: ['All Starter +', 'Multi-attorney support', 'Court deadline tracking', 'Client portal', 'Advanced reporting'] }, agency: { price: 1497, features: ['All Pro +', 'Firm white-label', 'Multi-office', 'API access', 'Compliance tools'] } }, affiliateStack: ['Clio', 'DocuSign', 'LawPay'], targetAudience: 'Solo attorneys and small law firms', competition: 'low', estimatedConversion: 0.03, templateCompiles: true }),

  base({ id: 'p7', name: 'NutritionOS', slug: 'nutritionos', sovdTemplateId: 'nutritionOS', sovdConfigured: false, niche: 'Nutrition & Wellness', description: 'Nutrition coaching platform with meal planning, client progress tracking, and session management.', status: 'staging', tiers: { starter: { price: 197, features: ['Client profiles', 'Meal plan templates', 'Progress tracking', 'Session scheduling', 'Basic reports'] }, pro: { price: 397, features: ['All Starter +', 'Custom meal plans', 'Group programs', 'Automated check-ins', 'Revenue analytics'] }, agency: { price: 997, features: ['All Pro +', 'Practice white-label', 'Multi-practitioner', 'API access', 'HIPAA-ready'] } }, affiliateStack: ['Calendly', 'Stripe', 'Cronometer'], targetAudience: 'Nutritionists, dietitians, wellness coaches', competition: 'low', estimatedConversion: 0.033, templateCompiles: true }),

  base({ id: 'p8', name: 'ConsultantOS', slug: 'consultantos', sovdTemplateId: 'consultantOS', sovdConfigured: false, niche: 'Consulting Firms', description: 'Consulting business management — project scoping, client deliverables, billing, and engagement tracking.', status: 'staging', tiers: { starter: { price: 247, features: ['Project scoping', 'Client CRM', 'Time tracking', 'Invoice generation', 'Deliverable tracking'] }, pro: { price: 447, features: ['All Starter +', 'Multi-consultant', 'SOW templates', 'Client portal', 'Utilization analytics'] }, agency: { price: 1297, features: ['All Pro +', 'Firm white-label', 'Multi-practice', 'API access', 'Custom workflows'] } }, affiliateStack: ['Harvest', 'QuickBooks', 'Notion', 'Calendly'], targetAudience: 'Independent consultants and boutique firms', competition: 'medium', estimatedConversion: 0.031 }),

  // ── BUILDING (5) — in active development ──
  base({ id: 'p9', name: 'CoachPortal', slug: 'coachportal', sovdTemplateId: 'coachPortal', sovdConfigured: false, niche: 'Coaches & Mentors', description: 'Coaching business management — session booking, client progress, payment collection, and program delivery.', status: 'building', tiers: { starter: { price: 197, features: ['Session booking', 'Client dashboard', 'Payment tracking', 'Session notes', 'Progress reports'] }, pro: { price: 397, features: ['All Starter +', 'Group coaching', 'Course delivery', 'Automated check-ins', 'Revenue analytics'] }, agency: { price: 997, features: ['All Pro +', 'Coaching firm white-label', 'Multi-coach mgmt', 'API access', 'Custom programs'] } }, platforms: ['lemonsqueezy', 'skool'], affiliateStack: ['Calendly', 'Stripe', 'ConvertKit', 'Zoom'], targetAudience: 'Life coaches, business coaches, fitness coaches', searchVolume: 'high', estimatedConversion: 0.034 }),

  base({ id: 'p10', name: 'CreatorOS', slug: 'creatoros', sovdTemplateId: 'creatorOS', sovdConfigured: false, niche: 'Content Creators', description: 'Content creator operations — content calendar, brand deals, revenue tracking, and audience analytics.', status: 'building', tiers: { starter: { price: 147, features: ['Content calendar', 'Brand deal tracker', 'Revenue dashboard', 'Platform analytics', 'Collab management'] }, pro: { price: 297, features: ['All Starter +', 'Multi-platform sync', 'Sponsorship CRM', 'Rate card generator', 'AI content ideas'] }, agency: { price: 797, features: ['All Pro +', 'Talent agency white-label', 'Multi-creator mgmt', 'API access', 'Brand marketplace'] } }, affiliateStack: ['Buffer', 'ConvertKit', 'Canva Pro', 'Notion'], targetAudience: 'YouTubers, TikTokers, podcasters, influencers', searchVolume: 'high', competition: 'high', estimatedConversion: 0.025 }),

  base({ id: 'p11', name: 'RentalBrain', slug: 'rentalbrain', sovdTemplateId: 'rentalBrain', sovdConfigured: false, niche: 'Rental Properties', description: 'Rental property management — tenant tracking, maintenance requests, rent collection, and financial reporting.', status: 'building', tiers: { starter: { price: 247, features: ['Tenant profiles', 'Rent tracking', 'Maintenance requests', 'Lease management', 'Basic reporting'] }, pro: { price: 447, features: ['All Starter +', 'Multi-property', 'Automated rent reminders', 'Vendor management', 'Financial analytics'] }, agency: { price: 1197, features: ['All Pro +', 'Property mgmt white-label', 'Owner portal', 'API access', 'Advanced reporting'] } }, affiliateStack: ['Stripe', 'QuickBooks', 'Buildium'], targetAudience: 'Independent landlords and small property managers', estimatedConversion: 0.029 }),

  base({ id: 'p12', name: 'CareerCoach', slug: 'careercoach', sovdTemplateId: 'careerCoach', sovdConfigured: false, niche: 'Career Coaching', description: 'Career coaching platform — client assessments, job search tracking, resume reviews, and session management.', status: 'building', tiers: { starter: { price: 197, features: ['Client assessments', 'Job search tracker', 'Session scheduling', 'Resume review tools', 'Progress reports'] }, pro: { price: 397, features: ['All Starter +', 'Group workshops', 'Corporate partnerships', 'AI interview prep', 'Analytics'] }, agency: { price: 997, features: ['All Pro +', 'Career center white-label', 'Multi-coach', 'API access', 'Custom assessments'] } }, affiliateStack: ['Calendly', 'LinkedIn Premium', 'Grammarly'], targetAudience: 'Career coaches and outplacement firms', competition: 'low', estimatedConversion: 0.032 }),

  base({ id: 'p13', name: 'HireOS', slug: 'hireos', sovdTemplateId: 'hireOS', sovdConfigured: false, niche: 'Recruiting & Staffing', description: 'Recruiting operations — candidate pipeline, job board management, interview scheduling, and placement tracking.', status: 'building', tiers: { starter: { price: 247, features: ['Candidate pipeline', 'Job posting mgmt', 'Interview scheduler', 'Placement tracking', 'Basic analytics'] }, pro: { price: 447, features: ['All Starter +', 'Multi-recruiter', 'Client portal', 'Automated outreach', 'Revenue tracking'] }, agency: { price: 1197, features: ['All Pro +', 'Staffing firm white-label', 'Multi-division', 'API access', 'ATS integration prep'] } }, affiliateStack: ['Calendly', 'LinkedIn Recruiter', 'Notion'], targetAudience: 'Independent recruiters and boutique staffing firms', estimatedConversion: 0.028 }),

  // ── PLANNED (7) — on the roadmap ──
  base({ id: 'p14', name: 'CleaningBiz', slug: 'cleaningbiz', sovdTemplateId: 'cleaningBiz', sovdConfigured: false, niche: 'Cleaning Services', description: 'Cleaning service management — scheduling, route optimization, client management, and invoice automation.', status: 'planned', tiers: { starter: { price: 147, features: ['Job scheduling', 'Client database', 'Invoice generation', 'SMS reminders', 'Basic reporting'] }, pro: { price: 297, features: ['All Starter +', 'Team scheduling', 'Route planning', 'Equipment tracking', 'Customer portal'] }, agency: { price: 897, features: ['All Pro +', 'Franchise white-label', 'Multi-location', 'API access', 'Advanced analytics'] } }, affiliateStack: ['Jobber', 'QuickBooks', 'Mailchimp'], targetAudience: 'Independent cleaners and small cleaning companies', searchVolume: 'high', competition: 'low', estimatedConversion: 0.04 }),

  base({ id: 'p15', name: 'TutorOS', slug: 'tutoros', sovdTemplateId: 'tutorOS', sovdConfigured: false, niche: 'Tutoring & Education', description: 'Tutoring business management — student scheduling, progress tracking, parent communication, and session notes.', status: 'planned', tiers: { starter: { price: 147, features: ['Session scheduling', 'Student profiles', 'Progress tracking', 'Parent updates', 'Invoice generation'] }, pro: { price: 297, features: ['All Starter +', 'Multi-tutor scheduling', 'Curriculum planning', 'Group sessions', 'Analytics'] }, agency: { price: 897, features: ['All Pro +', 'Tutoring center white-label', 'Multi-location', 'API access', 'Custom reporting'] } }, affiliateStack: ['Calendly', 'Zoom', 'Notion', 'Stripe'], targetAudience: 'Independent tutors and small tutoring centers', competition: 'low', estimatedConversion: 0.036 }),

  base({ id: 'p16', name: 'PodcastOS', slug: 'podcastos', sovdTemplateId: 'podcastOS', sovdConfigured: false, niche: 'Podcasters', description: 'Podcast production management — episode planning, guest booking, sponsorship tracking, and analytics.', status: 'planned', tiers: { starter: { price: 147, features: ['Episode planner', 'Guest booking', 'Show notes generator', 'Publishing tracker', 'Basic analytics'] }, pro: { price: 297, features: ['All Starter +', 'Sponsorship CRM', 'Revenue tracking', 'Multi-show support', 'AI show notes'] }, agency: { price: 797, features: ['All Pro +', 'Network white-label', 'Multi-host mgmt', 'API access', 'Ad insertion mgmt'] } }, affiliateStack: ['Riverside.fm', 'Descript', 'ConvertKit', 'Buzzsprout'], targetAudience: 'Independent podcasters and small podcast networks', competition: 'low', estimatedConversion: 0.031 }),

  base({ id: 'p17', name: 'MusicOS', slug: 'musicos', sovdTemplateId: 'musicOS', sovdConfigured: false, niche: 'Musicians & Producers', description: 'Music production and business management — project tracking, client management, licensing, and revenue analytics.', status: 'planned', tiers: { starter: { price: 147, features: ['Project tracker', 'Client management', 'License tracking', 'Invoice generation', 'Revenue dashboard'] }, pro: { price: 297, features: ['All Starter +', 'Sample library mgmt', 'Collaboration tools', 'Split sheet tracking', 'Analytics'] }, agency: { price: 897, features: ['All Pro +', 'Label/studio white-label', 'Multi-artist mgmt', 'API access', 'Distribution tracking'] } }, affiliateStack: ['DistroKid', 'Splice', 'Stripe'], targetAudience: 'Independent musicians, producers, beatmakers', competition: 'low', estimatedConversion: 0.027 }),

  base({ id: 'p18', name: 'BookkeepOS', slug: 'bookkeepos', sovdTemplateId: 'bookkeepOS', sovdConfigured: false, niche: 'Bookkeeping Services', description: 'Bookkeeping service operations — client onboarding, document collection, deadline tracking, and workflow management.', status: 'planned', tiers: { starter: { price: 197, features: ['Client onboarding', 'Document collection', 'Deadline tracker', 'Workflow checklists', 'Basic reporting'] }, pro: { price: 397, features: ['All Starter +', 'Multi-client portal', 'Team assignments', 'Automated reminders', 'Revenue analytics'] }, agency: { price: 1097, features: ['All Pro +', 'Firm white-label', 'Multi-location', 'API access', 'Tax season workflows'] } }, affiliateStack: ['QuickBooks', 'Xero', 'Gusto', 'Stripe'], targetAudience: 'Independent bookkeepers and small accounting firms', competition: 'low', estimatedConversion: 0.033 }),

  base({ id: 'p19', name: 'VirtualAssistant', slug: 'virtualassistant', sovdTemplateId: 'virtualAssistant', sovdConfigured: false, niche: 'Virtual Assistants', description: 'VA service operations — task management, client communication, time tracking, and service delivery.', status: 'planned', tiers: { starter: { price: 147, features: ['Task management', 'Client inbox', 'Time tracking', 'Invoice generation', 'Service packages'] }, pro: { price: 297, features: ['All Starter +', 'Multi-client dashboard', 'SOP library', 'Automated reports', 'Revenue tracking'] }, agency: { price: 897, features: ['All Pro +', 'VA agency white-label', 'Multi-VA mgmt', 'API access', 'Client matching'] } }, affiliateStack: ['Notion', 'Calendly', 'Loom', 'Slack'], targetAudience: 'Independent VAs and small VA agencies', searchVolume: 'high', competition: 'medium', estimatedConversion: 0.035 }),

  base({ id: 'p20', name: 'SpeakerBrain', slug: 'speakerbrain', sovdTemplateId: 'speakerBrain', sovdConfigured: false, niche: 'Public Speakers', description: 'Speaking business management — event booking, speaker kit, travel logistics, and revenue tracking.', status: 'planned', tiers: { starter: { price: 247, features: ['Event calendar', 'Speaker kit builder', 'Lead tracking', 'Invoice generation', 'Travel planner'] }, pro: { price: 397, features: ['All Starter +', 'Bureau partnerships', 'Multi-format events', 'Client portal', 'Revenue analytics'] }, agency: { price: 1097, features: ['All Pro +', 'Speaker bureau white-label', 'Multi-speaker mgmt', 'API access', 'Event marketplace'] } }, affiliateStack: ['Calendly', 'Canva Pro', 'ConvertKit'], targetAudience: 'Professional speakers and speaking bureaus', competition: 'low', estimatedConversion: 0.029 }),
];

// ─── Budget Tracker ────────────────────────────────────────────────

export const budgetTracker: BudgetTracker = {
  totalBudget: 500,
  spent: 0,
  remaining: 500,
  dailyBudget: 16.67, // $500 / 30 days
  spendByPlatform: {
    meta: 0,
    google: 0,
    tiktok: 0,
  },
  spendByProduct: {},
  revenueFromAds: 0,
  organicRevenue: 0,
  roas: 0,
  costPerAcquisition: 0,
  budgetAlerts: [
    {
      id: 'ba-1',
      type: 'recommendation',
      message: 'With $500 total budget, CSUITE recommends $100 test windows per product. Kill any product that doesn\'t convert after $100 spend.',
      action: 'Set $100 kill threshold per product in ad manager',
      agent: 'FINANCE',
      timestamp: '2026-03-14T00:00:00Z',
    },
    {
      id: 'ba-2',
      type: 'recommendation',
      message: 'Organic-first strategy: 70% of effort should be organic (social, DMs, SEO). Ads validate, organic scales.',
      action: 'Prioritize social content creation before ad spend',
      agent: 'GROWTH',
      timestamp: '2026-03-14T00:00:00Z',
    },
    {
      id: 'ba-3',
      type: 'recommendation',
      message: 'Launch 50% off SaaS tier for first 2 weeks to build volume and social proof. $498.50 → $499 revenue per SaaS sale even at half price.',
      action: 'Configure launch pricing in LemonSqueezy',
      agent: 'FINANCE',
      timestamp: '2026-03-14T00:00:00Z',
    },
  ],
};

// ─── CSUITE Spend Recommendations (5 against the $500) ─────────────

export interface SpendRecommendation {
  id: string;
  title: string;
  allocation: number;
  rationale: string;
  expectedROAS: number;
  risk: string;
  agent: AgentName;
  confidence: string;
}

export const spendRecommendations: SpendRecommendation[] = [
  {
    id: 'sr-1',
    title: 'BarberBook Meta Ads — Pain-point creative',
    allocation: 150,
    rationale: 'Highest search volume in Tier 1, barbershop owners are active on Instagram/Facebook. Test 3 creatives at $50 each. Kill losers after $30.',
    expectedROAS: 5.2,
    risk: 'Audience saturation in 7-10 days at this spend level. Need to test broad vs interest targeting.',
    agent: 'GROWTH',
    confidence: 'Solid',
  },
  {
    id: 'sr-2',
    title: 'ChurchOS — Direct outreach + LinkedIn',
    allocation: 50,
    rationale: 'Low competition, high conversion potential. $50 on LinkedIn ads targeting church admins. Pair with 50 direct DMs to pastors.',
    expectedROAS: 8.0,
    risk: 'Small addressable audience on paid. Organic outreach is the real play here.',
    agent: 'GROWTH',
    confidence: 'High',
  },
  {
    id: 'sr-3',
    title: 'DJBook — Instagram Reels + TikTok organic boost',
    allocation: 100,
    rationale: 'DJs are extremely active on Instagram and TikTok. $100 to boost top-performing organic Reels. Visual product = viral potential.',
    expectedROAS: 4.0,
    risk: 'Creative quality must be high. Poor visuals = wasted spend.',
    agent: 'BRAND',
    confidence: 'Solid',
  },
  {
    id: 'sr-4',
    title: 'FreelanceOS — Gumroad Discover + X/Twitter',
    allocation: 100,
    rationale: 'Largest TAM. List on Gumroad for marketplace discovery (free). $100 on X/Twitter ads targeting #freelance, #solopreneur hashtag audiences.',
    expectedROAS: 3.5,
    risk: 'High competition in freelance tools. Differentiation must be clear in creative.',
    agent: 'GROWTH',
    confidence: 'Moderate',
  },
  {
    id: 'sr-5',
    title: 'Reserve fund — Retargeting + winning creative scale',
    allocation: 100,
    rationale: 'Hold $100 in reserve for week 2-3. When a winner emerges, pour this into retargeting and scaling the best creative. Do NOT spend this in week 1.',
    expectedROAS: 7.0,
    risk: 'Temptation to spend early. Discipline required.',
    agent: 'FINANCE',
    confidence: 'High',
  },
];

// ─── Platform Distribution Strategy ────────────────────────────────

export interface PlatformStrategy {
  platform: string;
  products: string[];
  rationale: string;
  fee: string;
  priority: 'primary' | 'secondary' | 'experimental';
}

export const platformStrategies: PlatformStrategy[] = [
  {
    platform: 'LemonSqueezy',
    products: ['All products'],
    rationale: 'Primary storefront. 5% fee, merchant of record, best checkout experience, programmatic webhooks for CSUITE tracking.',
    fee: '5% + $0.50',
    priority: 'primary',
  },
  {
    platform: 'Gumroad Discover',
    products: ['FreelanceOS', 'CoachPortal'],
    rationale: 'Free organic distribution. Freelancers and coaches browse Gumroad. 10% fee but discovery traffic is free. List at full price.',
    fee: '10% + $0.50 (30% via Discover)',
    priority: 'secondary',
  },
  {
    platform: 'Skool',
    products: ['CoachPortal', 'FreelanceOS'],
    rationale: 'Community-led sales. Bundle template access with Skool community membership. Upsell path from community to SaaS tier.',
    fee: '$99/mo platform fee',
    priority: 'secondary',
  },
  {
    platform: 'Direct (own website)',
    products: ['All premium/SaaS tier'],
    rationale: 'Zero platform fees for highest-value sales. Use for SaaS tier and custom enterprise deals.',
    fee: 'Stripe 2.9% + $0.30 only',
    priority: 'experimental',
  },
  {
    platform: 'AppSumo',
    products: ['BarberBook', 'FreelanceOS'],
    rationale: 'Lifetime deal marketplace. High volume, low margin. Use ONLY for initial traction and reviews. Cap at 100 deals.',
    fee: '70% rev share (their cut)',
    priority: 'experimental',
  },
];

// ─── Launch Deals ──────────────────────────────────────────────────

export interface LaunchDeal {
  id: string;
  name: string;
  type: 'discount' | 'bundle' | 'lifetime';
  description: string;
  discount: number;
  validUntil: string;
  maxRedemptions: number;
  redemptions: number;
  projectedRevenue: number;
}

export const launchDeals: LaunchDeal[] = [
  {
    id: 'deal-1',
    name: 'LAUNCH50 — SaaS Tier 50% Off',
    type: 'discount',
    description: 'All SaaS tier products at 50% off for first 2 weeks. $997 → $499/mo.',
    discount: 50,
    validUntil: '2026-03-29',
    maxRedemptions: 20,
    redemptions: 0,
    projectedRevenue: 9980,
  },
  {
    id: 'deal-2',
    name: 'EARLYBIRD — Starter 30% Off',
    type: 'discount',
    description: 'Starter tier 30% off for launch week. Builds volume and reviews fast.',
    discount: 30,
    validUntil: '2026-03-22',
    maxRedemptions: 50,
    redemptions: 0,
    projectedRevenue: 6895,
  },
  {
    id: 'deal-3',
    name: 'BUNDLE3 — Any 3 Starter templates',
    type: 'bundle',
    description: 'Buy any 3 Starter templates for the price of 2. Cross-niche operators love this.',
    discount: 33,
    validUntil: '2026-04-15',
    maxRedemptions: 30,
    redemptions: 0,
    projectedRevenue: 7880,
  },
];
