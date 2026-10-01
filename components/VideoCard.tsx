'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Download, Clock, Calendar, Check } from 'lucide-react';
import { Video } from '@/types/broadcast';
import { formatDuration } from '@/lib/broadcast';
import { DownloadButton } from '@/components/DownloadButton';

interface VideoCardProps {
  video: Video;
  priority?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, priority = false }) => {
  return (
    <div className="group flex flex-col bg-[#121214] hover:bg-[#161619] border border-[#232326] hover:border-[#383840] rounded-lg overflow-hidden transition-all duration-200">
      {/* Thumbnail Area with 16:9 aspect ratio */}
      <Link
        href={`/videos/${video.id}`}
        className="relative aspect-video w-full bg-black overflow-hidden block"
        aria-label={`${video.title} yayınını izle`}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />

        {/* Hover Dark Overlay & Center Play Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center text-white shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-200">
            <Play className="w-4 h-4 fill-white translate-x-0.5" />
          </div>
        </div>

        {/* Category Badge (Top Left) */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-white/10 text-[10px] font-mono font-semibold text-zinc-200 uppercase tracking-wider">
            {video.category}
          </span>
        </div>

        {/* Duration Badge (Bottom Right) */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          <span className="px-2 py-0.5 rounded bg-black/85 backdrop-blur-sm border border-white/10 text-[11px] font-mono text-white">
            {formatDuration(video.duration)}
          </span>
        </div>

        {/* Resolution Badge (Bottom Left) */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className="px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-zinc-300">
            {video.resolution.split(' ')[0]}
          </span>
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Episode Info & Release Date */}
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-zinc-400 mb-1">
            <span>{video.episode || 'Özel Gösterim'}</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {video.releaseDate}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-zinc-100 group-hover:text-white line-clamp-1 tracking-tight">
            <Link href={`/videos/${video.id}`} className="hover:text-red-400 transition-colors">
              {video.title}
            </Link>
          </h3>

          {/* Short Description */}
          <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
            {video.description}
          </p>
        </div>

        {/* Footer Actions: Watch Link & Download Button */}
        <div className="pt-3 border-t border-[#1E1E22] flex items-center justify-between gap-2">
          <Link
            href={`/videos/${video.id}`}
            className="text-xs font-semibold text-zinc-300 group-hover:text-white hover:underline transition-colors flex items-center gap-1"
          >
            <span>Yayını İzle</span>
            <span className="text-zinc-500">&rarr;</span>
          </Link>

          <DownloadButton
            url={video.downloadUrl}
            filename={`${video.id}.mp4`}
            fileSize={video.fileSize}
            variant="compact"
          />
        </div>
      </div>
    </div>
  );
};
