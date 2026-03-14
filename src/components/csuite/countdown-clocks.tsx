'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Settings2, Check, X } from 'lucide-react';

const STORAGE_KEY_LAUNCH = 'csuite-launch-date';
const STORAGE_KEY_TARGET = 'csuite-target-date';
const DEFAULT_LAUNCH = '2026-03-15T00:00:00';
const DEFAULT_TARGET = '2026-04-15T23:59:59';

function getStored(key: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return localStorage.getItem(key) || fallback;
}

function getTimeRemaining(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    total: diff,
  };
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-mono font-bold text-foreground tabular-nums">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-[9px] text-muted uppercase tracking-widest mt-0.5">{label}</div>
    </div>
  );
}

function Sep() {
  return <span className="text-xl text-muted/40 font-mono self-start mt-1">:</span>;
}

function formatDateForDisplay(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function formatDateForInput(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
}

export function CountdownClocks() {
  const [launchDate, setLaunchDate] = useState(DEFAULT_LAUNCH);
  const [targetDate, setTargetDate] = useState(DEFAULT_TARGET);
  const [launch, setLaunch] = useState(getTimeRemaining(new Date(DEFAULT_LAUNCH)));
  const [target, setTarget] = useState(getTimeRemaining(new Date(DEFAULT_TARGET)));
  const [editingLaunch, setEditingLaunch] = useState(false);
  const [editingTarget, setEditingTarget] = useState(false);
  const [tempLaunch, setTempLaunch] = useState('');
  const [tempTarget, setTempTarget] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const storedLaunch = getStored(STORAGE_KEY_LAUNCH, DEFAULT_LAUNCH);
    const storedTarget = getStored(STORAGE_KEY_TARGET, DEFAULT_TARGET);
    setLaunchDate(storedLaunch);
    setTargetDate(storedTarget);
  }, []);

  // Tick every second
  useEffect(() => {
    const interval = setInterval(() => {
      setLaunch(getTimeRemaining(new Date(launchDate)));
      setTarget(getTimeRemaining(new Date(targetDate)));
    }, 1000);
    return () => clearInterval(interval);
  }, [launchDate, targetDate]);

  const saveLaunch = () => {
    if (tempLaunch) {
      const newDate = new Date(tempLaunch).toISOString();
      setLaunchDate(newDate);
      localStorage.setItem(STORAGE_KEY_LAUNCH, newDate);
    }
    setEditingLaunch(false);
  };

  const saveTarget = () => {
    if (tempTarget) {
      const newDate = new Date(tempTarget).toISOString();
      setTargetDate(newDate);
      localStorage.setItem(STORAGE_KEY_TARGET, newDate);
    }
    setEditingTarget(false);
  };

  const launched = launch.total <= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Launch countdown */}
      <Card className={cn(
        'px-4 py-3',
        launched ? 'border-success/30 bg-success/5' : 'border-accent/30 bg-accent-subtle'
      )}>
        {editingLaunch ? (
          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-widest font-semibold text-accent">Set Launch Date</div>
            <input
              type="datetime-local"
              value={tempLaunch || formatDateForInput(launchDate)}
              onChange={(e) => setTempLaunch(e.target.value)}
              className="w-full h-8 px-2 text-[13px] bg-card border border-border rounded-md text-foreground focus:outline-none focus:border-accent/50"
            />
            <div className="flex gap-2">
              <button onClick={saveLaunch} className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-md bg-accent text-white hover:bg-accent-muted">
                <Check className="w-3 h-3" /> Save
              </button>
              <button onClick={() => setEditingLaunch(false)} className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-md border border-border text-muted-foreground hover:text-foreground">
                <X className="w-3 h-3" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div className={cn('text-[10px] uppercase tracking-widest font-semibold', launched ? 'text-success' : 'text-accent')}>
                {launched ? 'LAUNCHED' : 'LAUNCH IN'}
              </div>
              <button
                onClick={() => { setTempLaunch(formatDateForInput(launchDate)); setEditingLaunch(true); }}
                className="text-[11px] text-muted hover:text-foreground transition-colors flex items-center gap-1 mt-0.5"
              >
                {formatDateForDisplay(launchDate)}
                <Settings2 className="w-2.5 h-2.5" />
              </button>
            </div>
            {launched ? (
              <div className="text-lg font-semibold text-success">LIVE</div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Digit value={launch.days} label="days" />
                <Sep />
                <Digit value={launch.hours} label="hrs" />
                <Sep />
                <Digit value={launch.minutes} label="min" />
                <Sep />
                <Digit value={launch.seconds} label="sec" />
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Target deadline */}
      <Card className="px-4 py-3 border-danger/20 bg-danger/5">
        {editingTarget ? (
          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-widest font-semibold text-danger">Set Target Deadline</div>
            <input
              type="datetime-local"
              value={tempTarget || formatDateForInput(targetDate)}
              onChange={(e) => setTempTarget(e.target.value)}
              className="w-full h-8 px-2 text-[13px] bg-card border border-border rounded-md text-foreground focus:outline-none focus:border-danger/50"
            />
            <div className="flex gap-2">
              <button onClick={saveTarget} className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-md bg-danger text-white hover:bg-danger/80">
                <Check className="w-3 h-3" /> Save
              </button>
              <button onClick={() => setEditingTarget(false)} className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-md border border-border text-muted-foreground hover:text-foreground">
                <X className="w-3 h-3" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest font-semibold text-danger">$10K DEADLINE</div>
              <button
                onClick={() => { setTempTarget(formatDateForInput(targetDate)); setEditingTarget(true); }}
                className="text-[11px] text-muted hover:text-foreground transition-colors flex items-center gap-1 mt-0.5"
              >
                {formatDateForDisplay(targetDate)}
                <Settings2 className="w-2.5 h-2.5" />
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <Digit value={target.days} label="days" />
              <Sep />
              <Digit value={target.hours} label="hrs" />
              <Sep />
              <Digit value={target.minutes} label="min" />
              <Sep />
              <Digit value={target.seconds} label="sec" />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
