import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const VIDEOS_DIR = 'C:\\Users\\eyupa\\Desktop\\videolar';
const GITHUB_RELEASE_BASE = 'https://github.com/mahmut715mahmut-lab/sinyal-tv/releases/download/v1.0-videos';

const EXACT_ASSET_MAP: Record<string, string> = {
  '11 12 13 14 15böümler.mp4': '11.12.13.14.15boumler.mp4',
  '16 17 18 19 20 bölümler.mp4': '16.17.18.19.20.bolumler.mp4',
  '6-7-8-9-10bölümler.mp4': '6-7-8-9-10bolumler.mp4',
  'ajanlar vs sigmalar.mp4': 'ajanlar.vs.sigmalar.mp4',
  'daha açı 2. bölüm.mp4': 'daha.aci.2.bolum.mp4',
  'editli 1 2 3 4 5 bölümler diva.mp4': 'editli.1.2.3.4.5.bolumler.diva.mp4',
  'FİNAL.mp4': 'FINAL.mp4',
  'FINAL.mp4': 'FINAL.mp4',
  'WhatsApp Video 2026-09-30 at 17.31.13.mp4': 'WhatsApp.Video.2026-09-30.at.17.31.13.mp4',
  'daha açı 1. bölüm.mp4': 'WhatsApp.Video.2026-09-30.at.17.31.13.mp4',
};

function getRemoteAssetName(filename: string): string {
  if (EXACT_ASSET_MAP[filename]) {
    return EXACT_ASSET_MAP[filename];
  }
  const turkishCharMap: Record<string, string> = {
    'ö': 'o', 'Ö': 'O',
    'ü': 'u', 'Ü': 'U',
    'ş': 's', 'Ş': 'S',
    'ı': 'i', 'İ': 'I',
    'ğ': 'g', 'Ğ': 'G',
    'ç': 'c', 'Ç': 'C',
  };
  let cleaned = filename;
  for (const [k, v] of Object.entries(turkishCharMap)) {
    cleaned = cleaned.replaceAll(k, v);
  }
  return cleaned.replace(/\s+/g, '.');
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;
    const decodedFilename = decodeURIComponent(filename);
    const filePath = path.join(VIDEOS_DIR, decodedFilename);

    // 1. If running locally and file exists on desktop, stream directly from disk
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      const nodeStream = fs.createReadStream(filePath);
      const webStream = new ReadableStream({
        start(controller) {
          nodeStream.on('data', (chunk) => controller.enqueue(chunk));
          nodeStream.on('end', () => controller.close());
          nodeStream.on('error', (err) => controller.error(err));
        },
        cancel() {
          nodeStream.destroy();
        },
      });

      const safeDownloadName = encodeURIComponent(decodedFilename);

      return new NextResponse(webStream, {
        status: 200,
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Length': stat.size.toString(),
          'Content-Disposition': `attachment; filename="${safeDownloadName}"; filename*=UTF-8''${safeDownloadName}`,
        },
      });
    }

    // 2. If running on Vercel / serverless cloud, redirect directly to CDN download
    const customBase = process.env.NEXT_PUBLIC_VIDEO_BASE_URL;
    let remoteUrl: string;

    if (customBase) {
      remoteUrl = `${customBase.replace(/\/$/, '')}/${encodeURIComponent(decodedFilename)}`;
    } else {
      const assetName = getRemoteAssetName(decodedFilename);
      remoteUrl = `${GITHUB_RELEASE_BASE}/${encodeURIComponent(assetName)}`;
    }

    return NextResponse.redirect(remoteUrl, 307);
  } catch (error) {
    console.error('Download error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
