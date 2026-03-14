# CSUITE v0.0 — Testing & Launch Plan

## Pre-Launch Checklist (Before March 15, 12:00 AM)

### Infrastructure
- [ ] LemonSqueezy account created and storefront configured
- [ ] Webhook endpoints set up for real-time sales tracking
- [ ] Domain configured (csuite dashboard + template landing pages)
- [ ] SSL certificates active
- [ ] Meta Business Manager + Pixel installed
- [ ] Google Analytics 4 configured
- [ ] ConvertKit account + welcome sequence ready

### Templates (Tier 1)
- [ ] Restaurant template — QA complete, all pages responsive
- [ ] Real Estate template — QA complete, scheduling affiliate active
- [ ] Salon & Spa template — QA complete, visual assets finalized
- [ ] All affiliate links verified and tracking
- [ ] Template delivery mechanism tested (GitHub access or download)
- [ ] One-click deploy instructions verified

### Landing Pages
- [ ] Restaurant LP — live, pixel tracking, CTA working
- [ ] Real Estate LP — live, pixel tracking, CTA working
- [ ] Salon LP — live, pixel tracking, CTA working
- [ ] Mobile responsive verified on all 3
- [ ] Load time < 3 seconds

### CSUITE Dashboard
- [ ] All 7 pages rendering correctly
- [ ] ASK C panel functional
- [ ] Mobile responsive across all pages
- [ ] Mock data replaced with live data hooks (when available)
- [ ] Webhook integration tested with LemonSqueezy test events

## Testing Matrix

### Browser Testing
| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | [ ] | [ ] |
| Safari | [ ] | [ ] |
| Firefox | [ ] | [ ] |
| Edge | [ ] | [ ] |

### Page Testing
| Page | Loads | Filters Work | Data Displays | Mobile OK |
|------|-------|-------------|---------------|-----------|
| Command Center | [ ] | N/A | [ ] | [ ] |
| Offers | [ ] | [ ] | [ ] | [ ] |
| Decisions | [ ] | [ ] | [ ] | [ ] |
| Content & GTM | [ ] | [ ] | [ ] | [ ] |
| Master TODO | [ ] | [ ] | [ ] | [ ] |
| Learning Log | [ ] | [ ] | [ ] | [ ] |
| Agent Intel | [ ] | [ ] | [ ] | [ ] |

### Component Testing
| Component | Renders | States | Interactions |
|-----------|---------|--------|--------------|
| PassTracker | [ ] | [ ] | [ ] |
| ASK C Panel | [ ] | [ ] | [ ] |
| DecisionCard | [ ] | [ ] | [ ] |
| OfferCard | [ ] | [ ] | [ ] |
| AgentRecommendation | [ ] | [ ] | [ ] |
| BlockerAlert | [ ] | [ ] | [ ] |
| Badges (all types) | [ ] | [ ] | [ ] |

## Data Integration Phases

### Phase 1: Static Mock (Current)
- All data is mock/seed data
- Dashboard fully functional for layout/UX testing

### Phase 2: LemonSqueezy Webhook Integration
- Create API route: `/api/webhooks/lemonsqueezy`
- Validate webhook signatures
- Parse sale events → update KPI stats
- Track: template sales, revenue, customer count

### Phase 3: Affiliate Tracking
- Manual entry initially (dashboard form)
- ConvertKit API for email subscriber count
- Calendly affiliate dashboard scraping or API

### Phase 4: Full Live Data
- Real-time MRR calculation from LemonSqueezy
- Automated affiliate revenue aggregation
- Ad spend tracking (manual or Meta API)
- Conversion rate calculation from landing page analytics

## Monitoring & Alerting

### Daily Checks
1. Dashboard loads without errors
2. Sales data is syncing (if live)
3. Landing pages are accessible
4. Affiliate links are tracking
5. Ad campaigns are running

### Weekly Reviews
1. Revenue vs target pace
2. Conversion rates by niche
3. Agent recommendation accuracy
4. Override rate trend
5. Customer satisfaction feedback

## Rollback Plan
- All code in git, revert to last known good commit
- LemonSqueezy storefront can be paused independently
- Landing pages can be taken down without affecting dashboard
- Ad campaigns can be paused in Meta Business Manager

## Success Criteria
- Dashboard is operational and accurate by Sunday 3/15 12:00 AM
- First template sale within 72 hours of launch
- $10,000 MRR by April 15, 2026 11:59 PM
