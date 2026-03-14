import { NextRequest, NextResponse } from 'next/server';
import { notifyDailyRecap } from '@/lib/slack';
import { kpiStats } from '@/data/mock';

// 7:00 PM CDT — End of day financial recap
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await notifyDailyRecap(
    kpiStats.currentDailyPace,
    kpiStats.websitesSold,
    kpiStats.gap,
    kpiStats.daysLeft
  );

  return NextResponse.json({
    success: true,
    message: 'Daily recap sent to Slack',
    time: new Date().toISOString(),
  });
}
