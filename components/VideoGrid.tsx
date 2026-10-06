'use client';

import React, { useState, useMemo } from 'react';
import { Video, VideoCategory } from '@/types/broadcast';
import { VideoCard } from '@/components/VideoCard';
import { Film, Filter, ArrowUpDown } from 'lucide-react';

interface VideoGridProps {
  videos: Video[];
  title?: string;
  subtitle?: string;
  initialCategory?: VideoCategory;
  showFilters?: boolean;
}

const FILTER_ITEMS = [
  { id: 'TÜMÜ', label: 'TÜMÜ' },
  { id: 'U12 İKSİRİ', label: '🧪 U12 İKSİRİ (1-10)' },
  { id: 'DAHA AÇI', label: '📹 DAHA AÇI (1-3)' },
  { id: 'SİNYAL DİZİ', label: '🎬 SİNYAL DİZİ' },
  { id: 'DİZİ', label: 'DİZİ' },
  { id: 'BELGESEL', label: 'BELGESEL' },
  { id: 'GECE YAYINI', label: 'GECE KUŞAĞI' },
  { id: 'ÖZEL', label: 'ÖZEL' },
];

export const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  title,
  subtitle,
  initialCategory = 'TÜMÜ',
  showFilters = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | string>(initialCategory);
  const [sortBy, setSortBy] = useState<'order' | 'newest' | 'duration' | 'title'>('order');

  const filteredVideos = useMemo(() => {
    let list = [...videos];

    // Filter by category or series
    if (selectedCategory === 'U12 İKSİRİ') {
      list = list.filter((v) => v.id.startsWith('u12-') || v.title.toLowerCase().includes('u12'));
    } else if (selectedCategory === 'DAHA AÇI') {
      list = list.filter((v) => v.id.startsWith('daha-aci') || v.title.toLowerCase().includes('daha açı'));
    } else if (selectedCategory === 'SİNYAL DİZİ') {
      list = list.filter((v) => v.id.startsWith('dizi-') || v.title.toLowerCase().includes('sinyal dizi'));
    } else if (selectedCategory !== 'TÜMÜ') {
      list = list.filter((v) => v.category === selectedCategory);
    }

    // Sort: default is strict sequential episode/broadcast order (1, 2, 3...)
    if (sortBy === 'order') {
      list.sort((a, b) => a.broadcastOrder - b.broadcastOrder);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime() || a.broadcastOrder - b.broadcastOrder);
    } else if (sortBy === 'duration') {
      list.sort((a, b) => b.duration - a.duration);
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title, 'tr', { numeric: true }));
    }

    return list;
  }, [videos, selectedCategory, sortBy]);

  return (
    <div className="w-full space-y-6">
      {/* Optional Header */}
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-[#202024]">
          <div>
            {title && <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h2>}
            {subtitle && <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">{subtitle}</p>}
          </div>

          <span className="text-xs font-mono text-zinc-400">
            Toplam {filteredVideos.length} Yayın
          </span>
        </div>
      )}

      {/* Category Pills & Sorting Bar */}
      {showFilters && (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2">
          {/* Horizontal scrollable category pill list */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1.5 md:pb-0 scrollbar-none">
            {FILTER_ITEMS.map((item) => {
              const active = selectedCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedCategory(item.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-zinc-100 text-zinc-950 font-bold shadow-sm'
                      : 'bg-[#141416] hover:bg-[#1E1E22] text-zinc-400 hover:text-zinc-200 border border-[#27272A]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs text-zinc-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-[11px] font-mono">Sırala:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#141416] border border-[#27272A] rounded px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 cursor-pointer font-mono"
            >
              <option value="order">Bölüm & Akış Sırası (1, 2, 3...)</option>
              <option value="title">Bölüm Adına Göre Sıralı</option>
              <option value="newest">En Yeni Eklenenler</option>
              <option value="duration">En Uzun Süreli</option>
            </select>
          </div>
        </div>
      )}

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <div className="py-16 text-center rounded-lg border border-[#232326] bg-[#121214] p-8">
          <Film className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
          <h4 className="text-base font-semibold text-zinc-300">Bu kategoride yayın bulunamadı</h4>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
            Seçilen filtre için henüz arşiv kaydı bulunmuyor. Diğer kategorileri inceleyebilirsiniz.
          </p>
          <button
            onClick={() => setSelectedCategory('TÜMÜ')}
            className="mt-4 px-3.5 py-1.5 rounded bg-[#1C1C20] hover:bg-[#25252A] text-xs font-semibold text-zinc-200 border border-[#2E2E34] transition-colors cursor-pointer"
          >
            Tüm Yayınları Göster
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredVideos.map((video, index) => (
            <VideoCard key={video.id} video={video} priority={index < 4} />
          ))}
        </div>
      )}
    </div>
  );
};
