import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { DAILY_SCHEDULE } from '@/lib/snowcone/types';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { contentId, platform, scheduledFor, slot } = await request.json();

    // Log to Notion Copy Memory DB
    if (process.env.NOTION_COPY_DB) {
      await notion.pages.create({
        parent: { database_id: process.env.NOTION_COPY_DB },
        properties: {
          'Name': { title: [{ text: { content: `Scheduled: ${contentId} → ${platform}` } }] },
          'Type': { select: { name: 'Social Post' } },
          'Performance': { select: { name: 'Testing' } },
          'Date': { date: { start: scheduledFor || new Date().toISOString().split('T')[0] } },
        },
      });
    }

    return NextResponse.json({
      success: true,
      schedule: { contentId, platform, scheduledFor, slot, status: 'pending' },
    });
  } catch (error) {
    console.error('[Snowcone Schedule]', error);
    return NextResponse.json(
      { error: 'Scheduling failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}

// GET: Return the daily schedule template
export async function GET() {
  return NextResponse.json({ schedule: DAILY_SCHEDULE });
}
