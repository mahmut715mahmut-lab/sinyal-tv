'use client';

import React from 'react';
import Link from 'next/link';
import { Film, Search, HardDrive, Filter } from 'lucide-react';
import { useBroadcast } from '@/lib/videoStore';
import { VideoGrid } from '@/components/VideoGrid';

export default function ArchivePage() {
  const { videos, setIsSearchOpen } = useBroadcast();

  return (
    <div className="space-y-6">
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
            SİNYAL TV ekranlarında yayınlanan tüm bağımsız hareketli görüntüler, belgesel serileri ve gece kuşakları. Tüm yayınları izleyebilir ve doğrudan indirebilirsiniz.
          </p>
        </div>

        {/* Search button trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#141416] hover:bg-[#1E1E22] border border-[#27272A] hover:border-zinc-500 text-zinc-300 text-xs transition-colors self-start md:self-auto cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span>Arşivde Arama Yap</span>
          <kbd className="px-1.5 py-0.5 bg-[#202024] text-zinc-400 text-[10px] font-mono rounded border border-zinc-700/60">
            /
          </kbd>
        </button>
      </div>

      {/* Video Grid */}
      <VideoGrid
        videos={videos}
        showFilters={true}
      />
    </div>
  );
}
