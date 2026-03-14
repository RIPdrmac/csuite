// ─── Snowcone Personas for RIP Product Line ────────────────────────
// 4 personas: MAIN (all tiers), VARIANT 1 (Starter), VARIANT 2 (Pro), VARIANT 3 (Agency)
// Positioning: Not a website — it's a webOS. Claude-connected intelligence.
// Angle: You control your data. No StyleSeat taking 25%. No Acuity limitations.
// RULE: Product descriptions must be 120-160 characters. No exceptions.
// RULE: Pricing cards must show ALL 3 tiers on one image — 4:3 ratio (1600x1200px). Never separate tier images.

export interface SnowconePersona {
  id: string;
  name: string;
  handle: string;
  description: string;
  voice: string;
  positioning: string;
  antiCompetitor: string;
  pricePoint: string;
  targetBuyer: string;
  copyRules: string[];
  hashtagSets: {
    instagram: string[];
    linkedin: string[];
  };
  ctaTemplates: string[];
}

export const personas: Record<string, SnowconePersona> = {
  main: {
    id: 'main',
    name: 'RIP Product',
    handle: '@researchinpublic',
    description: 'Main brand voice for all products — positions the full webOS ecosystem',
    voice: 'Authoritative but accessible. Technical credibility without jargon. Confident, not salesy. We build tools that think.',
    positioning: 'These aren\'t websites. They\'re AI-powered operating systems for your business. Claude-connected intelligence that manages your clients, automates your follow-ups, and grows your revenue while you focus on your craft.',
    antiCompetitor: 'Stop renting your business on platforms that take 25% of every booking. StyleSeat, Acuity, Calendly — they own your client data, they set the rules, they take the cut. With a webOS, YOU own everything.',
    pricePoint: '$197 / $397 / $997 — one-time, lifetime updates',
    targetBuyer: 'Service business owners who are tired of cobbling together 5 different tools and paying monthly for each one',
    copyRules: [
      'Never say "website" — say "operating system" or "webOS"',
      'Lead with the problem, not the product',
      'Always mention AI/Claude intelligence as a differentiator',
      'Include specific ROI: "pays for itself in X bookings"',
      'Use real numbers: "25% StyleSeat fee on $4K/month = $1,000 wasted"',
      'End with urgency but not desperation',
    ],
    hashtagSets: {
      instagram: ['#AIbusiness', '#webOS', '#barbershoptech', '#churchtech', '#djlife', '#smallbusinessowner', '#entrepreneurlife', '#AItools', '#businessautomation', '#ownYourData'],
      linkedin: ['#AI', '#SaaS', '#SmallBusiness', '#Entrepreneurship', '#BusinessIntelligence', '#TechStartup', '#DigitalTransformation'],
    },
    ctaTemplates: [
      'Stop renting. Start owning. Link in bio.',
      'Your business deserves a brain. Not just a booking page.',
      '$197 one-time. No monthly fees. No platform cuts. Just yours.',
      'Deploy in 60 seconds. Own it forever.',
    ],
  },

  starter: {
    id: 'starter',
    name: 'Starter Tier',
    handle: '@researchinpublic',
    description: 'Entry-level positioning — volume play, lowest friction',
    voice: 'Direct, empathetic, problem-focused. Speaks to the pain of paying too much for basic tools.',
    positioning: 'For $197, you get what StyleSeat charges you $1,000/month to rent. Appointment booking, client database, revenue tracking, SMS reminders, and AI follow-ups. One payment. Done.',
    antiCompetitor: 'StyleSeat takes 25% of every booking. Acuity charges $25/month for basic scheduling. Calendly wants $12/month per person. You\'re paying $500+/year just to let clients book with you. We fixed that.',
    pricePoint: '$197 one-time',
    targetBuyer: 'Solo operators just starting out or switching from expensive monthly tools',
    copyRules: [
      'Lead with price comparison: "$197 once vs $500+/year on tools"',
      'Emphasize simplicity: "everything in one place"',
      'Show the math: specific savings vs current tools',
      'Low friction CTA: "try it, deploy in 60 seconds"',
      'Testimonial-ready: "what would you do with an extra $500/year?"',
    ],
    hashtagSets: {
      instagram: ['#solopreneur', '#smallbiz', '#savemoney', '#businesstools', '#nomonthly', '#ownit', '#barbershop', '#freelancer', '#sideHustle'],
      linkedin: ['#Startup', '#SmallBusiness', '#SoloFounder', '#CostSavings', '#BusinessTools'],
    },
    ctaTemplates: [
      '$197. One time. Everything you need to run your business.',
      'Stop paying monthly for tools you should own.',
      'Your first client pays for the whole system.',
      'What would you do with $500 back in your pocket every year?',
    ],
  },

  pro: {
    id: 'pro',
    name: 'Pro Tier',
    handle: '@researchinpublic',
    description: 'Sweet spot positioning — recommended tier, ROI-focused',
    voice: 'Professional, ROI-focused, growth-minded. Speaks to scaling, not surviving.',
    positioning: 'The Pro tier is for operators ready to scale. Multi-staff scheduling, team analytics, automated waitlists, custom branding — this is what a $5K custom build looks like, for $397.',
    antiCompetitor: 'Custom development costs $5,000-$15,000 and takes months. Agency retainers run $2,000/month. The Pro tier gives you enterprise-grade tools at 1/10th the cost, deployed in 60 seconds.',
    pricePoint: '$397 one-time',
    targetBuyer: 'Growing businesses with 2-10 staff who need team management and analytics',
    copyRules: [
      'Compare to custom development cost: "$397 vs $5K-$15K"',
      'Emphasize team features: multi-staff, analytics, branding',
      'ROI framing: "pays for itself in 2 weeks of saved admin time"',
      'Growth narrative: "built for where you\'re going, not just where you are"',
      'Badge as "RECOMMENDED" or "MOST POPULAR"',
    ],
    hashtagSets: {
      instagram: ['#scaling', '#businessgrowth', '#teammanagement', '#analytics', '#professionaltools', '#entrepreneurmindset', '#growth', '#AIpowered'],
      linkedin: ['#GrowthStrategy', '#TeamManagement', '#BusinessAnalytics', '#ScaleUp', '#ROI', '#AITools'],
    },
    ctaTemplates: [
      'Enterprise tools. Solo price. $397 once.',
      'Your team deserves better than a spreadsheet.',
      'Pays for itself in 2 weeks. Keeps paying forever.',
      'Stop managing. Start growing.',
    ],
  },

  agency: {
    id: 'agency',
    name: 'Agency Tier',
    handle: '@researchinpublic',
    description: 'Premium positioning — white-label, multi-location, high ARPU',
    voice: 'Exclusive, premium, strategic. Speaks to business owners who think in systems and scale.',
    positioning: 'The Agency tier turns you from an operator into a platform. White-label deployment, multi-location management, full API access. You\'re not just running a business — you\'re running a network.',
    antiCompetitor: 'Franchise software costs $10K-$50K upfront plus $500-$2K/month per location. White-label SaaS platforms charge $997/month minimum. The Agency tier is $997 once — deploy unlimited locations, own the platform.',
    pricePoint: '$997 one-time',
    targetBuyer: 'Multi-location operators, franchise owners, agencies reselling to clients',
    copyRules: [
      'Exclusivity framing: "for operators who think in networks"',
      'Compare to franchise software: "$997 once vs $10K+ setup"',
      'Emphasize white-label: "your brand, your platform, your rules"',
      'Scale narrative: "one purchase, unlimited locations"',
      'Premium feel: no discount language, no urgency pressure',
    ],
    hashtagSets: {
      instagram: ['#whitelabel', '#franchise', '#multiplelocations', '#platformbuilder', '#agency', '#businessempire', '#scalable', '#premium'],
      linkedin: ['#WhiteLabel', '#FranchiseTech', '#PlatformBusiness', '#AgencyLife', '#Enterprise', '#MultiLocation'],
    },
    ctaTemplates: [
      'Own the platform. Not just the business.',
      '$997. White-label. Unlimited locations. Forever.',
      'Stop being a tenant on someone else\'s platform.',
      'Your brand. Your data. Your rules.',
    ],
  },
};

export function getPersona(id: string): SnowconePersona {
  return personas[id] || personas.main;
}

export function getAllPersonas(): SnowconePersona[] {
  return Object.values(personas);
}
