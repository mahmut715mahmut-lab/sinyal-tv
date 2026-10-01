'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  PictureInPicture,
  RotateCcw,
  Radio,
  Settings,
  Subtitles,
  AlertCircle,
  Tv,
} from 'lucide-react';
import { Video } from '@/types/broadcast';
import { formatDuration } from '@/lib/broadcast';
import { Logo } from '@/components/Logo';
import { useBroadcast } from '@/lib/videoStore';

interface LivePlayerProps {
  currentVideo: Video | null;
  elapsedSeconds?: number;
  isLiveMode?: boolean;
  onEnded?: () => void;
  className?: string;
}

export const LivePlayer: React.FC<LivePlayerProps> = ({
  currentVideo,
  elapsedSeconds = 0,
  isLiveMode = true,
  onEnded,
  className = '',
}) => {
  const { isOffline, watermarkEnabled, analytics, tickerMessage, broadcastState } = useBroadcast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true); // Start muted for smooth autoplay
  const [volume, setVolume] = useState<number>(0.85);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [selectedQuality, setSelectedQuality] = useState<string>('1080p FHD');
  const [subtitlesEnabled, setSubtitlesEnabled] = useState<boolean>(false);
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync video time when currentVideo or elapsedSeconds changes in live mode
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentVideo || isOffline) return;

    setErrorState(false);

    const targetSrc = currentVideo.videoUrl;
    if (video.src !== targetSrc) {
      video.src = targetSrc;
      video.load();
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration || currentVideo.duration);

      if (isLiveMode && elapsedSeconds > 0 && elapsedSeconds < (video.duration || currentVideo.duration)) {
        video.currentTime = elapsedSeconds;
      }

      // Try autoplay
      video
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log('Autoplay deferred by browser policy:', err);
          setIsPlaying(false);
        });
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [currentVideo, isOffline, isLiveMode]);

  // Handle live time drift sync
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isLiveMode || !isPlaying) return;

    // If drift is greater than 8 seconds, re-align smoothly
    const diff = Math.abs(video.currentTime - elapsedSeconds);
    if (diff > 8 && elapsedSeconds < (video.duration || 9999)) {
      video.currentTime = elapsedSeconds;
    }
  }, [elapsedSeconds, isLiveMode, isPlaying]);

  // Update time and state listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleError = () => {
      console.warn('Video stream error occurred');
      setErrorState(true);
      setIsBuffering(false);
    };

    const handleVideoEnded = () => {
      if (onEnded) {
        onEnded();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleVideoEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleVideoEnded);
    };
  }, [onEnded]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Controls auto-hide timer
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowQualityMenu(false);
      }
    }, 3200);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    setHasUserInteracted(true);

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    setHasUserInteracted(true);

    if (video.muted) {
      video.muted = false;
      video.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;

    setVolume(newVol);
    video.volume = newVol;
    if (newVol === 0) {
      video.muted = true;
      setIsMuted(true);
    } else {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
      } catch (e) {}
    } else {
      try {
        await document.exitFullscreen();
      } catch (e) {}
    }
  };

  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
      }
    } catch (e) {}
  };

  const syncToLive = () => {
    const video = videoRef.current;
    if (!video || !isLiveMode) return;
    video.currentTime = elapsedSeconds;
    if (video.paused) {
      video.play();
    }
  };

  const retryPlayback = () => {
    setErrorState(false);
    const video = videoRef.current;
    if (video && currentVideo) {
      video.src = currentVideo.videoUrl;
      video.load();
      video.play();
    }
  };

  // Offline screen fallback
  if (isOffline || !currentVideo) {
    return (
      <div
        className={`relative w-full aspect-video bg-[#0B0B0D] rounded-lg border border-[#232326] overflow-hidden flex flex-col items-center justify-center text-center p-6 select-none ${className}`}
      >
        {/* Subtle TV test pattern / grid */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#27272A_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex flex-col items-center max-w-md">
          <div className="w-14 h-14 rounded-lg bg-[#141416] border border-[#2D2D32] flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
            <Tv className="w-7 h-7 stroke-[1.5]" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18181B] border border-[#2E2E34] text-xs text-zinc-300 font-mono mb-3">
            <span className="w-2 h-2 rounded-full bg-zinc-500" />
            YAYIN AKIŞI BEKLENİYOR
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-zinc-100 mb-2">
            Kanal Şu Anda Çevrimdışı
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            SİNYAL TV 24/7 yayın akışı güncelleniyor. Yeni program bloğu birazdan otomatik olarak başlayacaktır.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-[11px] font-mono text-zinc-500">
              FREKANS: SİNYAL-09 // BEKLEMEDE
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`group relative w-full aspect-video bg-black rounded-lg border border-[#232326] overflow-hidden select-none flex items-center justify-center ${className}`}
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        poster={currentVideo.thumbnail}
        playsInline
        muted={isMuted}
        preload="metadata"
        className="w-full h-full object-cover cursor-pointer"
        onClick={togglePlay}
      />

      {/* Subtitles Overlay if enabled */}
      {subtitlesEnabled && (
        <div className="absolute bottom-16 left-0 right-0 text-center pointer-events-none px-6 z-20">
          <span className="inline-block bg-black/85 text-yellow-100 text-xs sm:text-sm font-medium px-3 py-1 rounded border border-white/10 tracking-wide">
            [Ses kaydı: {currentVideo.title} • {currentVideo.audioLanguage}]
          </span>
        </div>
      )}

      {/* Channel Watermark (Top Right) */}
      {watermarkEnabled && (
        <div className="absolute top-4 right-4 z-20 pointer-events-none">
          <Logo size="sm" watermarkMode={true} />
        </div>
      )}

      {/* Live Badge (Top Left) */}
      {isLiveMode && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-red-500/40 text-white text-[11px] font-bold font-mono tracking-wider shadow-lg">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-live-pulse" />
            <span>CANLI</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-zinc-300 text-[10px] font-mono">
            <Radio className="w-3 h-3 text-red-400" />
            <span>{analytics.activeViewers.toLocaleString('tr-TR')} İZLEYİCİ</span>
          </div>
          {broadcastState.isForcedLive && (
            <div className="hidden sm:flex items-center px-2 py-1 rounded bg-amber-950/80 backdrop-blur-md border border-amber-600 text-amber-300 text-[10px] font-mono font-bold">
              ÖZEL YAYIN
            </div>
          )}
        </div>
      )}

      {/* Breaking News Ticker (Alt Kayan Yazı Bandı) */}
      {tickerMessage && (
        <div className="absolute bottom-11 sm:bottom-12 inset-x-0 z-20 bg-red-950/90 border-y border-red-800/80 px-4 py-1 flex items-center gap-3 text-xs font-mono overflow-hidden pointer-events-none">
          <span className="bg-red-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px] uppercase shrink-0">
            DUYURU
          </span>
          <div className="whitespace-nowrap overflow-hidden text-red-100 text-[11px] tracking-wide">
            {tickerMessage}
          </div>
        </div>
      )}

      {/* Unmute Autoplay Prompt Overlay if muted on first visit */}
      {isMuted && isPlaying && !hasUserInteracted && (
        <button
          onClick={toggleMute}
          className="absolute top-16 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-medium shadow-xl cursor-pointer transition-all animate-in fade-in"
        >
          <VolumeX className="w-4 h-4 text-red-400" />
          <span>Sesi Açmak İçin Tıklayın</span>
        </button>
      )}

      {/* Initial Click-to-Play Overlay if Autoplay blocked */}
      {!isPlaying && !errorState && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer group-hover:bg-black/30 transition-colors"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600/90 group-hover:bg-red-600 hover:scale-105 border border-white/20 flex items-center justify-center text-white shadow-2xl transition-all duration-200">
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white translate-x-0.5" />
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-white mt-4 bg-black/70 px-4 py-1.5 rounded-full border border-white/10 font-mono">
            YAYINI BAŞLAT
          </span>
        </div>
      )}

      {/* Error Fallback Overlay */}
      {errorState && (
        <div className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
          <h4 className="text-base font-semibold text-white mb-1">Yayın Sinyali Yüklenemedi</h4>
          <p className="text-xs text-zinc-400 max-w-sm mb-4">
            Video akışı geçici olarak yanıt vermiyor. Doğrudan video kaynağını yeniden deneyebilirsiniz.
          </p>
          <button
            onClick={retryPlayback}
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-md border border-zinc-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tekrar Dene</span>
          </button>
        </div>
      )}

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
        </div>
      )}

      {/* Custom Player Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-8 pb-3 px-3 sm:px-4 transition-opacity duration-200 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar (Interactive in VOD, Live-synced in Live mode) */}
        <div className="relative mb-2.5 flex items-center group/progress">
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
            <div
              className="h-full bg-red-600 relative"
              style={{
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-zinc-200 text-xs gap-2">
          {/* Left Controls: Play/Pause, Live Sync, Volume */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded hover:bg-white/10 text-white transition-colors cursor-pointer"
              aria-label={isPlaying ? 'Durdur' : 'Oynat'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            {isLiveMode && (
              <button
                onClick={syncToLive}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/60 hover:bg-red-900/80 border border-red-700/60 text-[11px] font-mono font-semibold text-red-300 transition-colors cursor-pointer"
                title="Canlı yayına senkronize ol"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-live-pulse" />
                <span>CANLI SYNC</span>
              </button>
            )}

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                aria-label={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-18 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-red-600 hidden sm:block"
                aria-label="Ses seviyesi"
              />
            </div>

            {/* Time Indicator */}
            <div className="text-[11px] font-mono text-zinc-400">
              <span>{formatDuration(currentTime)}</span>
              <span className="mx-1 text-zinc-600">/</span>
              <span>{formatDuration(duration || currentVideo.duration)}</span>
            </div>
          </div>

          {/* Right Controls: Quality, Subtitles, PiP, Fullscreen */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Subtitles Toggle */}
            <button
              onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
              className={`p-1.5 rounded transition-colors text-xs cursor-pointer ${
                subtitlesEnabled
                  ? 'bg-red-600/80 text-white'
                  : 'hover:bg-white/10 text-zinc-400 hover:text-white'
              }`}
              title="Altyazı (TR)"
              aria-label="Altyazı Aç/Kapat"
            >
              <Subtitles className="w-4 h-4" />
            </button>

            {/* Quality Menu Selector */}
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="px-2 py-1 rounded hover:bg-white/10 text-zinc-300 hover:text-white text-[11px] font-mono font-medium transition-colors cursor-pointer border border-white/10 flex items-center gap-1"
                aria-label="Yayın Kalitesi"
              >
                <span>{selectedQuality.split(' ')[0]}</span>
              </button>

              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-32 bg-[#18181B] border border-[#2E2E34] rounded-md shadow-2xl py-1 z-40 text-xs font-mono">
                  {['4K UHD', '1080p FHD', '720p HD', 'OTOMATİK'].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setSelectedQuality(q);
                        setShowQualityMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-[#27272A] flex items-center justify-between cursor-pointer ${
                        selectedQuality === q ? 'text-red-400 font-bold bg-zinc-800/40' : 'text-zinc-300'
                      }`}
                    >
                      <span>{q}</span>
                      {selectedQuality === q && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Picture-in-Picture */}
            <button
              onClick={togglePiP}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer hidden sm:block"
              title="Resim İçinde Resim (PiP)"
              aria-label="Resim içinde resim"
            >
              <PictureInPicture className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran'}
              aria-label="Tam Ekran"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
