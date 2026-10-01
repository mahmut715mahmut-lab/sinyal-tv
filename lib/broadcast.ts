import { Video, ScheduleItem, CurrentBroadcastState } from '@/types/broadcast';
import { initialVideos } from '@/data/videos';

/**
 * Formats seconds into HH:MM:SS or MM:SS
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Formats seconds from midnight (0..86399) into "HH:MM"
 */
export function secondsToClock(seconds: number): string {
  const normalized = ((seconds % 86400) + 86400) % 86400;
  const h = Math.floor(normalized / 3600);
  const m = Math.floor((normalized % 3600) / 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Generates a seamless 24-hour broadcast schedule for a given day offset (0 = today, 1 = tomorrow)
 */
export function generateDaySchedule(videos: Video[], dayOffset: number = 0, baseDate: Date = new Date()): ScheduleItem[] {
  if (!videos || videos.length === 0) return [];

  const sortedVideos = [...videos].sort((a, b) => a.broadcastOrder - b.broadcastOrder);
  const totalPlaylistDuration = sortedVideos.reduce((acc, v) => acc + v.duration, 0);

  if (totalPlaylistDuration === 0) return [];

  const SECONDS_IN_DAY = 86400;
  const schedule: ScheduleItem[] = [];

  let currentSecond = 0;
  let videoIndex = 0;
  let slotCount = 0;

  // Align start of schedule deterministically
  while (currentSecond < SECONDS_IN_DAY) {
    const video = sortedVideos[videoIndex % sortedVideos.length];
    const duration = video.duration;
    const startSec = currentSecond;
    const endSec = currentSecond + duration;

    schedule.push({
      id: `schedule-${dayOffset}-${slotCount}-${video.id}`,
      videoId: video.id,
      video: video,
      startTime: secondsToClock(startSec),
      endTime: secondsToClock(endSec),
      startSeconds: startSec,
      endSeconds: endSec,
      dayOffset,
    });

    currentSecond += duration;
    videoIndex++;
    slotCount++;
  }

  return schedule;
}

/**
 * Calculates current live broadcast state at any instant
 */
export function getCurrentBroadcastState(
  videos: Video[],
  currentTime: Date = new Date(),
  isOfflineOverride: boolean = false,
  forcedLiveVideoId: string | null = null
): CurrentBroadcastState {
  if (isOfflineOverride || !videos || videos.length === 0) {
    return {
      currentVideo: null,
      nextVideo: null,
      elapsedSeconds: 0,
      progressPercent: 0,
      remainingSeconds: 0,
      currentSlotFormattedStart: '--:--',
      currentSlotFormattedEnd: '--:--',
      nextSlotFormattedStart: '--:--',
      isLive: false,
      isForcedLive: false,
      scheduleTimeline: [],
    };
  }

  const sortedVideos = [...videos].sort((a, b) => a.broadcastOrder - b.broadcastOrder);

  // If admin has forced a specific video to be live
  if (forcedLiveVideoId) {
    const forcedVideo = sortedVideos.find((v) => v.id === forcedLiveVideoId) || sortedVideos[0];
    const forcedIndex = sortedVideos.indexOf(forcedVideo);
    const nextVideo = sortedVideos[(forcedIndex + 1) % sortedVideos.length];
    const todaySchedule = generateDaySchedule(sortedVideos, 0, currentTime);

    return {
      currentVideo: forcedVideo,
      nextVideo,
      elapsedSeconds: 0,
      progressPercent: 15,
      remainingSeconds: forcedVideo.duration,
      currentSlotFormattedStart: secondsToClock(currentTime.getHours() * 3600 + currentTime.getMinutes() * 60),
      currentSlotFormattedEnd: secondsToClock(currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + forcedVideo.duration),
      nextSlotFormattedStart: secondsToClock(currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + forcedVideo.duration),
      isLive: true,
      isForcedLive: true,
      scheduleTimeline: todaySchedule.map((s) => ({
        ...s,
        isLiveNow: s.video.id === forcedVideo.id,
      })),
    };
  }

  const totalCycle = sortedVideos.reduce((acc, v) => acc + v.duration, 0);

  if (totalCycle === 0) {
    return {
      currentVideo: null,
      nextVideo: null,
      elapsedSeconds: 0,
      progressPercent: 0,
      remainingSeconds: 0,
      currentSlotFormattedStart: '--:--',
      currentSlotFormattedEnd: '--:--',
      nextSlotFormattedStart: '--:--',
      isLive: false,
      isForcedLive: false,
      scheduleTimeline: [],
    };
  }

  // Calculate current seconds from midnight
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const currentSecondsFromMidnight = hours * 3600 + minutes * 60 + seconds;

  const todaySchedule = generateDaySchedule(sortedVideos, 0, currentTime);

  // Find active slot
  let activeSlot = todaySchedule.find(
    (slot) => currentSecondsFromMidnight >= slot.startSeconds && currentSecondsFromMidnight < slot.endSeconds
  );

  let activeIndex = activeSlot ? todaySchedule.indexOf(activeSlot) : 0;
  if (!activeSlot && todaySchedule.length > 0) {
    activeSlot = todaySchedule[0];
    activeIndex = 0;
  }

  const nextSlot = todaySchedule[activeIndex + 1] || todaySchedule[0];

  const currentVideo = activeSlot ? activeSlot.video : sortedVideos[0];
  const nextVideo = nextSlot ? nextSlot.video : sortedVideos[1] || sortedVideos[0];

  const elapsedSeconds = activeSlot
    ? Math.max(0, currentSecondsFromMidnight - activeSlot.startSeconds)
    : 0;

  const duration = currentVideo.duration || 1;
  const clampedElapsed = Math.min(elapsedSeconds, duration);
  const progressPercent = Math.min(100, Math.max(0, (clampedElapsed / duration) * 100));
  const remainingSeconds = Math.max(0, duration - clampedElapsed);

  // Mark live item in schedule
  const markedSchedule = todaySchedule.map((slot, idx) => ({
    ...slot,
    isLiveNow: idx === activeIndex,
  }));

  return {
    currentVideo,
    nextVideo,
    elapsedSeconds: clampedElapsed,
    progressPercent,
    remainingSeconds,
    currentSlotFormattedStart: activeSlot ? activeSlot.startTime : '00:00',
    currentSlotFormattedEnd: activeSlot ? activeSlot.endTime : '00:00',
    nextSlotFormattedStart: nextSlot ? nextSlot.startTime : '00:00',
    isLive: true,
    isForcedLive: false,
    scheduleTimeline: markedSchedule,
  };
}
