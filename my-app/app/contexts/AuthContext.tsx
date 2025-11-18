'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { WhopUser, AccessCheckResult } from '@/app/lib/auth';

interface AuthContextType {
  user: WhopUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  checkAccess: (resourceId: string) => Promise<AccessCheckResult>;
  checkExperienceAccess: (experienceId: string) => Promise<AccessCheckResult>;
  refreshUser: () => Promise<void>;
  experienceId?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: WhopUser | null;
  experienceId?: string;
}

export function AuthProvider({ children, initialUser = null, experienceId }: AuthProviderProps) {
  const [user, setUser] = useState<WhopUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAccess = async (resourceId: string): Promise<AccessCheckResult> => {
    try {
      const response = await fetch(`/api/auth/check-access?resourceId=${resourceId}`);
      if (response.ok) {
        return await response.json();
      }
      return { hasAccess: false, accessLevel: 'no_access' };
    } catch (error) {
      console.error('Error checking access:', error);
      return { hasAccess: false, accessLevel: 'no_access' };
    }
  };

  const checkExperienceAccess = async (experienceId: string): Promise<AccessCheckResult> => {
    try {
      const response = await fetch(`/api/auth/check-experience-access?experienceId=${experienceId}`);
      if (response.ok) {
        return await response.json();
      }
      return { hasAccess: false, accessLevel: 'no_access' };
    } catch (error) {
      console.error('Error checking experience access:', error);
      return { hasAccess: false, accessLevel: 'no_access' };
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  useEffect(() => {
    if (!initialUser) {
      fetchUser();
    }
  }, [initialUser]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    checkAccess,
    checkExperienceAccess,
    refreshUser,
    experienceId,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for checking if user has access to a resource
export function useAccess(resourceId: string | null) {
  const { checkAccess } = useAuth();
  const [accessResult, setAccessResult] = useState<AccessCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!resourceId) {
      setAccessResult(null);
      return;
    }

    const checkResourceAccess = async () => {
      setIsLoading(true);
      try {
        const result = await checkAccess(resourceId);
        setAccessResult(result);
      } catch (error) {
        console.error('Error checking access:', error);
        setAccessResult({ hasAccess: false, accessLevel: 'no_access' });
      } finally {
        setIsLoading(false);
      }
    };

    checkResourceAccess();
  }, [resourceId, checkAccess]);

  return { accessResult, isLoading };
}

// Hook for checking if user has access to an experience
export function useExperienceAccess(experienceId: string | null) {
  const { checkExperienceAccess } = useAuth();
  const [accessResult, setAccessResult] = useState<AccessCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!experienceId) {
      setAccessResult(null);
      return;
    }

    const checkAccess = async () => {
      setIsLoading(true);
      try {
        const result = await checkExperienceAccess(experienceId);
        setAccessResult(result);
      } catch (error) {
        console.error('Error checking experience access:', error);
        setAccessResult({ hasAccess: false, accessLevel: 'no_access' });
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [experienceId, checkExperienceAccess]);

  return { accessResult, isLoading };
}