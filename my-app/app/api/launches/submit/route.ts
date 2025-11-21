import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { addAppToNextUpcoming } from '@/app/api/lib/firestore';
import { verifyUserToken } from '@/app/api/utils/verifyUserToken';

export async function POST(request: NextRequest) {
  try {
    const whopUserId = await verifyUserToken();
    if (!whopUserId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }
    

    const body = await request.json();
    const required = ['name', 'description', 'image', 'testAppUrl'];
    for (const k of required) {
      if (!body[k] || (typeof body[k] === 'string' && body[k].trim() === '')) {
        return NextResponse.json({ success: false, error: `${k} is required` }, { status: 400 });
      }
    }

    const providedLaunchId: string | undefined = body.launchId;
    if (providedLaunchId && typeof providedLaunchId !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid launchId' }, { status: 400 });
    }

    try {
      const { launchId, appId } = await addAppToNextUpcoming(
        {
          name: body.name,
          description: body.description,
          image: body.image,
          authorId: whopUserId,
          pageDescription: body.pageDescription,
          category: body.category,
          target: body.target,
          testAppUrl: body.testAppUrl,
        },
        providedLaunchId
      );
      return NextResponse.json({ success: true, launchId, appId });
    } catch (e: any) {
      if (e?.message === 'invalid_launch_status') {
        return NextResponse.json({ success: false, error: 'Cannot submit to open or closed launch' }, { status: 400 });
      }
      if (e?.message === 'launch_not_found') {
        return NextResponse.json({ success: false, error: 'Launch not found' }, { status: 404 });
      }
      throw e;
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to submit app: ' + error }, { status: 500 });
  }
}