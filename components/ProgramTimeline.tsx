'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Play, Download, Radio, ChevronRight, HardDrive } from 'lucide-react';
import { Video, ScheduleItem } from '@/types/broadcast';
import { generateDaySchedule, formatDuration } from '@/lib/broadcast';
import { useBroadcast } from '@/lib/videoStore';
import { DownloadButton } from '@/components/DownloadButton';

export const ProgramTimeline: React.FC = () => {
  const { videos, isOffline, broadcastState } = useBroadcast();
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);

  // Generate schedule for selected day
  const schedule = generateDaySchedule(videos, selectedDayOffset);

  // Format today / tomorrow dates
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      weekday: 'long',
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Day Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#202024]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDayOffset(0)}
            className={`px-4 py-2 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer ${
              selectedDayOffset === 0
                ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                : 'bg-[#141416] hover:bg-[#1E1E22] text-zinc-400 hover:text-zinc-200 border border-[#27272A]'
            }`}
          >
            BUGÜN ({today.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })})
          </button>

          <button
            onClick={() => setSelectedDayOffset(1)}
            className={`px-4 py-2 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer ${
              selectedDayOffset === 1
                ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                : 'bg-[#141416] hover:bg-[#1E1E22] text-zinc-400 hover:text-zinc-200 border border-[#27272A]'
            }`}
          >
            YARIN ({tomorrow.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
          <span>{formatDate(selectedDayOffset === 0 ? today : tomorrow)}</span>
        </div>
      </div>

      {/* Schedule Table / Timeline */}
      {isOffline ? (
        <div className="py-16 text-center rounded-lg border border-[#232326] bg-[#121214] p-8">
          <Radio className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
          <h4 className="text-base font-semibold text-zinc-300">Yayın Akışı Geçici Olarak Kapalı</h4>
          <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1">
            Kanal şu an bakım / güncelleme modundadır. Kayıtlı tüm programları Video Arşivi sekmesinden izleyebilirsiniz.
          </p>
        </div>
      ) : schedule.length === 0 ? (
        <div className="py-16 text-center rounded-lg border border-[#232326] bg-[#121214] p-8">
          <Clock className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
          <h4 className="text-base font-semibold text-zinc-300">Yayın Akışı Bulunamadı</h4>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
            Program listesinde video bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#1C1C20] border border-[#232326] rounded-lg overflow-hidden bg-[#101012]">
          {schedule.map((item, idx) => {
            const isLive =
              selectedDayOffset === 0 &&
              broadcastState.isLive &&
              broadcastState.currentVideo?.id === item.video.id &&
              broadcastState.currentSlotFormattedStart === item.startTime;

            return (
              <div
                key={item.id}
                className={`relative flex flex-col md:flex-row md:items-center justify-between p-4 gap-4 transition-colors ${
                  isLive
                    ? 'bg-red-950/20 border-l-4 border-l-red-500'
                    : 'hover:bg-[#161619]'
                }`}
              >
                {/* Left: Time & Badges */}
                <div className="flex items-start md:items-center gap-4 min-w-[200px]">
                  {/* Time Slot Badge */}
                  <div className="flex flex-col items-start font-mono">
                    <span
                      className={`text-sm sm:text-base font-bold ${
                        isLive ? 'text-red-400' : 'text-zinc-100'
                      }`}
                    >
                      {item.startTime}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Bitiş: {item.endTime}
                    </span>
                  </div>

                  {/* Status Indicator (LIVE vs Duration) */}
                  {isLive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/90 border border-red-700/80 text-[10px] font-mono font-bold text-red-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-live-pulse" />
                      YAYINDA
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-zinc-400 bg-[#18181B] px-2 py-0.5 rounded border border-[#27272A]">
                      {formatDuration(item.video.duration)}
                    </span>
                  )}
                </div>

                {/* Center: Video Info */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="relative w-20 h-12 rounded bg-black overflow-hidden shrink-0 border border-zinc-800">
                    <img
                      src={item.video.thumbnail}
                      alt={item.video.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">
                        {item.video.category}
                      </span>
                      {item.video.episode && (
                        <span className="text-[11px] text-zinc-500 font-mono">
                          • {item.video.episode}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold text-zinc-100 truncate mt-0.5">
                      <Link
                        href={`/videos/${item.video.id}`}
                        className="hover:text-red-400 transition-colors"
                      >
                        {item.video.title}
                      </Link>
                    </h4>
                    <p className="text-xs text-zinc-400 truncate hidden sm:block mt-0.5">
                      {item.video.description}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2.5 self-end md:self-auto shrink-0">
                  <Link
                    href={`/videos/${item.video.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#18181B] hover:bg-[#222226] text-zinc-300 hover:text-white border border-[#27272A] text-xs font-medium transition-colors"
                  >
                    <span>İzle</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                  </Link>

                  <DownloadButton
                    url={item.video.downloadUrl}
                    filename={`${item.video.id}.mp4`}
                    fileSize={item.video.fileSize}
                    variant="compact"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
