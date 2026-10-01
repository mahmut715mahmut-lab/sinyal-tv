'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Video, ChannelInfo, CurrentBroadcastState, AnalyticsStats } from '@/types/broadcast';
import { initialVideos } from '@/data/videos';
import { defaultChannelInfo } from '@/data/channel';
import { getCurrentBroadcastState, generateDaySchedule } from '@/lib/broadcast';

interface BroadcastContextType {
  videos: Video[];
  channelInfo: ChannelInfo;
  broadcastState: CurrentBroadcastState;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  addVideo: (video: Omit<Video, 'id' | 'broadcastOrder'>) => Video;
  updateVideo: (id: string, updates: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
  reorderVideos: (newVideos: Video[]) => void;
  moveVideoUp: (id: string) => void;
  moveVideoDown: (id: string) => void;
  forceLiveNow: (id: string) => void;
  clearForcedLive: () => void;
  forcedLiveVideoId: string | null;
  resetToDefaults: () => void;
  watermarkEnabled: boolean;
  setWatermarkEnabled: (enabled: boolean) => void;
  tickerMessage: string | null;
  setTickerMessage: (msg: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  analytics: AnalyticsStats;
  incrementDownloadCount: () => void;
}

const BroadcastContext = createContext<BroadcastContextType | undefined>(undefined);

const STORAGE_KEY = 'sinyal_tv_videos_real_v4';
const OFFLINE_KEY = 'sinyal_tv_offline_mode';
const WATERMARK_KEY = 'sinyal_tv_watermark';
const FORCED_LIVE_KEY = 'sinyal_tv_forced_live';
const TICKER_KEY = 'sinyal_tv_ticker_message';
const STATS_KEY = 'sinyal_tv_analytics_stats';

const initialAnalytics: AnalyticsStats = {
  activeViewers: 1248,
  peakViewersToday: 3840,
  totalVisitsToday: 18450,
  totalVideoPlays: 42190,
  totalDownloads: 3420,
  streamBandwidthGB: 684.5,
  avgWatchMinutes: 14.8,
};

export const BroadcastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [channelInfo] = useState<ChannelInfo>(defaultChannelInfo);
  const [isOffline, setIsOfflineState] = useState<boolean>(false);
  const [watermarkEnabled, setWatermarkEnabledState] = useState<boolean>(true);
  const [forcedLiveVideoId, setForcedLiveVideoId] = useState<string | null>(null);
  const [tickerMessage, setTickerMessageState] = useState<string | null>(
    'CANLI YAYIN: SİNYAL TV 24 Saat Kesintisiz Bağımsız Dijital Akış • Tüm bölümler arşive anında aktarılmaktadır.'
  );
  const [analytics, setAnalytics] = useState<AnalyticsStats>(initialAnalytics);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [nowTime, setNowTime] = useState<Date>(new Date());

  // Load persisted state from localStorage on mount
  useEffect(() => {
    try {
      const savedVideos = localStorage.getItem(STORAGE_KEY);
      if (savedVideos) {
        const parsed = JSON.parse(savedVideos);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setVideos(parsed);
        }
      }

      const savedOffline = localStorage.getItem(OFFLINE_KEY);
      if (savedOffline !== null) {
        setIsOfflineState(savedOffline === 'true');
      }

      const savedWatermark = localStorage.getItem(WATERMARK_KEY);
      if (savedWatermark !== null) {
        setWatermarkEnabledState(savedWatermark === 'true');
      }

      const savedForced = localStorage.getItem(FORCED_LIVE_KEY);
      if (savedForced) {
        setForcedLiveVideoId(savedForced);
      }

      const savedTicker = localStorage.getItem(TICKER_KEY);
      if (savedTicker !== null) {
        setTickerMessageState(savedTicker || null);
      }

      const savedStats = localStorage.getItem(STATS_KEY);
      if (savedStats) {
        setAnalytics(JSON.parse(savedStats));
      }
    } catch (err) {
      console.warn('Storage read warning:', err);
    }
  }, []);

  // Update real-time clock every 1 second and simulate subtle organic viewer fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(new Date());

      // Organic viewer micro-fluctuation (± 2 to 5 viewers)
      setAnalytics((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        const newActive = Math.max(250, prev.activeViewers + delta);
        const newPeak = Math.max(prev.peakViewersToday, newActive);
        const updated = {
          ...prev,
          activeViewers: newActive,
          peakViewersToday: newPeak,
          totalVisitsToday: prev.totalVisitsToday + (Math.random() > 0.8 ? 1 : 0),
        };
        return updated;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute current broadcast state
  const broadcastState = getCurrentBroadcastState(
    videos,
    nowTime,
    isOffline,
    forcedLiveVideoId
  );

  const setIsOffline = (offline: boolean) => {
    setIsOfflineState(offline);
    try {
      localStorage.setItem(OFFLINE_KEY, String(offline));
    } catch (e) {}
  };

  const setWatermarkEnabled = (enabled: boolean) => {
    setWatermarkEnabledState(enabled);
    try {
      localStorage.setItem(WATERMARK_KEY, String(enabled));
    } catch (e) {}
  };

  const setTickerMessage = (msg: string | null) => {
    setTickerMessageState(msg);
    try {
      localStorage.setItem(TICKER_KEY, msg || '');
    } catch (e) {}
  };

  const forceLiveNow = (id: string) => {
    setForcedLiveVideoId(id);
    try {
      localStorage.setItem(FORCED_LIVE_KEY, id);
    } catch (e) {}
  };

  const clearForcedLive = () => {
    setForcedLiveVideoId(null);
    try {
      localStorage.removeItem(FORCED_LIVE_KEY);
    } catch (e) {}
  };

  const addVideo = useCallback(
    (newVidData: Omit<Video, 'id' | 'broadcastOrder'>): Video => {
      const newId = `sinyal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const nextOrder = (videos[videos.length - 1]?.broadcastOrder || 0) + 1;
      const createdVideo: Video = {
        ...newVidData,
        id: newId,
        broadcastOrder: nextOrder,
      };

      setVideos((prev) => {
        const updated = [...prev, createdVideo];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      return createdVideo;
    },
    [videos]
  );

  const updateVideo = useCallback((id: string, updates: Partial<Video>) => {
    setVideos((prev) => {
      const updated = prev.map((v) => (v.id === id ? { ...v, ...updates } : v));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  const deleteVideo = useCallback((id: string) => {
    setVideos((prev) => {
      const updated = prev.filter((v) => v.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  const reorderVideos = useCallback((newOrderedList: Video[]) => {
    const updated = newOrderedList.map((v, idx) => ({
      ...v,
      broadcastOrder: idx + 1,
    }));
    setVideos(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  }, []);

  const moveVideoUp = useCallback((id: string) => {
    setVideos((prev) => {
      const index = prev.findIndex((v) => v.id === id);
      if (index <= 0) return prev;
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      const reindexed = copy.map((v, i) => ({ ...v, broadcastOrder: i + 1 }));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reindexed));
      } catch (e) {}
      return reindexed;
    });
  }, []);

  const moveVideoDown = useCallback((id: string) => {
    setVideos((prev) => {
      const index = prev.findIndex((v) => v.id === id);
      if (index < 0 || index >= prev.length - 1) return prev;
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      const reindexed = copy.map((v, i) => ({ ...v, broadcastOrder: i + 1 }));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reindexed));
      } catch (e) {}
      return reindexed;
    });
  }, []);

  const incrementDownloadCount = useCallback(() => {
    setAnalytics((prev) => {
      const updated = {
        ...prev,
        totalDownloads: prev.totalDownloads + 1,
        streamBandwidthGB: Number((prev.streamBandwidthGB + 0.15).toFixed(2)),
      };
      try {
        localStorage.setItem(STATS_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setVideos(initialVideos);
    setIsOfflineState(false);
    setForcedLiveVideoId(null);
    setTickerMessageState(
      'CANLI YAYIN: SİNYAL TV 24 Saat Kesintisiz Bağımsız Dijital Akış • Tüm bölümler arşive anında aktarılmaktadır.'
    );
    setAnalytics(initialAnalytics);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(OFFLINE_KEY);
      localStorage.removeItem(FORCED_LIVE_KEY);
      localStorage.removeItem(TICKER_KEY);
      localStorage.removeItem(STATS_KEY);
    } catch (e) {}
  }, []);

  // Global key listener for search shortcut '/' and ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        if (e.key === 'Escape') {
          setIsSearchOpen(false);
        }
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <BroadcastContext.Provider
      value={{
        videos,
        channelInfo,
        broadcastState,
        isOffline,
        setIsOffline,
        addVideo,
        updateVideo,
        deleteVideo,
        reorderVideos,
        moveVideoUp,
        moveVideoDown,
        forceLiveNow,
        clearForcedLive,
        forcedLiveVideoId,
        resetToDefaults,
        watermarkEnabled,
        setWatermarkEnabled,
        tickerMessage,
        setTickerMessage,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        analytics,
        incrementDownloadCount,
      }}
    >
      {children}
    </BroadcastContext.Provider>
  );
};

export const useBroadcast = () => {
  const context = useContext(BroadcastContext);
  if (!context) {
    throw new Error('useBroadcast must be used within a BroadcastProvider');
  }
  return context;
};
