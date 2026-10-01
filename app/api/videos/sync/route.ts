import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const VIDEOS_DIR = 'C:\\Users\\eyupa\\Desktop\\videolar';

function extractMp4Duration(filePath: string): number {
  try {
    const stat = fs.statSync(filePath);
    const fd = fs.openSync(filePath, 'r');
    const bufferSize = Math.min(stat.size, 2 * 1024 * 1024);
    const buffer = Buffer.alloc(bufferSize);
    fs.readSync(fd, buffer, 0, bufferSize, Math.max(0, stat.size - bufferSize));
    fs.closeSync(fd);

    const mvhdIndex = buffer.indexOf('mvhd');
    if (mvhdIndex !== -1) {
      const version = buffer.readUInt8(mvhdIndex + 4);
      let timescale = 0;
      let duration = 0;
      if (version === 0) {
        timescale = buffer.readUInt32BE(mvhdIndex + 16);
        duration = buffer.readUInt32BE(mvhdIndex + 20);
      } else {
        timescale = buffer.readUInt32BE(mvhdIndex + 24);
        duration = Number(buffer.readBigUInt64BE(mvhdIndex + 28));
      }
      if (timescale > 0) {
        return Math.round(duration / timescale);
      }
    }
  } catch (e) {}
  return 60; // fallback duration in seconds
}

export async function GET(request: NextRequest) {
  try {
    if (!fs.existsSync(VIDEOS_DIR)) {
      return NextResponse.json({ error: 'Klasör bulunamadı' }, { status: 404 });
    }

    const files = fs.readdirSync(VIDEOS_DIR).filter((f) => f.toLowerCase().endsWith('.mp4'));

    const videos = files.map((file, idx) => {
      const filePath = path.join(VIDEOS_DIR, file);
      const stat = fs.statSync(filePath);
      const sizeMb = (stat.size / (1024 * 1024)).toFixed(1);
      const duration = extractMp4Duration(filePath);

      const cleanName = file.replace('.mp4', '');
      let category: 'DİZİ' | 'BELGESEL' | 'GECE YAYINI' | 'ÖZEL' | 'KISA FİLM' | 'DENEYSEL' = 'DİZİ';
      if (cleanName.toLowerCase().includes('daha açı')) category = 'BELGESEL';
      else if (cleanName.toLowerCase().includes('final')) category = 'ÖZEL';
      else if (cleanName.toLowerCase().includes('ajan') || cleanName.toLowerCase().includes('sigma')) category = 'GECE YAYINI';

      const encoded = encodeURIComponent(file);

      return {
        id: `desktop-vid-${idx + 1}-${cleanName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`,
        title: cleanName.toUpperCase(),
        originalTitle: file,
        description: `Masaüstü video arşivi: ${file}. SİNYAL TV 24/7 yayın akışında.`,
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1280&q=80',
        videoUrl: `/api/stream/${encoded}`,
        downloadUrl: `/api/download/${encoded}`,
        duration: duration || 60,
        category,
        episode: `Yayın #${idx + 1}`,
        releaseDate: stat.mtime.toISOString().split('T')[0],
        fileSize: `${sizeMb} MB`,
        resolution: '1920 × 1080 (FHD)',
        format: 'MP4 (H.264 / AAC)',
        audioLanguage: 'Türkçe (Stereo)',
        aspectRatio: '16:9',
        broadcastOrder: idx + 1,
        tags: ['masaüstü', cleanName.toLowerCase()],
      };
    });

    return NextResponse.json({
      success: true,
      directory: VIDEOS_DIR,
      totalCount: videos.length,
      videos,
    });
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json({ error: 'Tarama hatası oluştu' }, { status: 500 });
  }
}
