import { products } from '@/data/products';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ product: string; tier: string }>;
}

export function generateStaticParams() {
  const tiers = ['starter', 'pro', 'agency'];
  return products
    .filter(p => ['p1', 'p2', 'p3'].includes(p.id))
    .flatMap(p => tiers.map(t => ({ product: p.slug, tier: t })));
}

export default async function TierPricingPage({ params }: Props) {
  const { product: slug, tier } = await params;
  const product = products.find(p => p.slug === slug);
  if (!product) notFound();

  const tierKey = tier as 'starter' | 'pro' | 'agency';
  const tierData = product.tiers[tierKey];
  if (!tierData) notFound();

  const isPro = tier === 'pro';
  const isAgency = tier === 'agency';

  const competitors: Record<string, { name: string; cost: string; problem: string }> = {
    barberbook: { name: 'StyleSeat', cost: '$3,000+/year in fees', problem: 'takes 25% of every booking' },
    churchos: { name: 'Tithe.ly/Planning Center', cost: '$1,200+/year', problem: 'limited customization, locked data' },
    djbook: { name: 'Honeybook/Dubsado', cost: '$960+/year', problem: 'not built for entertainment, generic CRM' },
  };

  const comp = competitors[slug] || competitors.barberbook;

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-0">
      <div className="w-[1600px] h-[1200px] bg-[#09090b] flex flex-col items-center justify-center px-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="text-[15px] text-indigo-400 font-medium tracking-widest uppercase">
            {tier === 'starter' ? 'Get Started' : tier === 'pro' ? 'Most Popular' : 'White-Label Platform'}
          </span>
        </div>

        {/* Product + Tier */}
        <h1 className="text-7xl font-bold text-white tracking-tight mb-2">{product.name}</h1>
        <h2 className={`text-3xl font-semibold tracking-wide mb-4 ${isPro ? 'text-indigo-400' : isAgency ? 'text-amber-400' : 'text-emerald-400'}`}>
          {tier.toUpperCase()} TIER
        </h2>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-8xl font-bold text-white">${tierData.price}</span>
          <span className="text-2xl text-zinc-500">one-time</span>
        </div>

        {/* Anti-competitor */}
        <div className="px-8 py-4 rounded-xl bg-zinc-900/80 border border-zinc-800 mb-10 max-w-3xl text-center">
          <p className="text-[17px] text-zinc-300 leading-relaxed">
            {comp.name} {comp.problem} — costing you <span className="text-red-400 font-semibold">{comp.cost}</span>.
            <br />
            {product.name} gives you <span className="text-white font-semibold">everything for ${tierData.price} once</span>. You own it forever.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-3 gap-6 max-w-4xl w-full mb-10">
          {tierData.features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <svg className={`w-6 h-6 flex-shrink-0 ${isPro ? 'text-indigo-400' : isAgency ? 'text-amber-400' : 'text-emerald-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[18px] text-zinc-200">{f}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className={`px-12 py-5 rounded-2xl text-[20px] font-bold ${
          isPro ? 'bg-indigo-500 text-white' : isAgency ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-white'
        }`}>
          Get {product.name} {tier.charAt(0).toUpperCase() + tier.slice(1)} — ${tierData.price}
        </button>

        {/* Footer */}
        <p className="text-zinc-600 text-[14px] mt-6">
          AI-Powered webOS · Claude Intelligence · Deploy in 60 seconds · Lifetime updates
        </p>
      </div>
    </div>
  );
}
