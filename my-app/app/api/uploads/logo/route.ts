import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { storage } from '@/app/api/lib/firebaseAdmin';
import { verifyUserToken } from '@/app/api/utils/verifyUserToken';
import { v4 as uuidv4 } from 'uuid';

function parseDataUrl(dataUrl: string) {
  const match = /^data:(.*?);base64,(.*)$/.exec(dataUrl);
  if (!match) return null;
  return { mime: match[1], base64: match[2] };
}

export async function POST(request: NextRequest) {
  try {
    const whopUserId = await verifyUserToken();
    if (!whopUserId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const dataUrl: string | undefined = body.dataUrl;
    if (!dataUrl || typeof dataUrl !== 'string') {
      return NextResponse.json({ success: false, error: 'dataUrl is required' }, { status: 400 });
    }

    const parsed = parseDataUrl(dataUrl);
    if (!parsed) {
      return NextResponse.json({ success: false, error: 'Invalid dataUrl' }, { status: 400 });
    }

    const buffer = Buffer.from(parsed.base64, 'base64');
    const maxBytes = 1 * 1024 * 1024;
    if (buffer.length > maxBytes) {
      return NextResponse.json({ success: false, error: 'Image exceeds 1MB limit' }, { status: 400 });
    }

    const id = uuidv4();
    const filePath = `logos/${whopUserId}/${id}.webp`;
    const token = uuidv4();
    const file = storage.file(filePath);
    await file.save(buffer, {
      contentType: 'image/webp',
      resumable: false,
      metadata: { metadata: { firebaseStorageDownloadTokens: token }, cacheControl: 'public,max-age=31536000' },
    });
    const encodedPath = encodeURIComponent(filePath);
    const bucketName = storage.name;
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media&token=${token}`;
    return NextResponse.json({ success: true, url, path: filePath });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to upload logo' }, { status: 500 });
  }
}