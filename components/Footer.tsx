import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#1F1F23] bg-[#09090B] text-zinc-400 py-10 mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#18181B]">
          <div className="flex flex-col gap-2">
            <Logo size="sm" showTagline={true} />
            <p className="text-xs text-zinc-500 max-w-md mt-1">
              SİNYAL TV, algoritmik hareketli görüntülerin ve yeni medya sinematografisinin kesintisiz 24/7 yayınlandığı bağımsız dijital yayın ağıdır.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium">
            <Link href="/" className="text-zinc-400 hover:text-zinc-200 transition-colors">
              Canlı Yayın
            </Link>
            <Link href="/program" className="text-zinc-400 hover:text-zinc-200 transition-colors">
              Yayın Akışı (TV Guide)
            </Link>
            <Link href="/archive" className="text-zinc-400 hover:text-zinc-200 transition-colors">
              Video Arşivi
            </Link>
            <Link href="/about" className="text-zinc-400 hover:text-zinc-200 transition-colors">
              Kanal Hakkında
            </Link>
            <Link href="/admin" className="text-zinc-400 hover:text-zinc-200 transition-colors">
              Yayın Yönetimi
            </Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-3">
            <span>&copy; {new Date().getFullYear()} SİNYAL TV YAYINCILIK A.Ş.</span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <span className="hidden sm:inline">TÜM HAKLARI SAKLIDIR</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-500">
            <span>FREKANS: CH 09 // STREAM-IP</span>
            <span>H.264 / AAC STEREO</span>
            <span className="inline-flex items-center gap-1 text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              SİNYAL AKTİF
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
