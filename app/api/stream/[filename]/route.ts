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
  '1. bölüm U12 İKSİRİ.mp4': '1.bolum.U12.IKSIRI.mp4',
  '2. bölüm U12 İKSİRİ.mp4': '2.bolum.U12.IKSIRI.mp4',
  '3. bölüm U12 İKSİRİ.mp4': '3.bolum.U12.IKSIRI.mp4',
  '4. bölüm U12 İKSİRİ.mp4': '4.bolum.U12.IKSIRI.mp4',
  '5. bölüm U12 İKSİRİ.mp4': '5.bolum.U12.IKSIRI.mp4',
  '6. bölüm U12 İKSİRİ.mp4': '6.bolum.U12.IKSIRI.mp4',
  '7. bölüm U12 İKSİRİ.mp4': '7.bolum.U12.IKSIRI.mp4',
  '8. bölüm U12 İKSİRİ.mp4': '8.bolum.U12.IKSIRI.mp4',
  '9. bölüm U12 İKSİRİ.mp4': '9.bolum.U12.IKSIRI.mp4',
  '10. bölüm U12 İKSİRİ.mp4': '10.bolum.U12.IKSIRI.mp4',
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
    const localFilePath = path.join(VIDEOS_DIR, decodedFilename);

    // 1. If running locally and file exists on desktop, stream directly from disk
    if (fs.existsSync(localFilePath)) {
      const stat = fs.statSync(localFilePath);
      const fileSize = stat.size;
      const range = request.headers.get('range');

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize || end >= fileSize) {
          return new NextResponse(null, {
            status: 416,
            headers: {
              'Content-Range': `bytes */${fileSize}`,
            },
          });
        }

        const chunkSize = end - start + 1;
        const nodeStream = fs.createReadStream(localFilePath, { start, end });
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

        return new NextResponse(webStream, {
          status: 206,
          headers: {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize.toString(),
            'Content-Type': 'video/mp4',
          },
        });
      }

      // Full local stream
      const nodeStream = fs.createReadStream(localFilePath);
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

      return new NextResponse(webStream, {
        status: 200,
        headers: {
          'Content-Length': fileSize.toString(),
          'Content-Type': 'video/mp4',
          'Accept-Ranges': 'bytes',
        },
      });
    }

    // 2. If running on Vercel / serverless cloud, stream from GitHub Releases CDN
    const customBase = process.env.NEXT_PUBLIC_VIDEO_BASE_URL;
    let remoteUrl: string;

    if (customBase) {
      remoteUrl = `${customBase.replace(/\/$/, '')}/${encodeURIComponent(decodedFilename)}`;
    } else {
      const assetName = getRemoteAssetName(decodedFilename);
      remoteUrl = `${GITHUB_RELEASE_BASE}/${encodeURIComponent(assetName)}`;
    }

    const range = request.headers.get('range');
    const fetchHeaders: HeadersInit = {};
    if (range) {
      fetchHeaders['Range'] = range;
    }

    const upstreamRes = await fetch(remoteUrl, {
      headers: fetchHeaders,
      redirect: 'follow',
    });

    if (!upstreamRes.ok && upstreamRes.status !== 206) {
      return NextResponse.redirect(remoteUrl, 307);
    }

    const resHeaders = new Headers();
    resHeaders.set('Content-Type', 'video/mp4');
    resHeaders.set('Accept-Ranges', 'bytes');
    resHeaders.set('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');

    const contentRange = upstreamRes.headers.get('content-range');
    if (contentRange) {
      resHeaders.set('Content-Range', contentRange);
    }

    const contentLength = upstreamRes.headers.get('content-length');
    if (contentLength) {
      resHeaders.set('Content-Length', contentLength);
    }

    return new NextResponse(upstreamRes.body, {
      status: upstreamRes.status === 206 ? 206 : 200,
      headers: resHeaders,
    });
  } catch (error) {
    console.error('Video streaming error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
