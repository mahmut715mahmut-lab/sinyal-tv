'use client';

import React, { useState } from 'react';
import { Download, Check, Loader2, ArrowDownToLine } from 'lucide-react';

interface DownloadButtonProps {
  url: string;
  filename?: string;
  fileSize?: string;
  format?: string;
  variant?: 'primary' | 'secondary' | 'compact' | 'minimal';
  className?: string;
  label?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  url,
  filename = 'sinyal-video.mp4',
  fileSize,
  format,
  variant = 'primary',
  className = '',
  label = 'VİDEOYU İNDİR',
}) => {
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'completed'>('idle');

  const handleDownload = async (e: React.MouseEvent) => {
    // If completed or already downloading, let normal anchor trigger
    if (downloadState === 'downloading') return;

    setDownloadState('downloading');

    try {
      // Attempt clean fetch & blob download
      const response = await fetch(url, { mode: 'cors' });
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename || 'sinyal-video.mp4';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

        setDownloadState('completed');
        setTimeout(() => setDownloadState('idle'), 3500);
        return;
      }
    } catch (err) {
      // If CORS or fetch fails, fallback to direct anchor click
      console.log('Direct download fallback utilized');
    }

    // Direct fallback
    const directLink = document.createElement('a');
    directLink.href = url;
    directLink.download = filename || 'sinyal-broadcast.mp4';
    directLink.target = '_blank';
    directLink.rel = 'noopener noreferrer';
    document.body.appendChild(directLink);
    directLink.click();
    document.body.removeChild(directLink);

    setDownloadState('completed');
    setTimeout(() => setDownloadState('idle'), 3500);
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleDownload}
        disabled={downloadState === 'downloading'}
        aria-label={`${label} (${fileSize || 'MP4'})`}
        title={`İndir: ${filename}`}
        className={`inline-flex items-center justify-center p-2 rounded-md bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] hover:border-zinc-500 text-zinc-200 text-xs transition-colors duration-200 cursor-pointer disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${className}`}
      >
        {downloadState === 'downloading' ? (
          <Loader2 className="w-4 h-4 animate-spin text-zinc-300" />
        ) : downloadState === 'completed' ? (
          <Check className="w-4 h-4 text-emerald-400" />
        ) : (
          <Download className="w-4 h-4 text-zinc-300" />
        )}
      </button>
    );
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleDownload}
        disabled={downloadState === 'downloading'}
        className={`inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer py-1 px-2 rounded hover:bg-zinc-800/60 ${className}`}
      >
        {downloadState === 'downloading' ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
        ) : downloadState === 'completed' ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Download className="w-3.5 h-3.5" />
        )}
        <span>{downloadState === 'completed' ? 'İndirildi' : fileSize ? `İndir (${fileSize})` : 'İndir'}</span>
      </button>
    );
  }

  if (variant === 'secondary') {
    return (
      <button
        onClick={handleDownload}
        disabled={downloadState === 'downloading'}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[#18181B] hover:bg-[#202024] border border-[#27272A] hover:border-zinc-500 text-zinc-100 text-sm font-medium transition-colors duration-200 cursor-pointer disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${className}`}
      >
        {downloadState === 'downloading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
            <span>İndiriliyor...</span>
          </>
        ) : downloadState === 'completed' ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span>İndirme Tamamlandı</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4 text-zinc-300" />
            <span>{label}</span>
            {fileSize && <span className="text-xs text-zinc-400 font-normal">({fileSize})</span>}
          </>
        )}
      </button>
    );
  }

  // Primary variant
  return (
    <button
      onClick={handleDownload}
      disabled={downloadState === 'downloading'}
      className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${className}`}
    >
      {downloadState === 'downloading' ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
          <span>İndiriliyor...</span>
        </>
      ) : downloadState === 'completed' ? (
        <>
          <Check className="w-4 h-4 text-emerald-600" />
          <span>İndirme Tamamlandı</span>
        </>
      ) : (
        <>
          <ArrowDownToLine className="w-4 h-4 text-zinc-900" />
          <span>{label}</span>
          {fileSize && (
            <span className="text-xs font-normal text-zinc-700 bg-zinc-200/80 px-1.5 py-0.5 rounded">
              {fileSize}
            </span>
          )}
        </>
      )}
    </button>
  );
};
