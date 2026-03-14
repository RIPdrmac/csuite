import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// ─── Verify LemonSqueezy webhook signature ─────────────────────────
function verifySignature(payload: string, signature: string | null): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

// ─── Map LemonSqueezy variant to tier ──────────────────────────────
function detectTier(variantName: string, price: number): string {
  const name = variantName.toLowerCase();
  if (name.includes('agency') || price >= 700) return 'Agency';
  if (name.includes('pro') || price >= 300) return 'Pro';
  return 'Starter';
}

// ─── Map product name to our product ───────────────────────────────
function detectProduct(productName: string): string {
  const name = productName.toLowerCase();
  if (name.includes('barber')) return 'BarberBook';
  if (name.includes('church')) return 'ChurchOS';
  if (name.includes('dj')) return 'DJBook';
  if (name.includes('freelance')) return 'FreelanceOS';
  if (name.includes('realtor') || name.includes('real estate')) return 'RealtorBrain';
  if (name.includes('law')) return 'LawDraft';
  if (name.includes('nutrition')) return 'NutritionOS';
  if (name.includes('consultant')) return 'ConsultantOS';
  if (name.includes('coach')) return 'CoachPortal';
  if (name.includes('creator')) return 'CreatorOS';
  if (name.includes('rental')) return 'RentalBrain';
  if (name.includes('career')) return 'CareerCoach';
  if (name.includes('hire') || name.includes('recruit')) return 'HireOS';
  if (name.includes('clean')) return 'CleaningBiz';
  if (name.includes('tutor')) return 'TutorOS';
  if (name.includes('podcast')) return 'PodcastOS';
  if (name.includes('music')) return 'MusicOS';
  if (name.includes('bookkeep')) return 'BookkeepOS';
  if (name.includes('virtual') || name.includes(' va')) return 'VirtualAssistant';
  if (name.includes('speaker')) return 'SpeakerBrain';
  return productName;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-signature');

    // Verify signature if we have a secret (skip in dev/testing)
    if (process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
      if (!verifySignature(rawBody, signature)) {
        console.error('Webhook signature verification failed');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventName = event.meta?.event_name;
    const data = event.data?.attributes;

    console.log(`[LemonSqueezy] Event: ${eventName}`, data?.first_order_item?.product_name);

    // ── Handle order_created ──
    if (eventName === 'order_created') {
      const customerEmail = data?.user_email || '';
      const customerName = data?.user_name || '';
      const total = (data?.total || 0) / 100; // cents to dollars
      const productName = data?.first_order_item?.product_name || 'Unknown';
      const variantName = data?.first_order_item?.variant_name || '';
      const status = data?.status || 'paid';

      const product = detectProduct(productName);
      const tier = detectTier(variantName, total);

      // Log to Notion Sales DB
      if (process.env.NOTION_SALES_DB) {
        await notion.pages.create({
          parent: { database_id: process.env.NOTION_SALES_DB },
          properties: {
            'Name': { title: [{ text: { content: `${product} — ${customerName || customerEmail}` } }] },
            'Product': { select: { name: product } },
            'Tier': { select: { name: tier } },
            'Amount': { number: total },
            'Platform': { select: { name: 'LemonSqueezy' } },
            'Customer Email': { email: customerEmail },
            'Status': { select: { name: status === 'paid' ? 'Completed' : 'Pending' } },
            'Date': { date: { start: new Date().toISOString().split('T')[0] } },
          },
        });
        console.log(`[Notion] Sale logged: ${product} ${tier} $${total} — ${customerEmail}`);
      }

      // TODO: Auto-invite to GitHub repo
      // TODO: Send welcome email via Resend
      // TODO: Trigger ConvertKit welcome sequence

      return NextResponse.json({
        success: true,
        message: `Sale processed: ${product} ${tier} $${total}`,
        product,
        tier,
        total,
        customer: customerEmail,
      });
    }

    // ── Handle subscription_created ──
    if (eventName === 'subscription_created') {
      const customerEmail = data?.user_email || '';
      const productName = data?.product_name || 'Unknown';
      const variantName = data?.variant_name || '';
      const total = (data?.first_subscription_item?.price || 0) / 100;

      const product = detectProduct(productName);
      const tier = detectTier(variantName, total);

      if (process.env.NOTION_SALES_DB) {
        await notion.pages.create({
          parent: { database_id: process.env.NOTION_SALES_DB },
          properties: {
            'Name': { title: [{ text: { content: `${product} Sub — ${customerEmail}` } }] },
            'Product': { select: { name: product } },
            'Tier': { select: { name: tier } },
            'Amount': { number: total },
            'Platform': { select: { name: 'LemonSqueezy' } },
            'Customer Email': { email: customerEmail },
            'Status': { select: { name: 'Completed' } },
            'Date': { date: { start: new Date().toISOString().split('T')[0] } },
          },
        });
        console.log(`[Notion] Subscription logged: ${product} ${tier} $${total}/mo — ${customerEmail}`);
      }

      return NextResponse.json({ success: true, message: `Subscription: ${product} ${tier} $${total}/mo` });
    }

    // ── Handle subscription_updated (cancellation, pause, etc) ──
    if (eventName === 'subscription_updated') {
      const status = data?.status;
      const customerEmail = data?.user_email || '';
      console.log(`[LemonSqueezy] Subscription ${status} for ${customerEmail}`);
      return NextResponse.json({ success: true, message: `Subscription update: ${status}` });
    }

    // Unknown event — acknowledge anyway
    return NextResponse.json({ success: true, message: `Event ${eventName} received` });

  } catch (error) {
    console.error('[LemonSqueezy Webhook Error]', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
