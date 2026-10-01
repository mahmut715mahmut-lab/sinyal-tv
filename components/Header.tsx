'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Radio, Menu, X, Sliders, Tv, Film, Calendar, Info, Layers } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useBroadcast } from '@/lib/videoStore';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { isOffline, setIsSearchOpen, broadcastState } = useBroadcast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'CANLI', icon: Radio, exact: true },
    { href: '/program', label: 'YAYIN AKIŞI', icon: Calendar },
    { href: '/archive', label: 'ARŞİV', icon: Film },
    { href: '/about', label: 'HAKKINDA', icon: Info },
    { href: '/admin', label: 'YÖNETİM', icon: Layers },
  ];

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0B0D]/95 backdrop-blur-md border-b border-[#232326] transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <Logo size="md" showTagline={false} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href, link.exact);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wider transition-all duration-150 ${
                    active
                      ? 'text-white bg-[#18181B] border border-[#2D2D32]'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#141416]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.label}
                    {link.href === '/' && !isOffline && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-live-pulse" />
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Live Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#141416] border border-[#27272A] text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isOffline ? 'bg-zinc-500' : 'bg-red-500 animate-live-pulse'
              }`}
            />
            <span className="font-mono text-[11px] font-semibold text-zinc-300">
              {isOffline ? 'YAYIN DIŞI' : 'CANLI YAYIN'}
            </span>
            {!isOffline && broadcastState.currentSlotFormattedStart !== '--:--' && (
              <span className="text-[10px] text-zinc-500 font-mono pl-1 border-l border-zinc-800">
                {broadcastState.currentSlotFormattedStart}
              </span>
            )}
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#141416] hover:bg-[#1C1C20] border border-[#27272A] hover:border-zinc-500 text-zinc-300 text-xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            aria-label="Kanal arama motorunu aç"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Ara</span>
            <kbd className="hidden sm:inline px-1 py-0.2 bg-[#202024] text-zinc-400 text-[10px] font-mono rounded border border-zinc-700/60">
              /
            </kbd>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md bg-[#141416] hover:bg-[#1E1E22] border border-[#27272A] text-zinc-300 focus:outline-none"
            aria-label="Menüyü aç/kapat"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#232326] bg-[#0E0E10] px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E1E22]">
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              Kanal Menüsü
            </span>
            <div className="flex items-center gap-1.5 text-xs text-zinc-300">
              <span
                className={`w-2 h-2 rounded-full ${isOffline ? 'bg-zinc-500' : 'bg-red-500 animate-live-pulse'}`}
              />
              <span className="font-mono text-[11px] font-bold">
                {isOffline ? 'YAYIN DIŞI' : 'CANLI 24/7'}
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href, link.exact);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'text-white bg-[#1A1A1E] border border-[#2E2E34]'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#141416]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-zinc-400" />
                    <span>{link.label}</span>
                  </div>
                  {link.href === '/' && !isOffline && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800 font-mono font-bold">
                      CANLI
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
