'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Play, ArrowRight, Film, Clock, Tag } from 'lucide-react';
import { useBroadcast } from '@/lib/videoStore';
import { formatDuration } from '@/lib/broadcast';
import { Video } from '@/types/broadcast';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, videos } = useBroadcast();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearchTerm('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const normalized = searchTerm.trim().toLowerCase();

  const results: Video[] = normalized
    ? videos.filter(
        (v) =>
          v.title.toLowerCase().includes(normalized) ||
          v.description.toLowerCase().includes(normalized) ||
          v.category.toLowerCase().includes(normalized) ||
          (v.episode && v.episode.toLowerCase().includes(normalized)) ||
          v.tags.some((t) => t.toLowerCase().includes(normalized))
      )
    : [];

  const handleSelect = (videoId: string) => {
    setIsSearchOpen(false);
    router.push(`/videos/${videoId}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-sm transition-opacity duration-200"
      onClick={() => setIsSearchOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      <div
        className="w-full max-w-2xl bg-[#121214] border border-[#27272A] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#27272A] bg-[#18181B]/70 gap-3">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Yayın adı, kategori, bölüm veya etiket ara... (örn: Bozkır, Gece, Belgesel)"
            className="w-full bg-transparent text-[#F4F4F5] placeholder-zinc-500 text-sm sm:text-base focus:outline-none"
            aria-label="Kanal arama"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-zinc-400 hover:text-zinc-200 rounded"
              title="Temizle"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 text-xs font-mono text-zinc-400 hover:text-zinc-200 bg-[#27272A] rounded border border-zinc-700/60 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Search Results Area */}
        <div className="overflow-y-auto p-3 space-y-2 flex-1">
          {searchTerm === '' ? (
            <div className="py-10 text-center text-zinc-400">
              <Film className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
              <p className="text-sm font-medium text-zinc-300">SİNYAL TV Arşivinde Arama Yapın</p>
              <p className="text-xs text-zinc-500 mt-1">
                Tüm bölümler, kısa filmler, belgeseller ve gece yayınları arasında anında arayın.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {['BELGESEL', 'GECE YAYINI', 'DİZİ', 'DENEYSEL'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSearchTerm(cat.toLowerCase())}
                    className="text-xs px-2.5 py-1 bg-[#18181B] hover:bg-[#202024] text-zinc-300 rounded border border-[#27272A] transition-colors"
                  >
                    #{cat}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-zinc-400">
              <p className="text-sm font-medium text-zinc-300">
                &ldquo;{searchTerm}&rdquo; ile eşleşen yayın bulunamadı.
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Farklı bir anahtar kelime veya kategori deneyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex justify-between">
                <span>Sonuçlar ({results.length})</span>
                <span>Enter veya tıklayarak açın</span>
              </div>
              {results.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleSelect(video.id)}
                  className="group flex items-center gap-3 p-2.5 rounded-md hover:bg-[#1C1C20] border border-transparent hover:border-[#2E2E34] transition-colors cursor-pointer"
                >
                  <div className="relative w-20 h-12 bg-black rounded overflow-hidden shrink-0 border border-zinc-800">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent flex items-center justify-center transition-colors">
                      <Play className="w-4 h-4 text-white opacity-80 group-hover:opacity-100" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-[#202024] text-zinc-300 border border-zinc-700/50 font-mono text-[10px]">
                        {video.category}
                      </span>
                      {video.episode && (
                        <span className="text-[11px] text-zinc-400">{video.episode}</span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-white truncate mt-0.5">
                      {video.title}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      {video.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end text-xs text-zinc-400 font-mono">
                      <span>{formatDuration(video.duration)}</span>
                      <span className="text-[10px] text-zinc-500">{video.resolution.split(' ')[0]}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-200 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#0E0E10] border-t border-[#27272A] flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-[#18181B] text-zinc-400 rounded border border-zinc-700/50 text-[10px] font-mono">
                /
              </kbd>{' '}
              Arama
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-[#18181B] text-zinc-400 rounded border border-zinc-700/50 text-[10px] font-mono">
                ESC
              </kbd>{' '}
              Kapat
            </span>
          </div>
          <Link
            href="/archive"
            onClick={() => setIsSearchOpen(false)}
            className="text-zinc-400 hover:text-zinc-200 transition-colors text-xs inline-flex items-center gap-1"
          >
            Tüm Arşivi Gör &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
