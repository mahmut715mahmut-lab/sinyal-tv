'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Calendar,
  Clock,
  HardDrive,
  Tv,
  Film,
  ArrowLeft,
  Share2,
  Tag,
  Info,
  Layers,
} from 'lucide-react';
import { useBroadcast } from '@/lib/videoStore';
import { LivePlayer } from '@/components/LivePlayer';
import { DownloadButton } from '@/components/DownloadButton';
import { VideoCard } from '@/components/VideoCard';
import { formatDuration } from '@/lib/broadcast';

interface VideoDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function VideoDetailPage({ params }: VideoDetailPageProps) {
  const { id } = use(params);
  const { videos } = useBroadcast();

  const video = videos.find((v) => v.id === id);

  if (!video) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <Film className="w-12 h-12 mx-auto text-zinc-600" />
        <h2 className="text-xl font-bold text-white">Yayın Bulunamadı</h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          Aradığınız video arşivde mevcut değil veya yayından kaldırılmış olabilir.
        </p>
        <Link
          href="/archive"
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-950 text-xs font-semibold rounded-md hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Arşive Geri Dön</span>
        </Link>
      </div>
    );
  }

  // Related videos: same category or other videos excluding current
  const relatedVideos = videos
    .filter((v) => v.id !== video.id)
    .sort((a, b) => (a.category === video.category ? -1 : 1))
    .slice(0, 3);

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-zinc-200 transition-colors">
            SİNYAL TV
          </Link>
          <span>/</span>
          <Link href="/archive" className="hover:text-zinc-200 transition-colors">
            ARŞİV
          </Link>
          <span>/</span>
          <span className="text-zinc-300 truncate max-w-[200px] sm:max-w-xs">
            {video.title}
          </span>
        </div>

        <Link
          href="/archive"
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tüm Arşiv</span>
        </Link>
      </div>

      {/* 1. TOP DEDICATED VIDEO PLAYER */}
      <div className="w-full bg-black rounded-lg overflow-hidden border border-[#232326] shadow-2xl">
        <LivePlayer
          currentVideo={video}
          isLiveMode={false}
          className="w-full"
        />
      </div>

      {/* 2. TITLE & METADATA SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Metadata */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded bg-[#18181B] border border-[#27272A] text-zinc-300 text-xs font-mono uppercase font-bold">
                {video.category}
              </span>
              {video.episode && (
                <span className="px-2.5 py-0.5 rounded bg-[#18181B] border border-[#27272A] text-red-400 text-xs font-mono font-semibold">
                  {video.episode}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs font-mono text-zinc-400 ml-auto">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>Yayın Tarihi: {video.releaseDate}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {video.title}
            </h1>
            {video.originalTitle && (
              <p className="text-sm font-mono text-zinc-500 mt-1 italic">
                Orijinal Kayıt: {video.originalTitle}
              </p>
            )}
          </div>

          {/* Action Buttons: Primary Download & Watch */}
          <div className="flex flex-wrap items-center gap-3 p-4 bg-[#121214] border border-[#232326] rounded-lg">
            <DownloadButton
              url={video.downloadUrl}
              filename={`${video.id}.mp4`}
              fileSize={video.fileSize}
              variant="primary"
              label="VİDEOYU İNDİR (.MP4)"
            />

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: video.title,
                    text: video.description,
                    url: window.location.href,
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Yayın bağlantısı kopyalandı.');
                }
              }}
              className="px-4 py-3 rounded-md bg-[#18181B] hover:bg-[#202024] border border-[#27272A] text-zinc-300 hover:text-white text-xs font-mono font-medium transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-zinc-400" />
              <span>Bağlantıyı Paylaş</span>
            </button>
          </div>

          {/* Description & Synopsis */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 font-mono">
              Yayın Özeti & Konu
            </h3>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {video.longDescription || video.description}
            </p>
          </div>

          {/* Director & Production Notes */}
          {video.directorNotes && (
            <div className="p-4 rounded-lg bg-[#141416] border border-[#232326] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-400">
                <Info className="w-3.5 h-3.5 text-zinc-500" />
                <span>KÜRATÖR & ÜRETİM NOTU</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                {video.directorNotes}
              </p>
            </div>
          )}

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-mono text-zinc-500">Etiketler:</span>
              {video.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded bg-[#161619] border border-[#232326] text-zinc-400 font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Technical Specifications Sidebar (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-[#121214] border border-[#232326] rounded-lg p-5 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold pb-2 border-b border-[#202024]">
              Teknik Yayın Özellikleri
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between py-1 border-b border-[#1A1A1D]">
                <span className="text-zinc-500">DOSYA FORMATI</span>
                <span className="text-zinc-200 font-semibold">{video.format.split(' ')[0]}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#1A1A1D]">
                <span className="text-zinc-500">ÇÖZÜNÜRLÜK</span>
                <span className="text-zinc-200 font-semibold">{video.resolution}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#1A1A1D]">
                <span className="text-zinc-500">DOSYA BOYUTU</span>
                <span className="text-zinc-200 font-semibold">{video.fileSize}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#1A1A1D]">
                <span className="text-zinc-500">SÜRE</span>
                <span className="text-zinc-200 font-semibold">{formatDuration(video.duration)}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#1A1A1D]">
                <span className="text-zinc-500">EN-BOY ORANI</span>
                <span className="text-zinc-200 font-semibold">{video.aspectRatio}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#1A1A1D]">
                <span className="text-zinc-500">SES FORMATI</span>
                <span className="text-zinc-200 font-semibold truncate max-w-[160px] text-right">
                  {video.audioLanguage}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-zinc-500">YAYIN SIRASI</span>
                <span className="text-zinc-200 font-semibold">#{video.broadcastOrder}</span>
              </div>
            </div>
          </div>

          {/* Quick Broadcast Notice */}
          <div className="p-4 rounded-lg bg-[#141416] border border-[#232326] text-xs text-zinc-400 space-y-2">
            <div className="flex items-center gap-2 text-zinc-200 font-semibold font-mono">
              <Tv className="w-4 h-4 text-red-500" />
              <span>24/7 YAYIN AKIŞINDA</span>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-500">
              Bu video SİNYAL TV program çizelgesi dahilinde gün boyunca otomatik olarak yayınlanmaktadır.
            </p>
            <Link
              href="/program"
              className="text-xs text-red-400 hover:text-red-300 font-semibold block pt-1"
            >
              Yayın Saatlerini Gör &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 3. MORE FROM THIS CHANNEL / RELATED VIDEOS */}
      <section className="pt-8 border-t border-[#202024] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Bu Kanaldaki Benzer Yayınlar
          </h3>
          <Link
            href="/archive"
            className="text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Tümünü Gör ({videos.length}) &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedVideos.map((relVideo) => (
            <VideoCard key={relVideo.id} video={relVideo} />
          ))}
        </div>
      </section>
    </div>
  );
}
