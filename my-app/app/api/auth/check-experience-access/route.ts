import { NextRequest, NextResponse } from 'next/server';
import { checkUserAccess } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const experienceId = searchParams.get('experienceId');

    if (!experienceId) {
      return NextResponse.json(
        { error: 'Experience ID is required' },
        { status: 400 }
      );
    }

    const accessResult = await checkUserAccess(experienceId);

    return NextResponse.json(accessResult);
  } catch (error) {
    console.error('Error checking experience access:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}