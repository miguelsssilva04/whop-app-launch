import { NextRequest, NextResponse } from 'next/server';
import { checkUserAccess } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get('resourceId');

    if (!resourceId) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      );
    }

    const accessResult = await checkUserAccess(resourceId);
    return NextResponse.json(accessResult);
  } catch (error) {
    console.error('Error in /api/auth/check-access:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}