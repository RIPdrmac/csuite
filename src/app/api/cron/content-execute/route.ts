import { NextRequest, NextResponse } from 'next/server';
import { generateAllVariants } from '@/lib/snowcone/generate';
import { notifyContentGenerated } from '@/lib/slack';
import { products } from '@/data/products';

// 8:30 AM CDT — Auto-generate content for all live products
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const liveProducts = products.filter(p => p.status === 'live');
  const results: any[] = [];
  const productNames: string[] = [];

  for (const product of liveProducts) {
    try {
      const variants = await generateAllVariants(
        product.id,
        ['instagram_single', 'linkedin_post'],
        'anti-styleseat'
      );
      results.push({ product: product.name, variants });
      productNames.push(product.name);
    } catch (error) {
      console.error(`[Cron] Failed to generate for ${product.name}:`, error);
    }
  }

  const totalPieces = results.reduce((sum, r) => {
    return sum + (r.variants.starter?.length || 0) + (r.variants.pro?.length || 0) + (r.variants.agency?.length || 0);
  }, 0);

  // Notify Slack
  await notifyContentGenerated(totalPieces, productNames);

  return NextResponse.json({
    success: true,
    message: `Generated ${totalPieces} content pieces for ${productNames.join(', ')}`,
    products: productNames,
    totalPieces,
    time: new Date().toISOString(),
  });
}
