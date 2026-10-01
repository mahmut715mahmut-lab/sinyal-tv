'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Layers,
  Plus,
  Trash2,
  Tv,
  Radio,
  RotateCcw,
  Check,
  HardDrive,
  Film,
  Eye,
  Sliders,
  Download,
  AlertCircle,
  Lock,
  Unlock,
  KeyRound,
  LogOut,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  Play,
  Flame,
  Users,
  TrendingUp,
  Activity,
  Megaphone,
  Upload,
  FileVideo,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useBroadcast } from '@/lib/videoStore';
import { Video, VideoCategory } from '@/types/broadcast';
import { formatDuration } from '@/lib/broadcast';
import { Logo } from '@/components/Logo';

const ADMIN_PASSWORD = 'ruhi123';
const AUTH_KEY = 'sinyal_admin_session_auth';

export default function AdminPage() {
  const {
    videos,
    addVideo,
    deleteVideo,
    moveVideoUp,
    moveVideoDown,
    forceLiveNow,
    clearForcedLive,
    forcedLiveVideoId,
    isOffline,
    setIsOffline,
    watermarkEnabled,
    setWatermarkEnabled,
    tickerMessage,
    setTickerMessage,
    analytics,
    resetToDefaults,
    broadcastState,
  } = useBroadcast();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // UI Tabs & Panels
  const [activeTab, setActiveTab] = useState<'stream-control' | 'analytics' | 'add-video' | 'ticker'>('stream-control');
  const [formOpen, setFormOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New Video Form State
  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [durationSec, setDurationSec] = useState<number>(60);
  const [category, setCategory] = useState<Exclude<VideoCategory, 'TÜMÜ'>>('DİZİ');
  const [episode, setEpisode] = useState('Özel Bölüm');
  const [fileSize, setFileSize] = useState('120 MB');
  const [resolution, setResolution] = useState('1920 × 1080 (FHD)');
  const [format, setFormat] = useState('MP4 (H.264 / AAC)');
  const [directorNotes, setDirectorNotes] = useState('');
  const [tags, setTags] = useState('sinyal, özel, mp4');
  const [playImmediatelyOnAdd, setPlayImmediatelyOnAdd] = useState(false);

  // Custom ticker text input
  const [tickerInput, setTickerInput] = useState(tickerMessage || '');

  // File input ref for direct MP4 selection
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check saved session on mount
  useEffect(() => {
    try {
      const savedAuth = sessionStorage.getItem(AUTH_KEY);
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {}
    setIsCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (tickerMessage) {
      setTickerInput(tickerMessage);
    }
  }, [tickerMessage]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(null);
      try {
        sessionStorage.setItem(AUTH_KEY, 'true');
      } catch (e) {}
    } else {
      setAuthError('Hatalı şifre. Lütfen tekrar deneyin.');
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch (e) {}
  };

  // Handle direct file upload / selection from local machine
  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const cleanTitle = fileName.replace(/\.[^/.]+$/, '');
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);

    // Create a local object URL for instant preview/playback
    const localBlobUrl = URL.createObjectURL(file);

    setTitle(cleanTitle.toUpperCase());
    setOriginalTitle(fileName);
    setFileSize(`${sizeInMb} MB`);
    setVideoUrl(localBlobUrl);
    setDownloadUrl(localBlobUrl);
    setDescription(`Yerel bilgisayardan yüklenen özel yayın videosu: ${fileName}`);

    // Try to get video duration from the loaded file object
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = localBlobUrl;
    tempVideo.onloadedmetadata = () => {
      if (tempVideo.duration && !isNaN(tempVideo.duration)) {
        setDurationSec(Math.round(tempVideo.duration));
      }
      if (tempVideo.videoWidth && tempVideo.videoHeight) {
        setResolution(`${tempVideo.videoWidth} × ${tempVideo.videoHeight}`);
      }
    };

    setSuccessMessage(`"${fileName}" (${sizeInMb} MB) dosyası seçildi. Form otomatik dolduruldu.`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !videoUrl.trim()) {
      alert('Lütfen en azından Başlık ve Video URL alanlarını doldurun.');
      return;
    }

    const created = addVideo({
      title: title.trim(),
      originalTitle: originalTitle.trim() || undefined,
      description: description.trim() || 'SİNYAL TV özel yayın kaydı.',
      longDescription: longDescription.trim() || undefined,
      thumbnail:
        thumbnail.trim() ||
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1280&q=80',
      videoUrl: videoUrl.trim(),
      downloadUrl: downloadUrl.trim() || videoUrl.trim(),
      duration: Number(durationSec) || 60,
      category,
      episode: episode.trim() || undefined,
      releaseDate: new Date().toISOString().split('T')[0],
      fileSize: fileSize.trim() || '150 MB',
      resolution: resolution.trim() || '1920 × 1080',
      format: format.trim() || 'MP4 (H.264 / AAC)',
      audioLanguage: 'Türkçe (Stereo)',
      aspectRatio: '16:9',
      directorNotes: directorNotes.trim() || undefined,
      tags: tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    });

    if (playImmediatelyOnAdd) {
      forceLiveNow(created.id);
      setSuccessMessage(`"${created.title}" eklendi ve ANINDA CANLI YAYINA ALINDI!`);
    } else {
      setSuccessMessage(`"${created.title}" yayını başarıyla yayın akışına eklendi.`);
    }

    setTimeout(() => setSuccessMessage(null), 5000);

    // Reset form
    setTitle('');
    setDescription('');
    setVideoUrl('');
    setDownloadUrl('');
    setOriginalTitle('');
    setFormOpen(false);
  };

  const handleUpdateTicker = (e: React.FormEvent) => {
    e.preventDefault();
    setTickerMessage(tickerInput.trim() || null);
    setSuccessMessage('Kanal alt kayan yazı duyurusu canlı yayında güncellendi.');
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(videos, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sinyal-tv-arsiv-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Loading gate
  if (isCheckingAuth) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 mx-auto border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 1. PASSWORD GATE SCREEN
  if (!isAuthenticated) {
    return (
      <div className="py-12 sm:py-20 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#121214] border border-[#27272A] rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-red-600" />

          <div className="flex flex-col items-center text-center space-y-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-[#18181B] border border-[#2E2E34] flex items-center justify-center text-zinc-300 shadow-inner">
              <KeyRound className="w-6 h-6 stroke-[1.8] text-red-500" />
            </div>

            <Logo size="sm" showTagline={false} />

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Yayın Masası Yetkili Girişi
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                24/7 yayın akışını, canlı izleyici istatistiklerini ve video yöneticisini açmak için şifrenizi girin.
              </p>
            </div>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-zinc-400 uppercase">
                Yönetici Şifresi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="Şifreyi giriniz..."
                  className="w-full bg-[#18181B] border border-[#2D2D32] focus:border-red-500 rounded-md py-2.5 pl-3 pr-10 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300 p-1"
                >
                  {showPassword ? 'Gizle' : 'Göster'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-md bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Panele Giriş Yap</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#1E1E22] text-center">
            <Link
              href="/"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
            >
              &larr; Canlı Yayına Geri Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED MASTER CONTROL CONSOLE
  return (
    <div className="space-y-8 max-w-[1250px] mx-auto">
      {/* Top Console Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#202024]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase mb-1">
            <Link href="/" className="hover:text-zinc-200 transition-colors">
              SİNYAL TV
            </Link>
            <span>/</span>
            <span className="text-zinc-300">YAYIN MASASI MASTER CONTROL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>Yayın Masası &bull; Canlı Kontrol</span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-mono font-normal">
              Yetkili Oturumu
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Canlı izleyici analitiği, yayın sırası yönetimi, acil canlıya alma ve MP4 video yükleme merkezi.
          </p>
        </div>

        {/* Global Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={async () => {
              try {
                const res = await fetch('/api/videos/sync');
                const data = await res.json();
                if (data.success) {
                  setSuccessMessage(`Masaüstündeki ${data.totalCount} video başarıyla tarandı ve yayın akışına bağlandı.`);
                  setTimeout(() => window.location.reload(), 1500);
                } else {
                  alert(data.error || 'Masaüstü klasörü bulunamadı. Bu özellik sadece yerel geliştirme (localhost) ortamında çalışır.');
                }
              } catch (e) {
                alert('Masaüstü klasörü taranırken hata oluştu. Canlı sunucuda (Vercel) yerel disk erişimi bulunmamaktadır.');
              }
            }}
            className="inline-flex items-center gap-2 px-3 py-2 bg-[#18181B] hover:bg-[#202024] text-zinc-300 hover:text-white border border-[#27272A] hover:border-zinc-500 text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Masaüstünü Tara (Desktop/videolar)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('add-video');
              setFormOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-md shadow transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yayına MP4 Ekle</span>
          </button>

          <button
            onClick={handleLogout}
            title="Yönetimden Çıkış Yap"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1C1C20] hover:bg-red-950/60 hover:text-red-300 text-zinc-400 border border-[#2E2E34] hover:border-red-900/60 text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Çıkış</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-950/90 border border-emerald-700 text-emerald-100 text-xs font-medium flex items-center gap-2 animate-in fade-in shadow-lg">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 1. REAL-TIME AUDIENCE & ANALYTICS METRICS BAR */}
      <section className="space-y-3" aria-label="Canlı İzleyici & Ziyaretçi İstatistikleri">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase font-bold text-zinc-400 flex items-center gap-2">
            <Users className="w-4 h-4 text-red-500" />
            <span>CANLI İZLEYİCİ & YAYIN PERFORMANS ANALİTİĞİ</span>
          </span>
          <span className="text-[11px] font-mono text-zinc-500">Gerçek Zamanlı Metrikler</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Active Viewers */}
          <div className="p-3.5 rounded-lg bg-[#121214] border border-[#27272A] relative overflow-hidden">
            <div className="flex items-center justify-between text-zinc-400 text-[10px] font-mono uppercase">
              <span>ANLIK İZLEYİCİ</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-live-pulse" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mt-1 font-mono tracking-tight">
              {analytics.activeViewers.toLocaleString('tr-TR')}
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
              <TrendingUp className="w-3 h-3" />
              <span>Canlı Akışta</span>
            </div>
          </div>

          {/* Peak Viewers */}
          <div className="p-3.5 rounded-lg bg-[#121214] border border-[#27272A]">
            <span className="text-zinc-400 text-[10px] font-mono uppercase block">ZİRVE İZLEYİCİ</span>
            <div className="text-xl sm:text-2xl font-bold text-white mt-1 font-mono tracking-tight">
              {analytics.peakViewersToday.toLocaleString('tr-TR')}
            </div>
            <span className="text-[10px] text-zinc-500 font-mono block mt-1">Bugünkü En Yüksek</span>
          </div>

          {/* Total Visitors Today */}
          <div className="p-3.5 rounded-lg bg-[#121214] border border-[#27272A]">
            <span className="text-zinc-400 text-[10px] font-mono uppercase block">GÜNLÜK ZİYARET</span>
            <div className="text-xl sm:text-2xl font-bold text-white mt-1 font-mono tracking-tight">
              {analytics.totalVisitsToday.toLocaleString('tr-TR')}
            </div>
            <span className="text-[10px] text-zinc-500 font-mono block mt-1">Tekil Giriş</span>
          </div>

          {/* Total Video Plays */}
          <div className="p-3.5 rounded-lg bg-[#121214] border border-[#27272A]">
            <span className="text-zinc-400 text-[10px] font-mono uppercase block">TOPLAM OYNATMA</span>
            <div className="text-xl sm:text-2xl font-bold text-white mt-1 font-mono tracking-tight">
              {analytics.totalVideoPlays.toLocaleString('tr-TR')}
            </div>
            <span className="text-[10px] text-zinc-500 font-mono block mt-1">Video Başlatma</span>
          </div>

          {/* Downloads Counter */}
          <div className="p-3.5 rounded-lg bg-[#121214] border border-[#27272A]">
            <span className="text-zinc-400 text-[10px] font-mono uppercase block">İNDİRİLEN VİDEO</span>
            <div className="text-xl sm:text-2xl font-bold text-white mt-1 font-mono tracking-tight">
              {analytics.totalDownloads.toLocaleString('tr-TR')}
            </div>
            <span className="text-[10px] text-zinc-500 font-mono block mt-1">MP4 İndirmeleri</span>
          </div>

          {/* Stream Bandwidth */}
          <div className="p-3.5 rounded-lg bg-[#121214] border border-[#27272A]">
            <span className="text-zinc-400 text-[10px] font-mono uppercase block">BANT GENİŞLİĞİ</span>
            <div className="text-xl sm:text-2xl font-bold text-white mt-1 font-mono tracking-tight">
              {analytics.streamBandwidthGB} GB
            </div>
            <span className="text-[10px] text-zinc-500 font-mono block mt-1">Aktarılan Veri</span>
          </div>
        </div>
      </section>

      {/* 2. FORCED LIVE OVERRIDE BAR & QUICK SWITCHES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Live Override Status Card */}
        <div className="p-4 rounded-lg bg-[#121214] border border-[#27272A] flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 uppercase font-bold">
                CANLI YAYIN MODU
              </span>
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isOffline
                    ? 'bg-zinc-500'
                    : forcedLiveVideoId
                    ? 'bg-amber-500 animate-live-pulse'
                    : 'bg-red-500 animate-live-pulse'
                }`}
              />
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mt-1">
              {isOffline
                ? 'Yayın Çevrimdışı (Offline)'
                : forcedLiveVideoId
                ? 'Özel Yayın Canlıda (Manuel Cut-In)'
                : 'Otomatik 24/7 Akış Döngüsü'}
            </h4>
            <p className="text-xs text-zinc-400 mt-1 truncate">
              {forcedLiveVideoId
                ? `Şu an canlı: ${broadcastState.currentVideo?.title}`
                : 'Yayın akışı otomatik saat çizelgesine göre dönüyor.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {forcedLiveVideoId && (
              <button
                onClick={clearForcedLive}
                className="flex-1 py-2 px-3 rounded text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition-colors cursor-pointer"
              >
                Otomatik Akışa Dön
              </button>
            )}
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`py-2 px-3 rounded text-xs font-semibold transition-colors cursor-pointer ${
                forcedLiveVideoId ? 'w-auto' : 'w-full'
              } ${
                isOffline
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-[#1C1C20] hover:bg-[#25252A] text-zinc-300 border border-[#2E2E34]'
              }`}
            >
              {isOffline ? 'Yayını Aç' : 'Çevrimdışı Yap'}
            </button>
          </div>
        </div>

        {/* Live Ticker Banner Quick Control */}
        <div className="p-4 rounded-lg bg-[#121214] border border-[#27272A] flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 uppercase font-bold">
                KAYAN YAZI DUYURU BANDI
              </span>
              <Megaphone className="w-4 h-4 text-red-400" />
            </div>
            <h4 className="text-sm font-bold text-white mt-1 truncate">
              {tickerMessage ? 'Kayan Yazı Aktif' : 'Kayan Yazı Kapalı'}
            </h4>
            <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
              {tickerMessage || 'Oyuncu üzerinde duyuru metni bulunmuyor.'}
            </p>
          </div>

          <form onSubmit={handleUpdateTicker} className="flex items-center gap-2">
            <input
              type="text"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value)}
              placeholder="Canlı duyuru bandı metni..."
              className="flex-1 bg-[#18181B] border border-[#2E2E34] text-xs text-zinc-100 px-2 py-1.5 rounded focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded transition-colors cursor-pointer shrink-0"
            >
              Yayınla
            </button>
            {tickerMessage && (
              <button
                type="button"
                onClick={() => {
                  setTickerMessage(null);
                  setTickerInput('');
                }}
                className="px-2 py-1.5 bg-[#18181B] hover:bg-[#25252A] text-zinc-400 hover:text-white border border-[#2E2E34] text-xs rounded transition-colors cursor-pointer"
                title="Kaldır"
              >
                Sil
              </button>
            )}
          </form>
        </div>

        {/* Watermark & Backup Card */}
        <div className="p-4 rounded-lg bg-[#121214] border border-[#27272A] flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 uppercase font-bold">
                KANAL AYARLARI & YEDEK
              </span>
              <Sliders className="w-4 h-4 text-zinc-400" />
            </div>
            <h4 className="text-sm font-bold text-white mt-1">
              {watermarkEnabled ? 'Filigran: Açık' : 'Filigran: Kapalı'} &bull; {videos.length} Yayın
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              JSON veritabanı yedeğini indirin veya filigranı değiştirin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setWatermarkEnabled(!watermarkEnabled)}
              className="flex-1 py-2 px-2 rounded text-xs font-semibold bg-[#1C1C20] hover:bg-[#25252A] text-zinc-300 border border-[#2E2E34] transition-colors cursor-pointer"
            >
              {watermarkEnabled ? 'Filigranı Gizle' : 'Filigranı Aç'}
            </button>
            <button
              onClick={handleExportJSON}
              className="py-2 px-2.5 rounded text-xs font-semibold bg-[#18181B] hover:bg-[#202024] text-zinc-300 border border-[#27272A] transition-colors flex items-center justify-center gap-1 cursor-pointer"
              title="JSON İndir"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                if (confirm('Tüm özel eklemeler sıfırlanacak. Emin misiniz?')) {
                  resetToDefaults();
                }
              }}
              title="Varsayılana Sıfırla"
              className="p-2 rounded bg-[#18181B] hover:bg-red-950/50 hover:text-red-400 text-zinc-400 border border-[#27272A] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. YAYINA ÖZEL MP4 VİDEO EKLEME FORMU (DOSYADAN SEÇ VEYA URL GİR) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#202024]">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileVideo className="w-5 h-5 text-red-500" />
              <span>Yayına Özel MP4 Video Ekle</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Bilgisayarınızdan bir `.mp4` dosyası seçebilir veya doğrudan bir video bağlantısı tanımlayabilirsiniz.
            </p>
          </div>

          <button
            onClick={() => setFormOpen(!formOpen)}
            className="px-3 py-1.5 rounded bg-[#18181B] hover:bg-[#202024] text-zinc-300 text-xs font-semibold border border-[#27272A] transition-colors cursor-pointer"
          >
            {formOpen ? 'Formu Daralt' : 'Formu Genişlet'}
          </button>
        </div>

        {formOpen && (
          <form
            onSubmit={handleCreateVideo}
            className="p-6 rounded-lg bg-[#121214] border border-[#2D2D32] space-y-5 animate-in fade-in"
          >
            {/* Quick File Picker from Computer */}
            <div className="p-4 rounded-lg bg-[#18181B] border-2 border-dashed border-[#2E2E34] hover:border-red-500/60 transition-colors flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400 shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-200">
                    Bilgisayarınızdan MP4 Dosyası Seçin
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Dosyayı seçtiğinizde başlık, dosya boyutu ve süre otomatik hesaplanır.
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/*"
                onChange={handleLocalFileSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold rounded-md shadow transition-colors cursor-pointer shrink-0"
              >
                Dosya Seç (.mp4)
              </button>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-400 mb-1">YAYIN BAŞLIĞI *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="örn: SİNYAL ÖZEL: Gece Fragmanı"
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2 text-zinc-100 focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">ORİJİNAL DOSYA ADI</label>
                <input
                  type="text"
                  value={originalTitle}
                  onChange={(e) => setOriginalTitle(e.target.value)}
                  placeholder="örn: ozel_video.mp4"
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2 text-zinc-100 focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">KATEGORİ *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2 text-zinc-100 focus:outline-none focus:border-red-500"
                >
                  <option value="DİZİ">DİZİ</option>
                  <option value="BELGESEL">BELGESEL</option>
                  <option value="GECE YAYINI">GECE YAYINI</option>
                  <option value="KISA FİLM">KISA FİLM</option>
                  <option value="DENEYSEL">DENEYSEL</option>
                  <option value="ÖZEL">ÖZEL</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">BÖLÜM BİLGİSİ</label>
                <input
                  type="text"
                  value={episode}
                  onChange={(e) => setEpisode(e.target.value)}
                  placeholder="örn: Özel Yayın #01"
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2 text-zinc-100 focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1">VİDEO URL / AKIŞ BAĞLANTISI (.MP4) *</label>
                <input
                  type="text"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="/api/stream/video_adi.mp4 veya http://... veya blob:..."
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2 text-zinc-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">KAPAK GÖRSELİ (THUMBNAIL URL)</label>
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2 text-zinc-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">SÜRE (SANİYE CİNSİNDEN)</label>
                <input
                  type="number"
                  min="5"
                  value={durationSec}
                  onChange={(e) => setDurationSec(Number(e.target.value))}
                  placeholder="60"
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2 text-zinc-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">ÇÖZÜNÜRLÜK & DOSYA BOYUTU</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="1920 × 1080"
                    className="w-1/2 bg-[#18181B] border border-[#27272A] rounded p-2 text-zinc-100"
                  />
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="120 MB"
                    className="w-1/2 bg-[#18181B] border border-[#27272A] rounded p-2 text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">ETİKETLER</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="dizi, ozel, aksiyon"
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2 text-zinc-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1">AÇIKLAMA</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Yayın hakkında kısa bilgi..."
                  className="w-full bg-[#18181B] border border-[#27272A] rounded p-2 text-zinc-100 focus:outline-none focus:border-red-500 font-sans"
                />
              </div>
            </div>

            {/* Checkbox: Play Immediately */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="playImmediately"
                checked={playImmediatelyOnAdd}
                onChange={(e) => setPlayImmediatelyOnAdd(e.target.checked)}
                className="w-4 h-4 accent-red-600 rounded cursor-pointer"
              />
              <label htmlFor="playImmediately" className="text-xs text-zinc-300 cursor-pointer font-medium">
                Bu videoyu ekler eklemez <strong>ANINDA CANLI YAYINA AL (Cut-In)</strong>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#202024]">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-4 py-2 rounded text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Yayını Kaydet ve Yayın Akışına Bağla</span>
              </button>
            </div>
          </form>
        )}
      </section>

      {/* 4. YAYIN AKIŞI SIRALAMA & MANUEL CANLIYA ALMA (PLAYLIST MANAGER) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#202024]">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-red-500" />
              <span>Yayın Akışı Sıralama & Canlı Yayına Alma ({videos.length} Video)</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Yayın sırasını değiştirebilir veya dilediğiniz videoyu tek tıkla canlı yayına alabilirsiniz.
            </p>
          </div>

          <div className="text-xs font-mono text-zinc-500">
            Toplam Akış: {formatDuration(videos.reduce((a, b) => a + b.duration, 0))}
          </div>
        </div>

        <div className="divide-y divide-[#1C1C20] border border-[#232326] rounded-lg overflow-hidden bg-[#101012]">
          {videos.map((vid, idx) => {
            const isCurrentlyLive =
              broadcastState.isLive && broadcastState.currentVideo?.id === vid.id;

            return (
              <div
                key={vid.id}
                className={`p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 transition-colors ${
                  isCurrentlyLive
                    ? 'bg-red-950/30 border-l-4 border-l-red-500'
                    : 'hover:bg-[#151518]'
                }`}
              >
                {/* Left: Position Number & Thumbnail & Title */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Position number */}
                  <div className="flex flex-col items-center justify-center w-8 shrink-0">
                    <span className="text-xs font-mono font-bold text-zinc-400">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-20 h-12 bg-black rounded overflow-hidden shrink-0 border border-zinc-800">
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {isCurrentlyLive && (
                      <div className="absolute inset-0 bg-red-950/60 flex items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-live-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Video Metadata */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="text-red-400 font-bold">{vid.category}</span>
                      {vid.episode && <span className="text-zinc-400">• {vid.episode}</span>}
                      <span className="text-zinc-500">• {formatDuration(vid.duration)}</span>
                      <span className="text-zinc-600 hidden sm:inline">• {vid.fileSize}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-semibold text-zinc-100 truncate mt-0.5">
                      {vid.title}
                    </h4>
                    {vid.originalTitle && (
                      <p className="text-[11px] font-mono text-zinc-500 truncate">
                        Dosya: {vid.originalTitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Broadcast Reorder & Live Action Controls */}
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  {/* LIVE NOW Status / Force Live Trigger */}
                  {isCurrentlyLive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-950 border border-red-700 text-red-300 text-xs font-mono font-bold">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-live-pulse" />
                      YAYINDA
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        forceLiveNow(vid.id);
                        setSuccessMessage(`"${vid.title}" CANLI YAYINA ALINDI!`);
                        setTimeout(() => setSuccessMessage(null), 4000);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-900/60 hover:bg-red-600 text-white border border-red-700/60 text-xs font-semibold transition-colors cursor-pointer"
                      title="Bu videoyu hemen canlı yayına al"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Canlıya Al</span>
                    </button>
                  )}

                  {/* Move Up / Down in playlist */}
                  <div className="flex items-center bg-[#18181B] rounded border border-[#27272A]">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveVideoUp(vid.id)}
                      className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
                      title="Sıralamada Yukarı Taşı"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === videos.length - 1}
                      onClick={() => moveVideoDown(vid.id)}
                      className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 border-l border-[#27272A] transition-colors"
                      title="Sıralamada Aşağı Taşı"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Preview Detail */}
                  <Link
                    href={`/videos/${vid.id}`}
                    className="p-1.5 rounded bg-[#18181B] hover:bg-[#202024] text-zinc-400 hover:text-white border border-[#27272A] transition-colors"
                    title="Önizle"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>

                  {/* Delete (if more than 1 video) */}
                  {videos.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`"${vid.title}" yayınını listeden kaldırmak istediğinize emin misiniz?`)) {
                          deleteVideo(vid.id);
                        }
                      }}
                      className="p-1.5 rounded hover:bg-red-950/60 hover:text-red-400 text-zinc-500 border border-transparent hover:border-red-900/60 transition-colors cursor-pointer"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
