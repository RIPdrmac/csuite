import { NextRequest, NextResponse } from 'next/server';
import { generateContent, generateAllVariants } from '@/lib/snowcone/generate';
import type { GenerateRequest, ContentFormat } from '@/lib/snowcone/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, personaId, formats, angle, allVariants } = body as GenerateRequest & { allVariants?: boolean };

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    if (!formats || formats.length === 0) {
      return NextResponse.json({ error: 'At least one format is required' }, { status: 400 });
    }

    // Generate all 3 tiers at once
    if (allVariants) {
      const results = await generateAllVariants(productId, formats as ContentFormat[], angle);
      return NextResponse.json({ success: true, variants: results });
    }

    // Generate for a single persona
    const results = await generateContent({
      productId,
      personaId: personaId || 'main',
      formats: formats as ContentFormat[],
      angle,
    });

    return NextResponse.json({ success: true, content: results });
  } catch (error) {
    console.error('[Snowcone API]', error);
    return NextResponse.json(
      { error: 'Generation failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
