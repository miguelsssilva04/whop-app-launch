'use client';
import { useState, useMemo, useEffect } from 'react';
import { Button, Card , Heading, Text, Spinner, IconButton } from '@whop/react/components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useExperienceAccess } from '@/app/contexts/AuthContext';
import XIcon from '@/app/components/Icons/X';
import CardCheckoutDemo from '@/app/components/CardCheckoutDemo';


interface ExperiencePageProps {
  params: Promise<{ experienceId: string }>;
}

export default function JobsPage({ params }: ExperiencePageProps) {
  const [experienceId, setExperienceId] = useState<string>('');
  const [paymentId, setPaymentId] = useState<string>();

  
  // Extract experienceId from params
  useEffect(() => {
    params.then(({ experienceId }) => setExperienceId(experienceId));
  }, [params]);


  const { user, isAuthenticated, isLoading } = useAuth();
  const { accessResult, isLoading: isCheckingAccess } = useExperienceAccess(experienceId);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);
  

  

  useEffect(() => {
    try {;
      setIsLoadingJobs(false);
    } catch {}
  }, []);

  

  


  // Show loading state while checking access or loading jobs
  if (isCheckingAccess || !experienceId || isLoadingJobs) {
    return (
      <div className="min-h-screen bg-blue-2 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <Spinner size="4" className="mt-4" />
          <Text as="p" size="3" color="gray" className="mt-4">
            {isLoadingJobs ? 'Loading {whathever your app is showing}...' : 'Loading'}
          </Text>
        </div>
      </div>
    );
  }

  // Show access denied if user doesn't have access
  if (accessResult && !accessResult.hasAccess) {
    return (
      <div className="min-h-screen bg-blue-2 flex items-center justify-center">
        <div className="text-center">
          <Heading as="h1" size="6" color="gray">
            Access Denied
          </Heading>
          <Text as="p" size="3" color="gray" className="mt-4">
            You don't have access to this experience. Please check your membership status.
          </Text>
        </div>
      </div>
    );
  }

  // Show error state if jobs failed to load
  if (jobsError) {
    return (
      <div className="min-h-screen bg-blue-2 flex items-center justify-center">
        <div className="text-center">
          <Heading as="h1" size="6" color="gray">
            Error Loading Jobs
          </Heading>
          <Text as="p" size="3" color="gray" className="mt-4">
            {jobsError}
          </Text>
          <Button
            variant="classic"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-2">
      <div className=" mx-auto px-16 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <Heading as="h1" size="6" color="gray">
              Boilerplate
            </Heading>
            <Text as="p" size="6" >
              Hello, {user?.username || 'User'}!
            </Text>
          </div>
          <div className="flex items-center gap-3">
              <>
                <IconButton
                  size="3"
                  variant="soft"
                  color='gray'
                  onClick={() => window.open('https://x.com/michaelbrambles', '_blank')}
                >
                  <XIcon size={24} color="white" />
                </IconButton>
              </>
          </div>
        </div> 
        <CardCheckoutDemo experienceId={experienceId} userId={user?.id || undefined} onSuccess={(rid) => setPaymentId(rid)} />
      </div>
    </div>
  );
}