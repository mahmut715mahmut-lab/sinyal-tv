'use client';

import React from 'react';
import Link from 'next/link';
import { Radio, Clock, ArrowRight, HardDrive, Sparkles, Film, Calendar } from 'lucide-react';
import { Video } from '@/types/broadcast';
import { formatDuration } from '@/lib/broadcast';
import { DownloadButton } from '@/components/DownloadButton';

interface NowPlayingPanelProps {
  currentVideo: Video | null;
  nextVideo: Video | null;
  startedAt: string;
  nextAt: string;
  progressPercent: number;
  remainingSeconds: number;
  isOffline?: boolean;
}

export const NowPlayingPanel: React.FC<NowPlayingPanelProps> = ({
  currentVideo,
  nextVideo,
  startedAt,
  nextAt,
  progressPercent,
  remainingSeconds,
  isOffline = false,
}) => {
  if (isOffline || !currentVideo) {
    return (
      <div className="bg-[#121214] border border-[#27272A] rounded-lg p-5 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono mb-3">
            <span className="w-2 h-2 rounded-full bg-zinc-600" />
            <span>YAYIN AKIŞI // BEKLEMEDE</span>
          </div>
          <h3 className="text-base font-bold text-zinc-300">SİNYAL TV Çevrimdışı</h3>
          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
            Yeni yayın kuşağı hazırlanıyor. Yayın akışını ve daha önce yayınlanmış tüm bölümleri Video Arşivi üzerinden izleyebilirsiniz.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-[#202024]">
          <Link
            href="/archive"
            className="flex items-center justify-between text-xs text-zinc-300 hover:text-white font-medium p-2.5 rounded bg-[#18181B] hover:bg-[#202024] border border-[#27272A] transition-colors"
          >
            <span>Video Arşivini İncele</span>
            <ArrowRight className="w-4 h-4 text-zinc-400" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121214] border border-[#27272A] rounded-lg p-5 flex flex-col justify-between h-full shadow-lg">
      {/* Top Header: Live Badge + Category + Episode */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#202024]">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/80 text-[10px] font-mono font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-live-pulse" />
              ŞU ANDA YAYINDA
            </span>
            <span className="text-[11px] font-mono text-zinc-400 bg-[#1C1C20] px-2 py-0.5 rounded border border-[#2D2D32]">
              {currentVideo.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>Başlangıç: {startedAt}</span>
          </div>
        </div>

        {/* Video Title & Episode */}
        <div className="mt-3.5">
          {currentVideo.episode && (
            <span className="text-xs font-mono font-semibold text-red-400/90 tracking-wide uppercase">
              {currentVideo.episode}
            </span>
          )}
          <h2 className="text-lg sm:text-xl font-bold text-zinc-100 tracking-tight mt-0.5">
            <Link
              href={`/videos/${currentVideo.id}`}
              className="hover:text-red-400 transition-colors"
            >
              {currentVideo.title}
            </Link>
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed line-clamp-3">
            {currentVideo.description}
          </p>
        </div>

        {/* Technical Specs Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-3.5 pt-3 border-t border-[#1C1C20] text-[11px] font-mono text-zinc-400">
          <span className="px-2 py-0.5 rounded bg-[#18181B] border border-[#27272A] text-zinc-300">
            {currentVideo.resolution.split(' ')[0]}
          </span>
          <span className="px-2 py-0.5 rounded bg-[#18181B] border border-[#27272A]">
            {currentVideo.fileSize}
          </span>
          <span className="px-2 py-0.5 rounded bg-[#18181B] border border-[#27272A]">
            {formatDuration(currentVideo.duration)}
          </span>
        </div>

        {/* Broadcast Slot Progress */}
        <div className="mt-4 bg-[#18181B] border border-[#27272A] rounded-md p-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
            <span>Kalan Süre: ~{formatDuration(remainingSeconds)}</span>
            <span>%{Math.round(progressPercent)}</span>
          </div>
          <div className="w-full h-1.5 bg-[#27272A] rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action Buttons: Download & Details */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <DownloadButton
            url={currentVideo.downloadUrl}
            filename={`${currentVideo.id}.mp4`}
            fileSize={currentVideo.fileSize}
            variant="secondary"
            className="flex-1 text-xs py-2"
            label="YAYINI İNDİR"
          />
          <Link
            href={`/videos/${currentVideo.id}`}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md bg-[#18181B] hover:bg-[#202024] border border-[#27272A] hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
          >
            <span>Bölüm Detayı</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
        </div>
      </div>

      {/* Bottom Section: NEXT UP Preview */}
      {nextVideo && (
        <div className="mt-5 pt-3.5 border-t border-[#202024]">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
            <span>SIRADAKİ YAYIN</span>
            <span className="text-zinc-400">Saat {nextAt}</span>
          </div>
          <Link
            href={`/videos/${nextVideo.id}`}
            className="group flex items-center gap-3 p-2 rounded-md bg-[#161619] hover:bg-[#1C1C20] border border-[#27272A] transition-colors"
          >
            <div className="w-14 h-9 rounded bg-black overflow-hidden shrink-0 border border-zinc-800">
              <img
                src={nextVideo.thumbnail}
                alt={nextVideo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-zinc-400">{nextVideo.category}</span>
                {nextVideo.episode && (
                  <span className="text-[10px] text-zinc-500">• {nextVideo.episode}</span>
                )}
              </div>
              <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                {nextVideo.title}
              </h4>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-200 shrink-0 transition-colors" />
          </Link>
        </div>
      )}
    </div>
  );
};
