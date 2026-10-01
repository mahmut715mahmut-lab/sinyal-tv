import React from 'react';
import Link from 'next/link';
import { Tv, Radio, Cpu, Film, ShieldCheck, Mail, ArrowRight, Server, FileText } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function AboutPage() {
  return (
    <div className="max-w-[900px] mx-auto space-y-12 py-4">
      {/* Page Header */}
      <div className="space-y-3 pb-6 border-b border-[#202024]">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase">
          <Link href="/" className="hover:text-zinc-200 transition-colors">
            SİNYAL TV
          </Link>
          <span>/</span>
          <span className="text-zinc-300">KANAL HAKKINDA</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          SİNYAL: Bağımsız Dijital Yayıncılık & Video Arşivi
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
          SİNYAL, algoritmik hareketli görüntülerin ve yeni nesil sinematografik çalışmaların günün 24 saati kesintisiz yayınlandığı bağımsız bir dijital televizyon kanalıdır.
        </p>
      </div>

      {/* 1. KANAL NEDİR? */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-mono">
          <span className="text-red-500">01.</span>
          <span>Kanalın Amacı ve Yayın Çerçevesi</span>
        </h2>
        <div className="text-sm sm:text-base text-zinc-300 space-y-3 leading-relaxed">
          <p>
            SİNYAL TV, geleneksel televizyon yayıncılığının kesintisiz akış deneyimini modern dijital video arşivleme prensipleriyle birleştirir. Platform üzerinde yayınlanan tüm yapımlar; yapay sinir ağları, algoritmik görsel sentezleyiciler ve deneysel ses laboratuvarlarında bağımsız olarak üretilmiştir.
          </p>
          <p>
            Burada bir pazarlama vitrini değil; gerçek zamanlı olarak izlenebilen, yayın çizelgesi takip edilebilen ve bölümleri doğrudan indirilebilen yaşayan bir yayın mecrası hedeflenmiştir.
          </p>
        </div>
      </section>

      {/* 2. YAYIN TÜRLERİ VE KUŞAKLAR */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-mono">
          <span className="text-red-500">02.</span>
          <span>Yayın Kuşakları ve Türler</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#121214] border border-[#232326] space-y-2">
            <span className="text-xs font-mono font-bold text-red-400 uppercase">
              BELGESEL KUŞAĞI
            </span>
            <h4 className="text-sm font-semibold text-white">Coğrafi ve Endüstriyel Hafıza</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              İç Anadolu bozkırları, Kaçkar sis hatları ve terkedilmiş sanayi havzalarını konu alan spekülatif belgesel serileri.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#121214] border border-[#232326] space-y-2">
            <span className="text-xs font-mono font-bold text-red-400 uppercase">
              GECE FREKANSI (00:00 - 06:00)
            </span>
            <h4 className="text-sm font-semibold text-white">Monokrom & Şehir Ambiyansı</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Gece yarısı Kadıköy, Ankara sokakları ve karlı demiryolu hatlarının hipnotik ses ve ışık monologları.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#121214] border border-[#232326] space-y-2">
            <span className="text-xs font-mono font-bold text-red-400 uppercase">
              SERİLER & DİZİLER
            </span>
            <h4 className="text-sm font-semibold text-white">Spekülatif Kent Kurguları</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              İstanbul 2084, Hangar İstasyonu ve çok bölümlü tematik anlatı serileri.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#121214] border border-[#232326] space-y-2">
            <span className="text-xs font-mono font-bold text-red-400 uppercase">
              DENEYSEL & TEST KUŞAĞI
            </span>
            <h4 className="text-sm font-semibold text-white">Sinyal Kalibrasyonları</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              CRT monitör parazitleri, mikroskopik mineral kristalleri ve optik kırılma denemeleri.
            </p>
          </div>
        </div>
      </section>

      {/* 3. 24/7 YAYIN MİMARİSİ NASIL ÇALIŞIR? */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-mono">
          <span className="text-red-500">03.</span>
          <span>24/7 Yayın Otomasyonu Nasıl Çalışır?</span>
        </h2>
        <div className="text-sm sm:text-base text-zinc-300 space-y-3 leading-relaxed">
          <p>
            Kanalın yayın akışı, merkezi bir yayın çizelgesi motoru tarafından 24 saatlik döngüler halinde yönetilir. Her video belirli bir yayın başlangıç ve bitiş saatine atanır.
          </p>
          <div className="p-4 rounded-lg bg-[#121214] border border-[#232326] font-mono text-xs text-zinc-300 space-y-2">
            <div className="flex items-center gap-2 text-zinc-400 font-bold">
              <Server className="w-4 h-4 text-red-500" />
              <span>YAYIN TEKNOLOJİSİ DETAYLARI:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 text-[12px]">
              <li>Senkronize 24/7 Zaman Çizelgeleme (Time-of-day deterministic broadcast loop)</li>
              <li>Otomatik sonraki bölüme geçiş ve anlık canlı saat senkronizasyonu</li>
              <li>H.264 / AAC 1080p ve 4K UHD video dağıtımı</li>
              <li>Tarayıcı dostu, düşük bellek ve kaynak tüketen hafif video oynatıcı</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. AÇIK ERİŞİM VE İNDİRME POLİTİKASI */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-mono">
          <span className="text-red-500">04.</span>
          <span>Açık Arşiv ve Doğrudan İndirme</span>
        </h2>
        <div className="text-sm sm:text-base text-zinc-300 space-y-3 leading-relaxed">
          <p>
            SİNYAL TV arşivindeki tüm videolar, araştırmacılar, sanatçılar ve izleyiciler için doğrudan indirilebilir formatta sunulmaktadır. Her video kartında ve detay sayfasında dosya boyutu, çözünürlüğü ve ses formatı şeffaf bir şekilde listelenir.
          </p>
        </div>
      </section>

      {/* 5. İLETİŞİM */}
      <section className="p-6 rounded-lg bg-[#121214] border border-[#232326] space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-400 font-bold">
          <Mail className="w-4 h-4 text-red-500" />
          <span>İLETİŞİM & YAYIN KATKILARI</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          Yeni video önerileri, teknik geri bildirimler veya arşiv işbirlikleri için yayın masasıyla iletişime geçebilirsiniz.
        </p>
        <div className="pt-2 font-mono text-xs text-red-400">
          yayin@sinyal.tv &bull; SİNYAL TV YAYINCILIK A.Ş.
        </div>
      </section>
    </div>
  );
}
