// ─── Snowcone Content Generation Engine ────────────────────────────
// Claude-powered copy generation tuned for webOS product positioning

import Anthropic from '@anthropic-ai/sdk';
import { getPersona } from './personas';
import { products } from '@/data/products';
import type { GenerateRequest, GeneratedContent, ContentFormat, CarouselSlide, PricingCardData } from './types';
import { CONTENT_ANGLES } from './types';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function buildGenerationPrompt(
  productName: string,
  productDescription: string,
  niche: string,
  personaId: string,
  format: ContentFormat,
  angle?: string
): string {
  const persona = getPersona(personaId);
  const angleInfo = angle ? CONTENT_ANGLES.find(a => a.id === angle) : null;

  return `You are Snowcone — the content generation engine for RIP (Research In Public). You create high-converting social media content for AI-powered business operating systems.

PRODUCT: ${productName}
NICHE: ${niche}
DESCRIPTION: ${productDescription}
TIER: ${persona.name}
PRICE: ${persona.pricePoint}

BRAND VOICE: ${persona.voice}
POSITIONING: ${persona.positioning}
ANTI-COMPETITOR ANGLE: ${persona.antiCompetitor}

${angleInfo ? `SPECIFIC ANGLE: ${angleInfo.label} — ${angleInfo.description}` : ''}

COPY RULES:
${persona.copyRules.map((r, i) => `${i + 1}. ${r}`).join('\n')}

FORMAT: ${format}

${format === 'instagram_single' ? `Generate a single Instagram post (1080x1080 context):
- Hook: First line that stops the scroll (max 10 words, punchy)
- Body: 3-5 short paragraphs, value-driven, conversational
- CTA: Clear call to action with link-in-bio reference
- Hashtags: 8-12 relevant hashtags from: ${persona.hashtagSets.instagram.join(', ')}
Return as JSON: { "hook": "...", "body": "...", "cta": "...", "hashtags": ["..."] }` : ''}

${format === 'instagram_carousel' ? `Generate an Instagram carousel (1080x1440, 5-7 slides):
- Slide 1 (Cover): Bold hook that creates curiosity
- Slides 2-5: One key point per slide, short text, impactful
- Slide 6: Social proof or comparison stat
- Slide 7 (CTA): Clear call to action
Also provide a caption with hashtags.
Return as JSON: { "hook": "...", "body": "...", "cta": "...", "hashtags": ["..."], "slides": [{ "slideNumber": 1, "title": "...", "body": "..." }, ...] }` : ''}

${format === 'linkedin_post' ? `Generate a LinkedIn post:
- Hook: First line that creates engagement (question, bold statement, or contrarian take)
- Body: 5-8 short paragraphs, professional but human, data-driven
- CTA: Soft sell — link to product or conversation starter
- Hashtags: 3-5 LinkedIn hashtags from: ${persona.hashtagSets.linkedin.join(', ')}
Return as JSON: { "hook": "...", "body": "...", "cta": "...", "hashtags": ["..."] }` : ''}

${format === 'linkedin_carousel' ? `Generate a LinkedIn carousel (1080x1080, 6-8 slides):
- Slide 1: Problem statement that resonates with business owners
- Slides 2-6: Solution breakdown, one point per slide
- Slide 7: ROI/comparison data
- Slide 8: CTA with product positioning
Also provide a caption.
Return as JSON: { "hook": "...", "body": "...", "cta": "...", "hashtags": ["..."], "slides": [{ "slideNumber": 1, "title": "...", "body": "..." }, ...] }` : ''}

${format === 'x_tweet' ? `Generate a tweet (max 280 chars):
- Punchy, opinionated, quotable
- Build-in-public energy
- No hashtags in tweet body (put separately)
Return as JSON: { "hook": "...", "body": "", "cta": "...", "hashtags": ["..."] }` : ''}

${format === 'x_thread' ? `Generate an X thread (5-8 tweets):
- Tweet 1: Hook that creates curiosity
- Tweets 2-6: Story/breakdown, each tweet stands alone
- Last tweet: CTA
Return as JSON: { "hook": "...", "body": "...", "cta": "...", "hashtags": ["..."], "slides": [{ "slideNumber": 1, "title": "Tweet 1", "body": "..." }, ...] }` : ''}

${format === 'pricing_card' ? `Generate pricing card copy:
- Headline: Product name + tier
- Subheadline: One-line value prop specific to this tier
- Price: ${persona.pricePoint}
- Feature list context: Why each feature matters (not just the feature name)
- CTA button text
- Anti-competitor comparison line
Return as JSON: { "hook": "...", "body": "...", "cta": "...", "hashtags": [], "pricingCard": { "headline": "...", "subheadline": "...", "price": "...", "featureContext": ["..."], "ctaButton": "...", "comparisonLine": "..." } }` : ''}

${format === 'ad_creative' ? `Generate ad copy (Meta/Instagram ads):
- Primary text: 2-3 sentences max, hook + value + CTA
- Headline: 5-8 words
- Description: One line
- CTA button: Choose from "Learn More", "Get Started", "Sign Up"
Return as JSON: { "hook": "...", "body": "...", "cta": "...", "hashtags": [] }` : ''}

CRITICAL: Return ONLY valid JSON. No markdown, no explanation, just the JSON object.`;
}

export async function generateContent(request: GenerateRequest): Promise<GeneratedContent[]> {
  const product = products.find(p => p.id === request.productId);
  if (!product) throw new Error(`Product ${request.productId} not found`);

  const results: GeneratedContent[] = [];

  for (const format of request.formats) {
    try {
      const prompt = buildGenerationPrompt(
        product.name,
        product.description,
        product.niche,
        request.personaId,
        format,
        request.angle
      );

      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '';

      // Parse JSON from response (handle markdown code blocks)
      let parsed;
      try {
        const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsed = JSON.parse(jsonStr);
      } catch {
        parsed = { hook: text.slice(0, 100), body: text, cta: '', hashtags: [] };
      }

      const platform = format.startsWith('instagram') ? 'instagram'
        : format.startsWith('linkedin') ? 'linkedin'
        : format.startsWith('x_') ? 'x'
        : 'all';

      const content: GeneratedContent = {
        id: `sc-${Date.now()}-${format}`,
        productId: product.id,
        productName: product.name,
        personaId: request.personaId,
        format,
        content: {
          hook: parsed.hook || '',
          body: parsed.body || '',
          cta: parsed.cta || '',
          hashtags: parsed.hashtags || [],
        },
        carousel: parsed.slides?.map((s: any) => ({
          slideNumber: s.slideNumber,
          title: s.title,
          body: s.body,
        })) as CarouselSlide[] | undefined,
        pricingCard: parsed.pricingCard as PricingCardData | undefined,
        status: 'draft',
        platform,
        performance: { impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
        createdAt: new Date().toISOString(),
      };

      results.push(content);
    } catch (error) {
      console.error(`[Snowcone] Error generating ${format} for ${product.name}:`, error);
    }
  }

  return results;
}

// Generate content for all 3 tiers simultaneously
export async function generateAllVariants(
  productId: string,
  formats: ContentFormat[],
  angle?: string
): Promise<{ starter: GeneratedContent[]; pro: GeneratedContent[]; agency: GeneratedContent[] }> {
  const [starter, pro, agency] = await Promise.all([
    generateContent({ productId, personaId: 'starter', formats, angle }),
    generateContent({ productId, personaId: 'pro', formats, angle }),
    generateContent({ productId, personaId: 'agency', formats, angle }),
  ]);

  return { starter, pro, agency };
}
