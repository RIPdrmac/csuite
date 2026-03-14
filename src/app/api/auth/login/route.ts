import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { user, pass } = await request.json();

  if (user === 'csuite' && pass === 'testing11momo') {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
