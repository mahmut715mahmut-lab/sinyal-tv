export type VideoCategory =
  | 'TÜMÜ'
  | 'BELGESEL'
  | 'DİZİ'
  | 'KISA FİLM'
  | 'GECE YAYINI'
  | 'DENEYSEL'
  | 'ÖZEL';

export interface Video {
  id: string;
  title: string;
  originalTitle?: string;
  description: string;
  longDescription?: string;
  thumbnail: string;
  videoUrl: string;
  downloadUrl: string;
  duration: number; // in seconds
  category: Exclude<VideoCategory, 'TÜMÜ'>;
  episode?: string; // e.g. "Bölüm 01" or "Sezon 1 • Bölüm 4"
  season?: number;
  releaseDate: string; // ISO or formatted date
  fileSize: string; // e.g. "245 MB"
  resolution: string; // e.g. "1920 × 1080" or "3840 × 2160"
  format: string; // e.g. "MP4 (H.264 / AAC)"
  audioLanguage: string; // "Türkçe (Stereo)"
  aspectRatio: string; // "16:9"
  broadcastOrder: number;
  directorNotes?: string;
  tags: string[];
  featured?: boolean;
}

export interface AnalyticsStats {
  activeViewers: number;
  peakViewersToday: number;
  totalVisitsToday: number;
  totalVideoPlays: number;
  totalDownloads: number;
  streamBandwidthGB: number;
  avgWatchMinutes: number;
}

export interface ChannelInfo {
  id: string;
  name: string;
  tagline: string;
  frequency: string;
  description: string;
  streamStatus: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  currentAudienceEstimate: number;
  establishedYear: number;
  contactEmail: string;
}

export interface ScheduleItem {
  id: string;
  videoId: string;
  video: Video;
  startTime: string; // "18:00"
  endTime: string; // "18:24"
  startSeconds: number; // seconds from midnight
  endSeconds: number;
  isLiveNow?: boolean;
  dayOffset: number; // 0 for today, 1 for tomorrow
}

export interface CurrentBroadcastState {
  currentVideo: Video | null;
  nextVideo: Video | null;
  elapsedSeconds: number;
  progressPercent: number;
  remainingSeconds: number;
  currentSlotFormattedStart: string;
  currentSlotFormattedEnd: string;
  nextSlotFormattedStart: string;
  isLive: boolean;
  isForcedLive?: boolean;
  scheduleTimeline: ScheduleItem[];
}
