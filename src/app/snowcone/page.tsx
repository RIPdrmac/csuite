'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KPIStatCard } from '@/components/csuite/kpi-stat-card';
import { products } from '@/data/products';
import { personas } from '@/lib/snowcone/personas';
import { CONTENT_ANGLES, DAILY_SCHEDULE } from '@/lib/snowcone/types';
import type { ContentFormat, GeneratedContent } from '@/lib/snowcone/types';
import { cn } from '@/lib/utils';
import { Loader2, Zap, Send, Clock, Instagram, Linkedin, Copy, Check } from 'lucide-react';

const FORMAT_OPTIONS: { id: ContentFormat; label: string; platform: string }[] = [
  { id: 'instagram_single', label: 'IG Single Post', platform: 'instagram' },
  { id: 'instagram_carousel', label: 'IG Carousel', platform: 'instagram' },
  { id: 'linkedin_post', label: 'LinkedIn Post', platform: 'linkedin' },
  { id: 'linkedin_carousel', label: 'LinkedIn Carousel', platform: 'linkedin' },
  { id: 'x_tweet', label: 'Tweet', platform: 'x' },
  { id: 'x_thread', label: 'X Thread', platform: 'x' },
  { id: 'pricing_card', label: 'Pricing Card', platform: 'all' },
  { id: 'ad_creative', label: 'Ad Creative', platform: 'all' },
];

export default function SnowconePage() {
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || '');
  const [selectedPersona, setSelectedPersona] = useState<string>('main');
  const [selectedFormats, setSelectedFormats] = useState<ContentFormat[]>(['instagram_single', 'linkedin_post']);
  const [selectedAngle, setSelectedAngle] = useState<string>('');
  const [allVariants, setAllVariants] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeneratedContent[] | null>(null);
  const [variantResults, setVariantResults] = useState<{ starter: GeneratedContent[]; pro: GeneratedContent[]; agency: GeneratedContent[] } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const liveProducts = products.filter(p => p.status === 'live' || p.status === 'staging');

  const handleGenerate = async () => {
    setLoading(true);
    setResults(null);
    setVariantResults(null);

    try {
      const res = await fetch('/api/snowcone/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct,
          personaId: selectedPersona,
          formats: selectedFormats,
          angle: selectedAngle || undefined,
          allVariants,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (allVariants) {
        setVariantResults(data.variants);
      } else {
        setResults(data.content);
      }
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFormat = (f: ContentFormat) => {
    setSelectedFormats(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  const renderContent = (content: GeneratedContent) => (
    <Card key={content.id} hover className="overflow-hidden">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant={content.platform === 'instagram' ? 'accent' : content.platform === 'linkedin' ? 'info' : 'default'}>
              {content.format.replace(/_/g, ' ')}
            </Badge>
            <span className="text-[11px] text-muted font-mono">{content.personaId}</span>
          </div>
          <button
            onClick={() => handleCopy(`${content.content.hook}\n\n${content.content.body}\n\n${content.content.cta}\n\n${content.content.hashtags.join(' ')}`, content.id)}
            className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-card-hover transition-colors"
          >
            {copiedId === content.id ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Hook */}
        <div className="text-[15px] font-semibold text-foreground mb-2">{content.content.hook}</div>

        {/* Body */}
        <div className="text-[13px] text-muted-foreground leading-relaxed whitespace-pre-wrap mb-2">
          {content.content.body}
        </div>

        {/* CTA */}
        {content.content.cta && (
          <div className="text-[13px] text-accent font-medium mb-2">{content.content.cta}</div>
        )}

        {/* Carousel slides */}
        {content.carousel && (
          <div className="mt-3 space-y-1.5">
            <div className="text-[11px] text-muted uppercase tracking-wider">Carousel Slides</div>
            {content.carousel.map((slide) => (
              <div key={slide.slideNumber} className="px-3 py-2 rounded-lg bg-card-hover border border-border">
                <span className="text-[10px] text-muted font-mono">Slide {slide.slideNumber}</span>
                <div className="text-[13px] font-medium text-foreground">{slide.title}</div>
                <div className="text-[12px] text-muted-foreground">{slide.body}</div>
              </div>
            ))}
          </div>
        )}

        {/* Hashtags */}
        {content.content.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {content.content.hashtags.map((h, i) => (
              <span key={i} className="text-[11px] text-accent/70">{h.startsWith('#') ? h : `#${h}`}</span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen">
      <PageHeader title="Snowcone" subtitle="Content generation engine — copy, images, scheduling" />

      <div className="px-4 md:px-8 py-6 space-y-5">
        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Product selector */}
          <Card className="p-4">
            <div className="text-[11px] text-muted uppercase tracking-wider mb-2">Product</div>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full h-9 px-3 text-[13px] bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-accent/50"
            >
              {liveProducts.map(p => (
                <option key={p.id} value={p.id}>{p.name} — {p.niche}</option>
              ))}
            </select>
          </Card>

          {/* Persona selector */}
          <Card className="p-4">
            <div className="text-[11px] text-muted uppercase tracking-wider mb-2">Persona / Tier</div>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(personas).map(id => (
                <button
                  key={id}
                  onClick={() => { setSelectedPersona(id); setAllVariants(false); }}
                  className={cn(
                    'px-2.5 py-1 text-[11px] rounded-md font-medium transition-colors',
                    selectedPersona === id && !allVariants
                      ? 'bg-accent text-white'
                      : 'bg-card-hover text-muted-foreground hover:text-foreground'
                  )}
                >
                  {id === 'main' ? 'ALL' : id.toUpperCase()}
                </button>
              ))}
              <button
                onClick={() => setAllVariants(!allVariants)}
                className={cn(
                  'px-2.5 py-1 text-[11px] rounded-md font-medium transition-colors',
                  allVariants ? 'bg-success text-white' : 'bg-card-hover text-muted-foreground hover:text-foreground'
                )}
              >
                3x VARIANT
              </button>
            </div>
          </Card>

          {/* Format selector */}
          <Card className="p-4">
            <div className="text-[11px] text-muted uppercase tracking-wider mb-2">Formats</div>
            <div className="flex flex-wrap gap-1.5">
              {FORMAT_OPTIONS.map(f => (
                <button
                  key={f.id}
                  onClick={() => toggleFormat(f.id)}
                  className={cn(
                    'px-2 py-1 text-[10px] rounded-md font-medium transition-colors',
                    selectedFormats.includes(f.id)
                      ? 'bg-accent text-white'
                      : 'bg-card-hover text-muted-foreground hover:text-foreground'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Angle selector */}
          <Card className="p-4">
            <div className="text-[11px] text-muted uppercase tracking-wider mb-2">Angle</div>
            <select
              value={selectedAngle}
              onChange={(e) => setSelectedAngle(e.target.value)}
              className="w-full h-9 px-3 text-[13px] bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-accent/50"
            >
              <option value="">Auto (best fit)</option>
              {CONTENT_ANGLES.map(a => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
          </Card>
        </div>

        {/* Generate button */}
        <Button onClick={handleGenerate} disabled={loading || selectedFormats.length === 0} className="w-full h-12 text-[14px]">
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating {allVariants ? '3 variants' : selectedPersona} × {selectedFormats.length} format{selectedFormats.length > 1 ? 's' : ''}...</>
          ) : (
            <><Zap className="w-4 h-4 mr-2" /> Generate {allVariants ? 'All 3 Variants' : `${selectedPersona.toUpperCase()}`} — {selectedFormats.length} format{selectedFormats.length > 1 ? 's' : ''}</>
          )}
        </Button>

        {/* Results */}
        {results && (
          <div className="space-y-3">
            <h2 className="text-[11px] text-muted uppercase tracking-widest">Generated Content — {results.length} piece{results.length > 1 ? 's' : ''}</h2>
            {results.map(renderContent)}
          </div>
        )}

        {variantResults && (
          <div className="space-y-5">
            {(['starter', 'pro', 'agency'] as const).map(tier => (
              <div key={tier}>
                <h2 className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{
                  color: tier === 'starter' ? '#22c55e' : tier === 'pro' ? '#6366f1' : '#f59e0b'
                }}>
                  {tier.toUpperCase()} TIER — ${tier === 'starter' ? '197' : tier === 'pro' ? '397' : '997'}
                </h2>
                <div className="space-y-3">
                  {variantResults[tier].map(renderContent)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Daily Schedule */}
        <Card>
          <CardHeader><CardTitle>Daily Content Schedule — 3x per day</CardTitle></CardHeader>
          <CardContent className="p-0">
            {DAILY_SCHEDULE.map((slot, i) => (
              <div key={slot.slot} className={cn('flex items-center justify-between px-4 py-3', i !== DAILY_SCHEDULE.length - 1 && 'border-b border-border')}>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted" />
                  <div>
                    <div className="text-[13px] font-medium text-foreground">{slot.time} — {slot.slot.toUpperCase()}</div>
                    <div className="text-[11px] text-muted-foreground">{slot.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {slot.platforms.map(p => (
                    <Badge key={p} variant={p === 'instagram' ? 'accent' : p === 'linkedin' ? 'info' : 'default'}>{p}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
