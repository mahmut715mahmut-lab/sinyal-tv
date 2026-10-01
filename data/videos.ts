import { Video } from '@/types/broadcast';

const VIDEO_BASE = process.env.NEXT_PUBLIC_VIDEO_BASE_URL || '';

function videoStreamUrl(filename: string): string {
  if (VIDEO_BASE) {
    return `${VIDEO_BASE}/${encodeURIComponent(filename)}`;
  }
  return `/api/stream/${encodeURIComponent(filename)}`;
}

function videoDownloadUrl(filename: string): string {
  if (VIDEO_BASE) {
    return `${VIDEO_BASE}/${encodeURIComponent(filename)}`;
  }
  return `/api/download/${encodeURIComponent(filename)}`;
}

export const initialVideos: Video[] = [
  {
    id: 'dizi-bolum-01-05',
    title: 'SİNYAL DİZİ: Bölüm 1 - 5 [Özel Kurgu]',
    originalTitle: 'editli 1 2 3 4 5 bölümler diva.mp4',
    description:
      'Dizinin ilk 5 bölümünü içeren özel kurgulanmış açılış bloğu. Karakterlerin ve yapay zekâ kurgusal evreninin başlangıç anlatısı.',
    longDescription:
      'Dizinin ilk 5 bölümünü bir araya getiren bu özel yayın kurgusu, hikâyenin başlangıç anlarını ve ana çatışma eksenini sunuyor. Yüksek çözünürlüklü dijital render ve özel ses miksajı ile hazırlanmıştır.',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1280&q=80',
    videoUrl: videoStreamUrl('editli 1 2 3 4 5 bölümler diva.mp4'),
    downloadUrl: videoDownloadUrl('editli 1 2 3 4 5 bölümler diva.mp4'),
    duration: 54,
    category: 'DİZİ',
    episode: 'Bölüm 01 - 05',
    season: 1,
    releaseDate: '2026-09-27',
    fileSize: '123.7 MB',
    resolution: '1920 × 1080 (FHD)',
    format: 'MP4 (H.264 / AAC Stereo)',
    audioLanguage: 'Türkçe (Orijinal Dublaj & Müzik)',
    aspectRatio: '16:9',
    broadcastOrder: 1,
    directorNotes: 'Masaüstü video arşivi kaynaklı orijinal kurgu dosyası.',
    tags: ['dizi', 'bölüm 1-5', 'sinyal', 'özel kurgu'],
    featured: true,
  },
  {
    id: 'dizi-bolum-06-10',
    title: 'SİNYAL DİZİ: Bölüm 6 - 10',
    originalTitle: '6-7-8-9-10bölümler.mp4',
    description:
      '6, 7, 8, 9 ve 10. bölümleri kapsayan devam serisi. Olayların derinleştiği ve yeni karakterlerin dahil olduğu orta kuşak yayını.',
    longDescription:
      'Dizinin ikinci çeyreğinde tansiyon yükseliyor. 6-10 bölümleri arasındaki kesintisiz akış, algoritmik hareketli görüntülerin dinamizmini ekranlara taşıyor.',
    thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1280&q=80',
    videoUrl: videoStreamUrl('6-7-8-9-10bölümler.mp4'),
    downloadUrl: videoDownloadUrl('6-7-8-9-10bölümler.mp4'),
    duration: 48,
    category: 'DİZİ',
    episode: 'Bölüm 06 - 10',
    season: 1,
    releaseDate: '2026-09-27',
    fileSize: '110.1 MB',
    resolution: '1920 × 1080 (FHD)',
    format: 'MP4 (H.264 / AAC Stereo)',
    audioLanguage: 'Türkçe (Orijinal Ses)',
    aspectRatio: '16:9',
    broadcastOrder: 2,
    directorNotes: 'Yerel video arşivi doğrudan yayına aktarılmıştır.',
    tags: ['dizi', 'bölüm 6-10', 'akış', 'sinyal'],
    featured: false,
  },
  {
    id: 'dizi-bolum-11-15',
    title: 'SİNYAL DİZİ: Bölüm 11 - 15',
    originalTitle: '11 12 13 14 15böümler.mp4',
    description:
      '11 ile 15. bölümler arası dramatik düğüm noktaları ve aksiyon sekansları.',
    longDescription:
      'Hikâyenin doruk noktasına yaklaştığı 11-15. bölümler bloğu. Hızlı tempolu geçişler ve özel görsel efektler içermektedir.',
    thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1280&q=80',
    videoUrl: videoStreamUrl('11 12 13 14 15böümler.mp4'),
    downloadUrl: videoDownloadUrl('11 12 13 14 15böümler.mp4'),
    duration: 60,
    category: 'DİZİ',
    episode: 'Bölüm 11 - 15',
    season: 1,
    releaseDate: '2026-09-27',
    fileSize: '115.3 MB',
    resolution: '1920 × 1080 (FHD)',
    format: 'MP4 (H.264 / AAC Stereo)',
    audioLanguage: 'Türkçe (Stereo)',
    aspectRatio: '16:9',
    broadcastOrder: 3,
    directorNotes: 'Ses miksajı ve renk kalibrasyonu tamamlanmış ana yayın kopyası.',
    tags: ['dizi', 'bölüm 11-15', 'aksiyon'],
    featured: false,
  },
  {
    id: 'dizi-bolum-16-20',
    title: 'SİNYAL DİZİ: Bölüm 16 - 20',
    originalTitle: '16 17 18 19 20 bölümler.mp4',
    description:
      'Final öncesi son 5 bölüm. Büyük çözülmenin eşiğindeki kırılma anları ve görsel doruk noktası.',
    longDescription:
      'Sezon finaline giden yoldaki en kritik 5 bölüm. Karakterlerin yüzleştiği ve çatışmanın zirveye ulaştığı blok yayını.',
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1280&q=80',
    videoUrl: videoStreamUrl('16 17 18 19 20 bölümler.mp4'),
    downloadUrl: videoDownloadUrl('16 17 18 19 20 bölümler.mp4'),
    duration: 65,
    category: 'DİZİ',
    episode: 'Bölüm 16 - 20',
    season: 1,
    releaseDate: '2026-09-27',
    fileSize: '148.8 MB',
    resolution: '1920 × 1080 (FHD)',
    format: 'MP4 (H.264 / AAC Stereo)',
    audioLanguage: 'Türkçe (Stereo)',
    aspectRatio: '16:9',
    broadcastOrder: 4,
    directorNotes: 'Final öncesi yüksek tempolu bölüm bloğu.',
    tags: ['dizi', 'bölüm 16-20', 'dram'],
    featured: false,
  },
  {
    id: 'dizi-buyuk-final',
    title: 'BÜYÜK FİNAL: Sezon Sonu Özel Gösterimi',
    originalTitle: 'FİNAL.mp4',
    description:
      'Sezonun nefes kesen büyük finali. Tüm soruların yanıt bulduğu ve hikâyenin sonuçlandığı epik kapanış bölümü.',
    longDescription:
      'SİNYAL TV ekranlarında merakla beklenen Büyük Sezon Finali. Yüksek çözünürlüklü görsel kompozisyonlar ve sinematik ses tasarımı eşliğinde sezonun son yayını.',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1280&q=80',
    videoUrl: videoStreamUrl('FİNAL.mp4'),
    downloadUrl: videoDownloadUrl('FİNAL.mp4'),
    duration: 79,
    category: 'ÖZEL',
    episode: 'Büyük Final',
    season: 1,
    releaseDate: '2026-09-27',
    fileSize: '158.6 MB',
    resolution: '1920 × 1080 (FHD)',
    format: 'MP4 (H.264 / AAC High)',
    audioLanguage: 'Türkçe (Sinematik Surround & Dublaj)',
    aspectRatio: '16:9',
    broadcastOrder: 5,
    directorNotes: 'Sezon 1 Büyük Finali - Özel Arşiv Master Kopyası.',
    tags: ['final', 'sezon sonu', 'özel', 'sinyal'],
    featured: true,
  },
  {
    id: 'daha-aci-bolum-1',
    title: 'Daha Açı: Bölüm 1 [Geniş Perspektif]',
    originalTitle: 'WhatsApp Video 2026-09-30 at 17.31.13.mp4',
    description:
      'Geniş açılı sinematografi ve görsel kompozisyon denemeleri üzerine kurgulanan belgesel serisinin ilk bölümü.',
    longDescription:
      'Daha Açı serisi, farklı görsel perspektifler ve yapay zekâ destekli geniş açı kadrajlarının anlatı üzerindeki etkilerini araştırıyor. 1. Bölüm, geniş alan kompozisyonlarına odaklanıyor.',
    thumbnail: '/thumbnails/daha-aci-bolum-1.jpg',
    videoUrl: videoStreamUrl('WhatsApp Video 2026-09-30 at 17.31.13.mp4'),
    downloadUrl: videoDownloadUrl('WhatsApp Video 2026-09-30 at 17.31.13.mp4'),
    duration: 60,
    category: 'BELGESEL',
    episode: 'Bölüm 01',
    season: 1,
    releaseDate: '2026-09-30',
    fileSize: '9.1 MB',
    resolution: '1920 × 1080 (FHD)',
    format: 'MP4 (H.264 / AAC 320kbps)',
    audioLanguage: 'Türkçe (Anlatıcı & Ambiyans)',
    aspectRatio: '16:9',
    broadcastOrder: 6,
    directorNotes: 'WhatsApp Video 2026-09-30 at 17.31.13.mp4 kaynağından aktarılmıştır.',
    tags: ['daha açı', 'belgesel', 'perspektif', 'bölüm 1'],
    featured: true,
  },
  {
    id: 'daha-aci-bolum-2',
    title: 'Daha Açı: Bölüm 2 [Derinlik Analizleri]',
    originalTitle: 'daha açı 2. bölüm.mp4',
    description:
      'Serinin ikinci bölümünde derinlik, odak geçişleri ve atmosferik katmanlar mercek altına alınıyor.',
    longDescription:
      'Daha Açı serisinin ikinci bölümü; kadraj içi derinlik, ışık oyunları ve mikro-detayların görsel anlatıya katkısını irdeliyor.',
    thumbnail: '/thumbnails/daha-aci-bolum-2.png',
    videoUrl: videoStreamUrl('daha açı 2. bölüm.mp4'),
    downloadUrl: videoDownloadUrl('daha açı 2. bölüm.mp4'),
    duration: 93,
    category: 'BELGESEL',
    episode: 'Bölüm 02',
    season: 1,
    releaseDate: '2026-09-30',
    fileSize: '126.4 MB',
    resolution: '1920 × 1080 (FHD)',
    format: 'MP4 (H.264 / AAC 320kbps)',
    audioLanguage: 'Türkçe (Anlatıcı & Ses Tasarımı)',
    aspectRatio: '16:9',
    broadcastOrder: 7,
    directorNotes: 'Farklı odak uzaklıkları ve derinlik simülasyonları.',
    tags: ['daha açı', 'belgesel', 'derinlik', 'bölüm 2'],
    featured: false,
  },
  {
    id: 'ajanlar-vs-sigmalar',
    title: 'Ajanlar vs Sigmalar: Gece Kuşağı',
    originalTitle: 'ajanlar vs sigmalar.mp4',
    description:
      'Gece kuşağının dinamik ve enerjik görsel kurgusu. Ajanlar ve bağımsız karakterler arasındaki tempolu çatışma.',
    longDescription:
      'Gece yayınına özel olarak hazırlanan bu tempolu kısa metraj, hızlı montaj ve ritmik ses kurgusuyla öne çıkıyor.',
    thumbnail: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1280&q=80',
    videoUrl: videoStreamUrl('ajanlar vs sigmalar.mp4'),
    downloadUrl: videoDownloadUrl('ajanlar vs sigmalar.mp4'),
    duration: 80,
    category: 'GECE YAYINI',
    episode: 'Gece Kuşağı Özel',
    releaseDate: '2026-10-01',
    fileSize: '48.7 MB',
    resolution: '1920 × 1080 (FHD)',
    format: 'MP4 (H.264 / AAC)',
    audioLanguage: 'Türkçe (Ritmik Ses & Diyalog)',
    aspectRatio: '16:9',
    broadcastOrder: 8,
    directorNotes: 'Gece kuşağı için optimize edilmiş dinamik montaj.',
    tags: ['ajanlar', 'sigmalar', 'gece yayını', 'aksiyon'],
    featured: true,
  },
];

