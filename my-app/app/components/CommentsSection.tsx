import { useState } from 'react';
import { Heading, Text, Button, Avatar, Card, TextArea } from '@whop/react/components';
import { useIframeSdk } from "@whop/react";

type Comment = {
  id: string;
  authorName: string;
  authorUsername?: string;
  authorAvatarUrl?: string;
  content: string;
  createdAt: string;
  parentId?: string;
};

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      authorName: 'Alex Morgan',
      authorUsername: 'alexm',
      authorAvatarUrl: '/images/avatar.webp',
      content: 'Love the approach — does it support team roles?',
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'c2',
      authorName: 'Jordan Lee',
      authorUsername: 'jordan',
      authorAvatarUrl: '/images/avatar.webp',
      content: 'We tried it in our squad last week, smooth onboarding.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'r1',
      authorName: 'Sam Patel',
      authorUsername: 'samp',
      authorAvatarUrl: '/images/avatar.webp',
      content: 'Yes, roles are planned. We currently have basic permissions.',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      parentId: 'c1',
    },
  ]);
  const [newContent, setNewContent] = useState('');
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const iframeSdk = useIframeSdk();

	function openProfile(username: string) {
		iframeSdk.openExternalUrl({ url: `https://whop.com/@${username}` });
  }

  function addComment(content: string, parentId?: string) {
    if (!content.trim()) return;
    const c: Comment = {
      id: Math.random().toString(36).slice(2),
      authorName: 'You',
      authorUsername: 'you',
      authorAvatarUrl: '/images/avatar.webp',
      content,
      createdAt: new Date().toISOString(),
      parentId,
    };
    setComments(prev => [c, ...prev]);
  }

  function CommentItem({ comment }: { comment: Comment }) {
    const children = comments.filter(c => c.parentId === comment.id);
    return (
      <div className="space-y-3">
        <div className="flex gap-3">
          <Avatar src={comment.authorAvatarUrl} alt={comment.authorName} size="4" fallback={comment.authorName.charAt(0)} />
          <div className="flex-1">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => openProfile(comment.authorUsername || '')}>
              <Text as="p" size="2" weight="medium">{comment.authorName}</Text>
              {comment.authorUsername && (
                <Text as="p" size="2" color="gray">@{comment.authorUsername}</Text>
              )}
              <Text as="p" size="2" color="gray">• {formatRelative(comment.createdAt)}</Text>
            </div>
            <Text as="p" size="3" className="mt-1">{comment.content}</Text>
            <div className="mt-2 flex gap-3">
              <button className="text-xs text-gray-700 hover:underline" onClick={() => setReplyingId(comment.id)}>Reply</button>
            </div>
            {replyingId === comment.id && (
              <div className="mt-3">
                <TextArea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Write a reply"
                  rows={3}
                />
                <div className="mt-2 flex gap-2">
                  <Button size="2" variant="classic" color="orange" onClick={() => { addComment(replyText, comment.id); setReplyText(''); setReplyingId(null); }}>Post</Button>
                  <Button size="2" variant="soft" color="gray" onClick={() => { setReplyingId(null); setReplyText(''); }}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        </div>
        {children.length > 0 && (
          <div className="ml-6 border-l-2 border-gray-200 pl-4 space-y-4">
            {children.map(child => (
              <CommentItem key={child.id} comment={child} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const roots = comments.filter(c => !c.parentId);

  return (
    <Card className="flex flex-col mt-4 p-4 gap-4">
      <Heading as="h3" size="4" weight="medium">Comments • {comments.length}</Heading>
      <div className="mt-4">
        <TextArea
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
          placeholder="Add a comment"
          rows={3}
        />
        <div className="mt-2 flex justify-end">
          <Button size="2" variant="classic" color="orange" onClick={() => { addComment(newContent); setNewContent(''); }}>Post</Button>
        </div>
      </div>
      <div className="space-y-6">
        {roots.map(c => (
          <CommentItem key={c.id} comment={c} />
        ))}
      </div>
    </Card>
  );
}