import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const VIDEOS_DIR = 'C:\\Users\\eyupa\\Desktop\\videolar';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;
    const decodedFilename = decodeURIComponent(filename);
    const filePath = path.join(VIDEOS_DIR, decodedFilename);

    if (!fs.existsSync(filePath)) {
      const remoteBase = process.env.NEXT_PUBLIC_VIDEO_BASE_URL;
      if (remoteBase) {
        return NextResponse.redirect(`${remoteBase.replace(/\/$/, '')}/${encodeURIComponent(decodedFilename)}`, 307);
      }
      return new NextResponse('Dosya bulunamadı veya yerel disk ortamında mevcut değil.', { status: 404 });
    }

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
  } catch (error) {
    console.error('Download error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
