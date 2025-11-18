'use client';
import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';
import {  products } from '@/app/lib/mock';
import { useState, useEffect } from 'react';
import { Heading, Text, Button, IconButton, Callout } from '@whop/react/components';
import { useAuth } from '@/app/contexts/AuthContext';
import XIcon from '@/app/components/Icons/X';
import { useRouter } from 'next/navigation';
import Countdown from '@/app/components/Countdown';

interface ExperiencePageProps {
  params: Promise<{ experienceId: string }>;
}

export default function HomePage({ params }: ExperiencePageProps) {
  const router = useRouter();
  const [experienceId, setExperienceId] = useState<string>('');
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [isNavigationProfile, setIsNavigationProfile] = useState<boolean>(false);
  const [paymentId, setPaymentId] = useState<string>();
  
  const { user, isAuthenticated, isLoading } = useAuth();
  
    
    // Extract experienceId from params
    useEffect(() => {
      params.then(({ experienceId }) => setExperienceId(experienceId));
    }, [params]);


      const handleSubmitClick = () => {
        setIsNavigating(true);
        router.push(`/experiences/${experienceId}/submit`);
      };

      const handleProfileClick = () => {
        setIsNavigationProfile(true);
        router.push(`/experiences/${experienceId}/profile`);
      };


  return (
    <div className="min-h-screen bg-blue-2">
      <div className="mx-auto px-16 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="" className='h-12 w-12 rounded-xl object-cover'/>
            <div>
              <Heading as="h1" size="6">
                App Launch
              </Heading>
              <Text as="p" size="3" color="gray">
                The place to launch and discover new Whop apps
              </Text>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  color="orange"
                  size="3"
                  variant="classic"
                  loading={isNavigating}
                  onClick={handleSubmitClick}
                  disabled={!experienceId || isNavigating}
                >
                  Submit App
                </Button>
                {user && (
                  <Button
                    color="gray"
                    size="3"
                    variant="soft"
                    loading={isNavigationProfile}
                    onClick={handleProfileClick}
                    disabled={!experienceId || isNavigationProfile}
                  >
                    My Profile
                  </Button>
                )}
                <IconButton
                  size="3"
                  variant="soft"
                  color='gray'
                  onClick={() => window.open('https://x.com/michaelbrambles', '_blank')}
                >
                  <XIcon color='#fff' size={26}/>
                </IconButton>
              </>
            ) : (
              <div className="text-center">
                <Text as="p" size="2" color="gray" className="mb-2">
                  {isLoading ? 'Checking authentication...' : 'Not authenticated'}
                </Text>
                <Link href="/post">
                  <Button
                    color="gray"
                    size="3"
                    variant="soft"
                    disabled={!isAuthenticated}
                  >
                    Submit App
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <section className="mt-10 max-w-4xl mx-auto" >
          <div className='flex flex-row items-center justify-between mb-4'>
            <div className="flex flex-row items-center gap-2">
              <div className="inline-grid *:[grid-area:1/1]">
                <div className="status status-lg bg-orange-500 animate-ping"></div>
                <div className="status status-lg bg-orange-500"></div>
              </div>
              <Heading as="h2" size="6">Launching Now</Heading>
            </div>
            <div>
              <Text as="p" size="2" weight='semi-bold' align='center'>
                Launch ends in
              </Text>
              <Countdown endDate={'12/12/2025'} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {products.map(p => (
              <Link key={p.id} href={`/experiences/${experienceId}/product/${p.id}`}>
                <ProductCard product={p} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}