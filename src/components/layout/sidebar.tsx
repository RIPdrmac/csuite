'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  GitBranch,
  Megaphone,
  BookOpen,
  CheckSquare,
  Brain,
  DollarSign,
  Globe,
  Snowflake,
  Menu,
  X,
} from 'lucide-react';

const navigation = [
  { name: 'Command Center', href: '/', icon: LayoutDashboard },
  { name: 'Digital Products', href: '/products', icon: Globe },
  { name: 'Snowcone', href: '/snowcone', icon: Snowflake },
  { name: 'Finance', href: '/finance', icon: DollarSign },
  { name: 'Decisions', href: '/decisions', icon: GitBranch },
  { name: 'Master TODO', href: '/todos', icon: CheckSquare },
  { name: 'Agent Intel', href: '/agents', icon: Brain },
  { name: 'Learning Log', href: '/learning', icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <>
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-border justify-between">
        <div className="flex items-center">
          <span className="text-sm font-semibold tracking-widest text-foreground">
            CSUITE
          </span>
          <span className="ml-1.5 text-[10px] font-mono text-muted tracking-wider">
            v0.0
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1 rounded-md text-muted hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navigation.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-accent-subtle text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card-hover'
              )}
            >
              <item.icon
                className={cn(
                  'w-4 h-4 flex-shrink-0',
                  isActive ? 'text-accent' : 'text-muted'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border">
        <div className="text-[11px] text-muted font-mono">
          Adaptive CSUITE
        </div>
        <div className="text-[11px] text-muted-foreground mt-1">
          Speed · Clarity · Revenue
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-12 bg-[#090b0d] border-b border-border flex items-center px-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="ml-3 text-sm font-semibold tracking-widest text-foreground">
          CSUITE
        </span>
        <span className="ml-1.5 text-[10px] font-mono text-muted tracking-wider">
          v0.0
        </span>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={cn(
          'md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-[#090b0d] border-r border-border flex flex-col transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-shrink-0 border-r border-border bg-[#090b0d] flex-col">
        {navContent}
      </aside>
    </>
  );
}
