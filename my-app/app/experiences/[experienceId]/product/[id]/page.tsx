'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Heading, Text, Button, Avatar, Card } from '@whop/react/components';
import { products } from '@/app/lib/mock';
import { useIframeSdk } from "@whop/react";
import { ArrowUpCircleDuoTone } from '@/app/components/Icons/ArrowUpCircleDuoTone';
import ChatTearDropDuotone from '@/app/components/Icons/ChatTearDropDuotone';
import { CommentsSection } from '@/app/components/CommentsSection';
import { isUpvoted, upvote, removeUpvote } from '@/app/lib/upvoteCache';
import {useRouter} from 'next/navigation';

function renderInlineBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function MarkdownLite({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc pl-6">
          {items.map((it, idx) => (
            <li key={idx}>
              {renderInlineBold(it)}
            </li>
          ))}
        </ul>
      );
      continue;
    }
    if (line.trim().length === 0) {
      elements.push(<div key={`sp-${i}`} className="h-2" />);
      i++;
      continue;
    }
    elements.push(
      <Text key={`p-${i}`} as="p" size="3" color="gray" className="mt-1">
        {renderInlineBold(line)}
      </Text>
    );
    i++;
  }
  return <div className="mt-2 space-y-1">{elements}</div>;
}

interface ProductPageProps {
  params: Promise<{ experienceId: string; id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [experienceId, setExperienceId] = useState<string>('');
  const [id, setId] = useState<string>('');
  const router = useRouter();

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

  const [upvoted, setUpvoted] = useState(false);
  useEffect(() => {
    if (id) setUpvoted(isUpvoted(id));
  }, [id]);
  const handleUpvote = () => {
    if (!id) return;
    if (upvoted) {
      removeUpvote(id);
      setUpvoted(false);
    } else {
      upvote(id);
      setUpvoted(true);
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#comments') {
      // Delay scroll slightly to ensure section is rendered
      requestAnimationFrame(() => {
        document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [product]);

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
              <Button
                size="3"
                variant={upvoted ? 'classic' : 'soft'}
                color={upvoted ? 'orange' : 'gray'}
                className='flex-1'
                onClick={handleUpvote}
              >
                <ArrowUpCircleDuoTone size={24} color="white" />
                Upvote • {product.upvotes ?? 0}
              </Button>
              <Button size="3" variant="classic" color="blue" className='flex-1' onClick={() => router.push(`/experiences/${experienceId}/product/${id}#comments`)}>
                <ChatTearDropDuotone size={24} color="white" />
                Comment • {product.comments ?? 0}
                </Button>
            </div>

            <Card className="flex flex-col mt-4 p-4 gap-4">
              <Heading as="h3" size="4" weight="medium">About</Heading>
              <MarkdownLite content={product.pageDescription || product.description} />
            </Card>

            <div id="comments">
              <CommentsSection />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

