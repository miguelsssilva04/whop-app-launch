'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Heading, Text, Button, Avatar, Card } from '@whop/react/components';
import { products } from '@/app/lib/mock';
import { useIframeSdk } from "@whop/react";
import { ArrowUpCircleDuoTone } from '@/app/components/Icons/ArrowUpCircleDuoTone';
import ChatTearDropDuotone from '@/app/components/Icons/ChatTearDropDuotone';
import { CommentsSection } from '@/app/components/CommentsSection';

interface ProductPageProps {
  params: Promise<{ experienceId: string; id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [experienceId, setExperienceId] = useState<string>('');
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then(({ experienceId, id }) => {
      setExperienceId(experienceId);
      setId(id);
    });
  }, [params]);

  const product = products.find(p => p.id === id);

  const iframeSdk = useIframeSdk();

	function openProfile() {
		iframeSdk.openExternalUrl({ url: `https://whop.com/@${product?.creatorUsername}` });
  }

  const handleTestAppButton = () => {
    iframeSdk.openExternalUrl({ url: product?.testAppUrl || '' });
  }

  return (
    <div className="min-h-screen bg-blue-2">
      <div className="mx-auto max-w-4xl px-16 py-8">
        <header className="mb-8 flex items-center justify-between">
          <Link href={`/experiences/${experienceId}`}>
            <Button color="gray" size="3" variant="soft">← Back</Button>
          </Link>
          <Button size="3" variant="classic" color="orange" onClick={handleTestAppButton}>Test this app</Button>
        </header>

        {!product ? (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4">
            <Text as="p" size="3" color="red">Product not found.</Text>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <div className="flex gap-6">
              <Avatar 
                src={product.image} 
                alt={product.name} 
                size="6"    
                fallback="?" 
                color="orange"
                />
              <div className="flex-1">
                <Heading as="h2" size="5" weight="semi-bold">{product.name}</Heading>
                <Text as="p" size="3" color="gray">{product.description}</Text>
                {(product.category || product.target) && (
                  <Text as="p" size="2" color="gray">
                    {product.target} {product.category ? `· ${product.category}` : ''}
                  </Text>
                )}
              </div>
              <Card className='p-2'>
                <div className="flex items-center gap-3">
                  <Avatar
                    src={"/images/avatar.webp"}
                    alt={product.creatorName}
                    size="5"
                    fallback="?"
                  />
                  <div className="flex-1">
                    <Text as="p" size="1" color="gray">Created by</Text>
                    <Text as="p" size="3" weight="medium">{product.creatorName}</Text>
                    <Button size="1" variant="classic" color="orange" onClick={openProfile}>
                        Message creator
                    </Button>
                  </div>
                  
                </div>
              </Card>
            </div>

            <div className="flex gap-4">
              <Button size="3" variant="classic" color="orange" className='flex-1'>
                <ArrowUpCircleDuoTone size={24} color="white" />
                Upvote • {product.upvotes ?? 0}
                </Button>
              <Button size="3" variant="classic" color="blue" className='flex-1'>
                <ChatTearDropDuotone size={24} color="white" />
                Comment • {product.comments ?? 0}
                </Button>
            </div>

            <Card className="flex flex-col mt-4 p-4 gap-4">
              <Heading as="h3" size="4" weight="medium">About</Heading>
              <Text as="p" size="3" color="gray" className="mt-2">
                {product.pageDescription || product.description}
              </Text>
            </Card>

            <CommentsSection />
          </div>
        )}
      </div>
    </div>
  );
}

