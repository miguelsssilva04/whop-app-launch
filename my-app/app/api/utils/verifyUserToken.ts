import { whopsdk } from '@/app/lib/whop-sdk';
import { headers } from 'next/headers';


/**
 * Verifies the JWT token from the x-whop-user-token header
 * Returns the user ID if valid, null if invalid or missing
 */
export async function verifyUserToken(): Promise<string | null> {
  try {

    // Use Whop SDK to verify the JWT token
    const { userId } = await whopsdk.verifyUserToken(await headers());
    return userId;
  } catch (error) {
    console.error('Error verifying user token:', error);
    return null;
  }
}