import { NextRequest, NextResponse } from 'next/server';
import { notifyContentRun } from '@/lib/slack';

// 8:25 AM CDT — 5 minute warning before content generation
export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    // Allow in dev, verify in prod if secret is set
    if (process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  await notifyContentRun(5);

  return NextResponse.json({
    success: true,
    message: 'Content run notification sent — 5 min warning',
    time: new Date().toISOString(),
  });
}
