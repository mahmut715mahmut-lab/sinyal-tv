'use client';

import React from 'react';
import Link from 'next/link';
import { Radio, Calendar, Film, ArrowRight, Play, Clock, Sparkles } from 'lucide-react';
import { useBroadcast } from '@/lib/videoStore';
import { LivePlayer } from '@/components/LivePlayer';
import { NowPlayingPanel } from '@/components/NowPlayingPanel';
import { VideoGrid } from '@/components/VideoGrid';
import { formatDuration } from '@/lib/broadcast';

export default function HomePage() {
  const { broadcastState, isOffline, videos } = useBroadcast();

  // Get upcoming 4 items for today's quick schedule strip
  const upcomingToday = broadcastState.scheduleTimeline
    .filter((slot) => !slot.isLiveNow)
    .slice(0, 4);

  // Featured archive items
  const featuredVideos = videos.filter((v) => v.featured).slice(0, 4);

  return (
    <div className="space-y-10">
      {/* 1. PRIMARY SECTION: 24/7 LIVE BROADCAST THEATER */}
      <section className="space-y-3" aria-label="Canlı Yayın Kuşağı">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider text-red-500 uppercase">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-live-pulse" />
              CANLI YAYIN PLATFORMU
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs font-mono text-zinc-400">
              SİNYAL TV 24/7 KESİNTİSİZ AKIŞ
            </span>
          </div>

          <Link
            href="/program"
            className="text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors inline-flex items-center gap-1"
          >
            <span>Tüm Yayın Akışı</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* 16:9 Video Player (Left) + Now Playing Panel (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Main 16:9 Broadcast Player (8 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col">
            <LivePlayer
              currentVideo={broadcastState.currentVideo}
              elapsedSeconds={broadcastState.elapsedSeconds}
              isLiveMode={true}
              className="shadow-2xl"
            />
          </div>

          {/* Now Playing Information Panel (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col">
            <NowPlayingPanel
              currentVideo={broadcastState.currentVideo}
              nextVideo={broadcastState.nextVideo}
              startedAt={broadcastState.currentSlotFormattedStart}
              nextAt={broadcastState.nextSlotFormattedStart}
              progressPercent={broadcastState.progressPercent}
              remainingSeconds={broadcastState.remainingSeconds}
              isOffline={isOffline}
            />
          </div>
        </div>
      </section>

      {/* 2. PROGRAM GUIDE / UPCOMING BROADCASTS COMPACT STRIP */}
      <section className="space-y-4 pt-4 border-t border-[#1C1C20]" aria-label="Sıradaki Yayınlar">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span>Günün Devam Eden Programı</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Bugün yayınlanacak sıradaki bölümler ve özel gösterimler
            </p>
          </div>

          <Link
            href="/program"
            className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded bg-[#141416] hover:bg-[#1E1E22] border border-[#27272A] transition-colors inline-flex items-center gap-1.5"
          >
            <span>Detaylı TV Rehberi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Horizontal Mini Timeline Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {upcomingToday.map((slot) => (
            <Link
              key={slot.id}
              href={`/videos/${slot.video.id}`}
              className="group p-3 rounded-lg bg-[#121214] hover:bg-[#18181B] border border-[#232326] hover:border-[#35353C] transition-all flex items-center gap-3"
            >
              <div className="relative w-16 h-11 bg-black rounded overflow-hidden shrink-0 border border-zinc-800">
                <img
                  src={slot.video.thumbnail}
                  alt={slot.video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                  <span className="text-red-400 font-bold">{slot.startTime}</span>
                  <span>•</span>
                  <span>{formatDuration(slot.video.duration)}</span>
                </div>
                <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate mt-0.5">
                  {slot.video.title}
                </h4>
                <span className="text-[10px] text-zinc-500 font-mono block truncate">
                  {slot.video.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. CURATED VIDEO ARCHIVE HIGHLIGHTS */}
      <section className="space-y-4 pt-4 border-t border-[#1C1C20]" aria-label="Arşivden Seçkiler">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Film className="w-4 h-4 text-zinc-400" />
              <span>Kanal Arşivinden Seçkiler</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Daha önce yayınlanan tüm belgesel, dizi ve gece kuşağı kayıtları
            </p>
          </div>

          <Link
            href="/archive"
            className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded bg-[#141416] hover:bg-[#1E1E22] border border-[#27272A] transition-colors inline-flex items-center gap-1.5"
          >
            <span>Tüm Arşiv ({videos.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Video Grid */}
        <VideoGrid videos={videos} showFilters={true} />
      </section>

      {/* 4. BROADCAST INFRASTRUCTURE / SIGNAL SPECIFICATION BAR */}
      <section className="bg-[#101012] border border-[#202024] rounded-lg p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-live-pulse" />
          <div>
            <span className="font-bold text-zinc-200 uppercase">SİNYAL YAYIN HATTI</span>
            <span className="text-zinc-500 ml-2">24/7 Kesintisiz Otomasyon &bull; H.264 / AAC 1080p-4K</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-400">
          <span>ARŞİV: {videos.length} VİDEO</span>
          <span>FORMAT: MP4 / HEVC</span>
          <Link
            href="/about"
            className="text-zinc-300 hover:text-white underline underline-offset-4 transition-colors"
          >
            Yayın Manifestosu &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
