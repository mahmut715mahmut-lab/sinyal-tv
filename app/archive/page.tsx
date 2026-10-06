'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Film, Search, HardDrive, Filter, Layers, LayoutGrid, Play, ArrowRight, Sparkles } from 'lucide-react';
import { useBroadcast } from '@/lib/videoStore';
import { VideoGrid } from '@/components/VideoGrid';
import { VideoCard } from '@/components/VideoCard';
import { getSeriesCatalog, formatDuration } from '@/lib/broadcast';

export default function ArchivePage() {
  const { videos, setIsSearchOpen } = useBroadcast();
  const [viewMode, setViewMode] = useState<'series' | 'grid'>('series');

  const seriesCatalog = getSeriesCatalog(videos);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#202024]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase mb-1">
            <Link href="/" className="hover:text-zinc-200 transition-colors">
              SİNYAL TV
            </Link>
            <span>/</span>
            <span className="text-zinc-300">VİDEO ARŞİVİ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Kanal Video Arşivi
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            SİNYAL TV ekranlarında yayınlanan tüm seriler, bölümler ve bağımsız yapımlar. Bölümleri sırayla izleyebilir ve doğrudan indirebilirsiniz.
          </p>
        </div>

        {/* View Switcher & Search Button */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Mode Switcher */}
          <div className="flex items-center bg-[#141416] p-1 rounded-lg border border-[#27272A]">
            <button
              onClick={() => setViewMode('series')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                viewMode === 'series'
                  ? 'bg-zinc-100 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Serilere Göre (Bölüm Sıralı)</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-zinc-100 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tüm Liste</span>
            </button>
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#141416] hover:bg-[#1E1E22] border border-[#27272A] hover:border-zinc-500 text-zinc-300 text-xs transition-colors cursor-pointer font-mono"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Arama Yap</span>
            <kbd className="px-1.5 py-0.5 bg-[#202024] text-zinc-400 text-[10px] rounded border border-zinc-700/60">
              /
            </kbd>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: SERIES / FRANCHISE COLLECTIONS (Consecutive 1, 2, 3...) */}
      {viewMode === 'series' ? (
        <div className="space-y-12">
          {seriesCatalog.map((series) => (
            <section
              key={series.id}
              className="space-y-4 p-5 sm:p-6 rounded-xl bg-[#101012] border border-[#222226]"
            >
              {/* Series Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E1E22]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C1C20] border border-[#2D2D32] text-zinc-300 uppercase font-semibold">
                      {series.category}
                    </span>
                    {series.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/70 border border-red-800/80 text-red-400 font-bold">
                        {series.badge}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {series.name}
                  </h2>
                  <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                    {series.description}
                  </p>
                </div>

                {/* Quick Watch From Episode 1 */}
                {series.episodes[0] && (
                  <Link
                    href={`/videos/${series.episodes[0].id}`}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition-colors shrink-0 self-start sm:self-auto shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>1. Bölümden Başlat</span>
                  </Link>
                )}
              </div>

              {/* Consecutive Episodes Grid (Strictly 1, 2, 3...) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {series.episodes.map((ep) => (
                  <VideoCard key={ep.id} video={ep} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* VIEW MODE 2: UNIFIED FILTERABLE GRID */
        <VideoGrid videos={videos} showFilters={true} />
      )}
    </div>
  );
}
