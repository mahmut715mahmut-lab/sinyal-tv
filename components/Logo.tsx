import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  watermarkMode?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  watermarkMode = false,
}) => {
  const sizeClasses = {
    sm: {
      box: 'w-6 h-6',
      text: 'text-sm font-bold tracking-widest',
      sub: 'text-[9px]',
    },
    md: {
      box: 'w-8 h-8',
      text: 'text-base font-bold tracking-wider',
      sub: 'text-[10px]',
    },
    lg: {
      box: 'w-11 h-11',
      text: 'text-xl font-bold tracking-wider',
      sub: 'text-xs',
    },
  };

  const currentSize = sizeClasses[size];

  if (watermarkMode) {
    return (
      <div className={`flex items-center gap-1.5 select-none opacity-70 hover:opacity-100 transition-opacity ${className}`}>
        <div className="w-5 h-5 bg-white/20 backdrop-blur-sm border border-white/40 rounded flex items-center justify-center">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
        </div>
        <span className="text-white/90 text-xs font-mono font-semibold tracking-widest">
          SİNYAL
        </span>
      </div>
    );
  }

  return (
    <Link
      href="/"
      className={`group flex items-center gap-2.5 transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-md p-1 ${className}`}
      aria-label="SİNYAL TV Ana Sayfa"
    >
      {/* Broadcast Geometric Mark */}
      <div
        className={`${currentSize.box} relative bg-[#18181B] border border-[#27272A] rounded flex items-center justify-center group-hover:border-zinc-500 transition-colors shadow-sm`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-4/5 h-4/5 text-zinc-100"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Stylized Broadcast Aperture / Signal Mast */}
          <rect x="3" y="3" width="18" height="18" rx="2" className="stroke-zinc-400/80" />
          <line x1="12" y1="8" x2="12" y2="16" className="stroke-red-500" strokeWidth="2.5" />
          <line x1="8" y1="12" x2="16" y2="12" className="stroke-zinc-200" strokeWidth="2" />
          <circle cx="12" cy="12" r="1.5" className="fill-red-500 stroke-none" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`${currentSize.text} text-[#F4F4F5] uppercase`}>
            SİNYAL
          </span>
          <span className="text-[10px] px-1 py-0.5 font-mono font-semibold bg-[#27272A] text-zinc-300 rounded border border-[#3F3F46]/50">
            TV
          </span>
        </div>
        {showTagline && (
          <span className={`${currentSize.sub} text-[#A1A1AA] font-normal tracking-tight mt-0.5`}>
            24 Saat Bağımsız Yayın
          </span>
        )}
      </div>
    </Link>
  );
};
