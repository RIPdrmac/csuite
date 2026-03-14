import { products } from '@/data/products';

function PricingCard({ product }: { product: typeof products[0] }) {
  const tiers = [
    { name: 'Starter', price: product.tiers.starter.price, features: product.tiers.starter.features, popular: false },
    { name: 'Pro', price: product.tiers.pro.price, features: product.tiers.pro.features, popular: true },
    { name: 'Agency', price: product.tiers.agency.price, features: product.tiers.agency.features, popular: false },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-12">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-[13px] text-indigo-400 font-medium tracking-wide">AI-POWERED</span>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight mb-3">{product.name}</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">{product.description}</p>
          <p className="text-sm text-zinc-500 mt-3">{product.niche} · One-time purchase · Lifetime updates</p>
        </div>

        {/* Pricing grid */}
        <div className="grid grid-cols-3 gap-5">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-8 ${
                tier.popular
                  ? 'bg-[#111113] border-2 border-indigo-500/40 shadow-2xl shadow-indigo-500/10'
                  : 'bg-[#0f0f11] border border-zinc-800/60'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-500 text-white text-[11px] font-bold tracking-wider uppercase">
                  Most Popular
                </div>
              )}
              <div className={`text-[13px] font-semibold uppercase tracking-widest mb-2 ${tier.popular ? 'text-indigo-400' : 'text-zinc-500'}`}>
                {tier.name}
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-bold text-white">${tier.price}</span>
                <span className="text-zinc-500 text-sm">one-time</span>
              </div>
              <button className={`w-full py-3 rounded-xl text-[14px] font-semibold mb-8 transition-all ${
                tier.popular
                  ? 'bg-indigo-500 text-white hover:bg-indigo-400'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}>
                Get {product.name}
              </button>
              <ul className="space-y-3">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px]">
                    <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tier.popular ? 'text-indigo-400' : 'text-zinc-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-zinc-300">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-zinc-500 text-sm">
            Includes lifetime updates · Deploy on Vercel in 60 seconds · Built with Next.js + AI
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const slug = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('product') : null;
  // Default to BarberBook, show all 3 stacked for screenshot purposes
  const featured = products.filter(p => ['p1', 'p2', 'p3'].includes(p.id));

  return (
    <div className="bg-[#09090b]">
      {featured.map(p => (
        <div key={p.id} id={p.slug}>
          <PricingCard product={p} />
        </div>
      ))}
    </div>
  );
}
