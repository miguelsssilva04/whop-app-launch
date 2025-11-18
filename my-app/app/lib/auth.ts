import { whopsdk } from './whop-sdk';
import { headers } from 'next/headers';

export interface WhopUser {
  id: string;
  username?: string;
  email?: string;
  profilePicUrl?: string;
}

export interface AccessCheckResult {
  hasAccess: boolean;
  accessLevel: 'customer' | 'admin' | 'no_access';
  user?: WhopUser;
}

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

/**
 * Gets the current authenticated user
 */
export async function getCurrentUser(): Promise<WhopUser | null> {
  try {
    const userId = await verifyUserToken();
    if (!userId) {
      return null;
    }

    // Fetch user details from Whop API
    const user = await whopsdk.users.retrieve(userId);
    return {
      id: user.id,
      username: user.username,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Checks if the current user has access to a specific resource
 * @param resourceId - Company ID (biz_xxxx), Product ID (prod_xxxx), or Experience ID (exp_xxxx)
 */
export async function checkUserAccess(resourceId: string): Promise<AccessCheckResult> {
  try {
    const userId = await verifyUserToken();
    if (!userId) {
      return { hasAccess: false, accessLevel: 'no_access' };
    }

    // Check access using Whop SDK
    const accessResult = await whopsdk.users.checkAccess(
      resourceId,
      { id: userId }
    );

    const user = await getCurrentUser();

    return {
      hasAccess: accessResult.has_access,
      accessLevel: accessResult.access_level as 'customer' | 'admin' | 'no_access',
      user: user || undefined,
    };
  } catch (error) {
    console.error('Error checking user access:', error);
    return { hasAccess: false, accessLevel: 'no_access' };
  }
}

/**
 * Middleware function to protect routes that require authentication
 */
export async function requireAuth(): Promise<WhopUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

/**
 * Middleware function to protect routes that require admin access
 */
export async function requireAdminAccess(companyId: string): Promise<WhopUser> {
  const accessResult = await checkUserAccess(companyId);
  
  if (!accessResult.hasAccess || accessResult.accessLevel !== 'admin') {
    throw new Error('Admin access required');
  }
  
  if (!accessResult.user) {
    throw new Error('User not found');
  }
  
  return accessResult.user;
}

/**
 * Middleware function to protect routes that require customer access
 */
export async function requireCustomerAccess(resourceId: string): Promise<WhopUser> {
  const accessResult = await checkUserAccess(resourceId);
  
  if (!accessResult.hasAccess || (accessResult.accessLevel !== 'customer' && accessResult.accessLevel !== 'admin')) {
    throw new Error('Customer access required');
  }
  
  if (!accessResult.user) {
    throw new Error('User not found');
  }
  
  return accessResult.user;
}