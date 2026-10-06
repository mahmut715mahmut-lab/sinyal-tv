'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Play,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useBroadcast } from '@/lib/videoStore';
import { LivePlayer } from '@/components/LivePlayer';
import { DownloadButton } from '@/components/DownloadButton';
import { VideoCard } from '@/components/VideoCard';
import { formatDuration, getSeriesForVideo } from '@/lib/broadcast';

interface VideoDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function VideoDetailPage({ params }: VideoDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { videos } = useBroadcast();

  const [autoNextCountdown, setAutoNextCountdown] = useState<number | null>(null);

  const video = videos.find((v) => v.id === id);

  // Series details & sequential previous/next episode detection
  const seriesInfo = video ? getSeriesForVideo(video, videos) : null;
  const nextEpisode = seriesInfo?.nextEpisode || null;
  const previousEpisode = seriesInfo?.previousEpisode || null;
  const seriesEpisodes = seriesInfo?.seriesEpisodes || [];
  const currentSeries = seriesInfo?.series || null;

  // Handle countdown timer for auto-transition to next episode
  useEffect(() => {
    if (autoNextCountdown === null) return;

    if (autoNextCountdown <= 0) {
      if (nextEpisode) {
        router.push(`/videos/${nextEpisode.id}`);
      }
      setAutoNextCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setAutoNextCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoNextCountdown, nextEpisode, router]);

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

  // Related videos from OTHER categories/series
  const relatedVideos = videos
    .filter((v) => v.id !== video.id && !seriesEpisodes.some((se) => se.id === v.id))
    .slice(0, 3);

  const handleVideoEnded = () => {
    if (nextEpisode) {
      // Start 5-second auto countdown to next episode (e.g. Bölüm 2 -> Bölüm 3)
      setAutoNextCountdown(5);
    }
  };

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      {/* Breadcrumb Navigation & Series Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-zinc-200 transition-colors">
            SİNYAL TV
          </Link>
          <span>/</span>
          <Link href="/archive" className="hover:text-zinc-200 transition-colors">
            ARŞİV
          </Link>
          {currentSeries && (
            <>
              <span>/</span>
              <span className="text-red-400 font-bold uppercase">{currentSeries.name}</span>
            </>
          )}
          <span>/</span>
          <span className="text-zinc-300 truncate max-w-[200px] sm:max-w-xs font-bold">
            {video.title}
          </span>
        </div>

        {/* Quick Episode Navigation Strip */}
        <div className="flex items-center gap-2">
          {previousEpisode && (
            <Link
              href={`/videos/${previousEpisode.id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#161619] hover:bg-[#202024] border border-[#27272A] text-[11px] text-zinc-300 transition-colors"
              title={`Önceki Bölüm: ${previousEpisode.title}`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Önceki Bölüm</span>
            </Link>
          )}
          {nextEpisode && (
            <Link
              href={`/videos/${nextEpisode.id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-950/60 hover:bg-red-900/60 border border-red-700/60 text-[11px] text-red-300 font-semibold transition-colors"
              title={`Sıradaki Bölüm: ${nextEpisode.title}`}
            >
              <span>Sıradaki Bölüm</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
          <Link
            href="/archive"
            className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors ml-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tüm Arşiv</span>
          </Link>
        </div>
      </div>

      {/* 1. TOP DEDICATED VIDEO PLAYER */}
      <div className="relative w-full bg-black rounded-lg overflow-hidden border border-[#232326] shadow-2xl">
        <LivePlayer
          currentVideo={video}
          isLiveMode={false}
          onEnded={handleVideoEnded}
          className="w-full"
        />

        {/* Next Episode Countdown Toast / Autoplay Prompt */}
        {autoNextCountdown !== null && nextEpisode && (
          <div className="absolute bottom-16 sm:bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-zinc-950/95 border border-red-600/80 rounded-lg p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  Sıradaki Bölüm Başlıyor ({autoNextCountdown} sn)
                </span>
                <h4 className="text-sm font-bold text-white line-clamp-1">{nextEpisode.title}</h4>
                <p className="text-xs text-zinc-400 line-clamp-1">{nextEpisode.episode} • {formatDuration(nextEpisode.duration)}</p>
              </div>

              <button
                onClick={() => setAutoNextCountdown(null)}
                className="text-zinc-500 hover:text-zinc-300 p-1 rounded hover:bg-zinc-800"
                title="İptal Et"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => {
                  setAutoNextCountdown(null);
                  router.push(`/videos/${nextEpisode.id}`);
                }}
                className="flex-1 py-1.5 px-3 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded transition-colors text-center cursor-pointer font-mono"
              >
                Hemen Oynat &rarr;
              </button>
              <button
                onClick={() => setAutoNextCountdown(null)}
                className="py-1.5 px-3 bg-[#1C1C20] hover:bg-[#25252A] text-zinc-300 text-xs font-medium rounded border border-[#2E2E34] transition-colors cursor-pointer font-mono"
              >
                İptal Et
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sequential Next Episode Quick Callout (if available) */}
      {nextEpisode && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-gradient-to-r from-red-950/40 via-[#18181C] to-[#141416] border border-red-900/40">
          <div className="flex items-center gap-3">
            <div className="w-16 h-10 rounded bg-black overflow-hidden shrink-0 border border-red-800/50">
              <img
                src={nextEpisode.thumbnail}
                alt={nextEpisode.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400">
                Sıradaki Bölüm: {nextEpisode.episode || 'Devam'}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                {nextEpisode.title}
              </h4>
            </div>
          </div>

          <Link
            href={`/videos/${nextEpisode.id}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition-all shadow-md shrink-0"
          >
            <span>Sonraki Bölüme Geç</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

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
                <span className="px-2.5 py-0.5 rounded bg-red-950/70 border border-red-800/80 text-red-400 text-xs font-mono font-semibold">
                  {video.episode}
                </span>
              )}
              {currentSeries && (
                <span className="px-2.5 py-0.5 rounded bg-[#1C1C20] border border-[#2D2D32] text-zinc-400 text-xs font-mono">
                  {currentSeries.name}
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

          {/* Action Buttons: Primary Download & Share */}
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
                  alert('Yayın bağlantısı panoya kopyalandı.');
                }
              }}
              className="px-4 py-3 rounded-md bg-[#18181B] hover:bg-[#202024] border border-[#27272A] text-zinc-300 hover:text-white text-xs font-mono font-medium transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-zinc-400" />
              <span>PAYLAŞ</span>
            </button>
          </div>

          {/* Description Block */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Info className="w-4 h-4 text-red-500" />
              <span>Yayın Açıklaması</span>
            </h3>
            <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-line">
              {video.longDescription || video.description}
            </p>
          </div>

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-mono text-zinc-500 uppercase mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>Etiketler</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {video.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded bg-[#161619] text-zinc-400 text-xs font-mono border border-[#242428]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 3. DEDICATED COMPLETE SERIES PLAYLIST BAR (1, 2, 3, 4, 5...) */}
          {seriesEpisodes.length > 1 && (
            <div className="pt-6 border-t border-[#202024] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-red-500" />
                    <span>{currentSeries ? currentSeries.name : 'Seri'} Bölümleri</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Bu serideki tüm bölümler sıra ile listelenmiştir ({seriesEpisodes.length} Bölüm)
                  </p>
                </div>
              </div>

              {/* Sequential Episode Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {seriesEpisodes.map((ep, idx) => {
                  const isCurrent = ep.id === video.id;
                  const isNext = nextEpisode && ep.id === nextEpisode.id;

                  return (
                    <Link
                      key={ep.id}
                      href={`/videos/${ep.id}`}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                        isCurrent
                          ? 'bg-red-950/30 border-red-600/80 shadow-md ring-1 ring-red-600/50'
                          : isNext
                          ? 'bg-[#18181C] hover:bg-[#202026] border-zinc-700 hover:border-zinc-500'
                          : 'bg-[#121214] hover:bg-[#18181B] border-[#222226] hover:border-zinc-700'
                      }`}
                    >
                      <div className="relative w-16 h-10 rounded bg-black overflow-hidden shrink-0 border border-zinc-800">
                        <img
                          src={ep.thumbnail}
                          alt={ep.title}
                          className="w-full h-full object-cover"
                        />
                        {isCurrent && (
                          <div className="absolute inset-0 bg-red-950/60 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-live-pulse" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono">
                          <span className={isCurrent ? 'text-red-400 font-bold' : 'text-zinc-400'}>
                            {ep.episode || `Bölüm ${idx + 1}`}
                          </span>
                          {isCurrent && (
                            <span className="text-red-400 font-semibold">• İZLENİYOR</span>
                          )}
                          {isNext && (
                            <span className="text-amber-400 font-semibold">• SIRADAKİ</span>
                          )}
                        </div>
                        <h5
                          className={`text-xs font-semibold truncate ${
                            isCurrent ? 'text-white' : 'text-zinc-300'
                          }`}
                        >
                          {ep.title}
                        </h5>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {formatDuration(ep.duration)}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Tech Specs (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Technical Specifications Panel */}
          <div className="p-5 rounded-lg bg-[#121214] border border-[#232326] space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-500" />
              <span>Teknik Dosya Bilgileri</span>
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
              className="text-xs text-red-400 hover:text-red-300 font-semibold block pt-1 font-mono"
            >
              Yayın Saatlerini Gör &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 4. MORE FROM OTHER SERIES */}
      {relatedVideos.length > 0 && (
        <section className="pt-8 border-t border-[#202024] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Diğer Kuşaklar ve Seriler
            </h3>
            <Link
              href="/archive"
              className="text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Tüm Arşivi Gör ({videos.length}) &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedVideos.map((relVideo) => (
              <VideoCard key={relVideo.id} video={relVideo} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
