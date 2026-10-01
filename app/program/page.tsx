'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Radio, Clock, Film, ArrowLeft } from 'lucide-react';
import { ProgramTimeline } from '@/components/ProgramTimeline';
import { useBroadcast } from '@/lib/videoStore';

export default function ProgramPage() {
  const { broadcastState, isOffline } = useBroadcast();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#202024]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase mb-1">
            <Link href="/" className="hover:text-zinc-200 transition-colors">
              SİNYAL TV
            </Link>
            <span>/</span>
            <span className="text-zinc-300">YAYIN AKIŞI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Yayın Akışı &bull; TV Rehberi
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            SİNYAL TV 24 saatlik kesintisiz yayın çizelgesi. Günün her saati yayınlanan belgesel, dizi ve deneysel görsel kayıtların tam listesi.
          </p>
        </div>

        {/* Current Live Badge */}
        {!isOffline && broadcastState.currentVideo && (
          <div className="flex items-center gap-3 p-3 rounded-md bg-[#141416] border border-[#27272A] self-start md:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-live-pulse" />
            <div className="flex flex-col text-xs font-mono">
              <span className="text-zinc-400 text-[10px] uppercase">ŞU ANDA YAYINDA:</span>
              <span className="text-zinc-100 font-bold max-w-[200px] truncate">
                {broadcastState.currentVideo.title}
              </span>
            </div>
            <Link
              href="/"
              className="ml-2 text-xs text-red-400 hover:text-red-300 font-semibold underline underline-offset-2"
            >
              Canlı İzle
            </Link>
          </div>
        )}
      </div>

      {/* Main Program Timeline */}
      <ProgramTimeline />
    </div>
  );
}
