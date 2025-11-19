"use client";
import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';
import Countdown from '@/app/components/Countdown';
import { Heading, Text, Button, Card, Separator } from '@whop/react/components';
import { userProducts } from '@/app/lib/mock';
import { useEffect, useState } from 'react';
import RocketLaunchDuotone from '@/app/components/Icons/RocketLaunchDuotone';
import { ArrowUpCircleDuoTone } from '@/app/components/Icons/ArrowUpCircleDuoTone';
import DownloadDuotone from '@/app/components/Icons/DownloadDuotone';

interface ProfilePageProps {
  params: Promise<{ experienceId: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [experienceId, setExperienceId] = useState<string>('');

  useEffect(() => {
    params.then(({ experienceId }) => setExperienceId(experienceId));
  }, [params]);

  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;

  const launchingNow = userProducts.filter(p => {
    if (!p.launchEndDate) return false;
    const end = new Date(p.launchEndDate).getTime();
    const diff = end - now;
    return diff > 0 && diff <= sevenDays;
  });

  const futureLaunches = userProducts.filter(p => {
    if (!p.launchEndDate) return false;
    const end = new Date(p.launchEndDate).getTime();
    const diff = end - now;
    return diff > sevenDays;
  });

  const pastLaunches = userProducts.filter(p => {
    if (!p.launchEndDate) return true;
    const end = new Date(p.launchEndDate).getTime();
    return end <= now;
  });

  const launchesWithDate = userProducts.filter(p => p.launchEndDate);
  const totalLaunches = launchesWithDate.length || userProducts.length;
  const totalUpvotes = userProducts.reduce((sum, p) => sum + (p.upvotes ?? 0), 0);
  const installClicksTotal = userProducts.reduce(
    (sum, p) => sum + ((p.comments ?? 0) * 12 + (p.upvotes ?? 0) * 3),
    0
  );

  return (
    <div className="min-h-screen bg-blue-2">
      <div className="mx-auto max-w-4xl px-16 py-8">
        <header className="mb-8 flex items-center justify-between">
          <Link href={`/experiences/${experienceId}`}>
            <Button color="gray" size="3" variant="soft">← Back</Button>
          </Link>
          <Link href={`/experiences/${experienceId}/submit`}>
            <Button size="3" variant="classic" color="orange">Submit App</Button>
          </Link>
        </header>

        <div className='mb-4'>
          <Heading as="h1" size="5" weight="semi-bold">My Profile</Heading>
          <Text as="p" size="2" color="gray">Manage and review your apps</Text>
        </div>

        <Card>
          <div className="stats w-full">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <RocketLaunchDuotone size={42} color="#fa4616" />
              </div>
              <div className="stat-title">Launches</div>
              <div className="stat-value">{totalLaunches}</div>
              <div className="stat-desc">Past + scheduled</div>
            </div>

             <Separator
                color="gray"
                orientation="vertical"
                size="4"
              />

            <div className="stat">
              <div className="stat-figure text-secondary">
                <ArrowUpCircleDuoTone size={42} color="#fa4616" />
              </div>
              <div className="stat-title">Upvotes</div>
              <div className="stat-value">{totalUpvotes}</div>
              <div className="stat-desc">All-time (mock)</div>
            </div>

             <Separator
                color="gray"
                orientation="vertical"
                size="4"
              />

            <div className="stat">
              <div className="stat-figure text-secondary">
                <DownloadDuotone size={42} color="#fa4616" />
              </div>
              <div className="stat-title">Install Clicks</div>
              <div className="stat-value">{installClicksTotal.toLocaleString()}</div>
              <div className="stat-desc">All-time (mock)</div>
            </div>
          </div>
        </Card>

        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <Heading as="h2" size="4">Launching Now</Heading>
            {launchingNow.length > 0 && (
              <Text as="p" size="2" color="gray">Ends in</Text>
            )}
          </div>
          {launchingNow.length === 0 ? (
            <Text as="p" size="2" color="gray">No apps launching this week.</Text>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {launchingNow.map(p => (
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <ProductCard product={p} />
                    </div>
                    {p.launchEndDate && (
                      <div className="self-start">
                        <Countdown endDate={p.launchEndDate} />
                      </div>
                    )}
                  </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <Heading as="h2" size="4">Upcoming Launches</Heading>
          {futureLaunches.length === 0 ? (
            <Text as="p" size="2" color="gray">No upcoming launches.</Text>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {futureLaunches.map(p => (
                <Link key={p.id} href={`/experiences/${experienceId}/product/${p.id}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <ProductCard product={p} />
                    </div>
                    {p.launchEndDate && (
                      <div className="self-start">
                        <Countdown endDate={p.launchEndDate} />
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <Heading as="h2" size="4">Past Launches</Heading>
          {pastLaunches.length === 0 ? (
            <Text as="p" size="2" color="gray">No past launches.</Text>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {pastLaunches.map(p => (
                <Link key={p.id} href={`/experiences/${experienceId}/product/${p.id}`}>
                  <ProductCard product={p} />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}