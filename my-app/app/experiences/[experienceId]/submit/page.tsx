'use client';
import UploadIcon from '@/app/components/Icons/Upload';
import { Avatar, Button, Heading, Text, TextField, TextArea, SegmentedControlRadioGroup, Select } from '@whop/react/components';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CATEGORIES } from '@/app/lib/types';
import { compressToWebp } from '@/app/utils/compressToWebp';

type FormState = {
  name: string;
  description: string;
  link: string;
  logo: string;
  pageDescription: string;
  category: string;
  target: 'B2C' | 'B2B';
};

interface ExperiencePageProps {
  params: Promise<{ experienceId: string }>;
}

export default function SubmitPage({ params }: ExperiencePageProps) {
  const [experienceId, setExperienceId] = useState<string>('');
  useEffect(() => {
    params.then(({ experienceId }) => setExperienceId(experienceId));
  }, [params]);
  const [form, setForm] = useState<FormState>({ name: '', description: '', link: '', logo: '', pageDescription: '', category: '', target: 'B2C' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function validate(values: FormState) {
    const e: Record<string, string> = {};
    if (!values.name.trim()) e.name = 'Name is required';
    if (!values.description.trim()) e.description = 'Description is required';
    if (!/^https?:\/\//.test(values.link)) e.link = 'Valid URL required';
    if (!values.logo) e.logo = 'Logo is required';
    if (!values.pageDescription.trim()) e.pageDescription = 'Page description is required';
    if (!values.category) e.category = 'Category is required';
    return e;
  }

  const handleBackClick = () => {
        setIsNavigating(true);
        router.push(`/experiences/${experienceId}`);
  }

  async function onSubmit(ev: any) {
    try {
      if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
      console.log('submit-start', { form });
      const e = validate(form);
      setErrors(e);
      if (Object.keys(e).length === 0) {
        console.log('validation-ok');
        setIsSubmitting(true);
        setServerError(null);
        try {
          let imageUrl = form.logo;
          if (imageUrl.startsWith('data:')) {
            const upRes = await fetch('/api/uploads/logo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ dataUrl: imageUrl }),
            });
            const upJson = await upRes.json();
            if (!upRes.ok || !upJson.success) {
              setServerError(upJson.error || 'Logo upload failed');
              setIsSubmitting(false);
              return;
            }
            imageUrl = upJson.url;
          }
          const res = await fetch('/api/launches/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: form.name,
              description: form.description,
              image: imageUrl,
              testAppUrl: form.link,
              pageDescription: form.pageDescription,
              category: form.category || undefined,
              target: form.target || undefined,
            }),
          });
          console.log('submit-res', res.status);
          const json = await res.json();
          console.log('submit-json', json);
          if (!res.ok || !json.success) {
            setServerError(json.error || 'Submit failed');
          } else {
            setSubmitted(true);
          }
        } catch (err) {
          console.error('submit-error', err);
          setServerError('Network error');
        } finally {
          setIsSubmitting(false);
          console.log('submit-end');
        }
      }
    } catch (e) {
      console.error('submit-handler-exception', e);
    }
  }

  function onChange<K extends keyof FormState>(key: K, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }



  async function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxInitialBytes = 2 * 1024 * 1024;
    if (file.size > maxInitialBytes) {
      setErrors(prev => ({ ...prev, logo: 'Logo must be under 2MB' }));
      return;
    }
    const webp = await compressToWebp(file);
    setForm(prev => ({ ...prev, logo: webp }));
    setErrors(prev => {
      const next = { ...prev };
      delete next.logo;
      return next;
    });
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <header className="mb-8 gap-2">
          <Button color="gray" size="2" variant="soft" style={{ marginBottom: '0.5rem' }} onClick={handleBackClick} loading={isNavigating}>← Back Home</Button>
          <Heading as="h1" size="6">Submit Whop App</Heading>
        </header>

        {submitted ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
            Product submitted (mock). It will appear after backend integration.
          </div>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="flex gap-4">
              <Avatar
                src={form.logo}
                alt={form.name}
                size={"6"}
                fallback="A"
                color='gray'
                className='cursor-pointer'
              />
              <div className="flex flex-col justify-between align-start">
                <Heading as="h2" size="3" weight='medium'>
                  App Icon
                </Heading>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoFile} />
                <Button color="gray" size="2" variant="surface" type="button" onClick={() => fileInputRef.current?.click()}><UploadIcon size={20} color="white" className="mr-1" />Upload icon</Button>
                <Text as="p" size="2" color="gray">
                  Recommended size: 520x520
                </Text>
                {errors.logo ? <p className="mt-1 text-xs text-red-600">{errors.logo}</p> : null}
              </div>
            </div>
            <div className='mt-10'>
              <Text as="label" size="2" color="gray">Name</Text>
              <TextField.Root
                size='2'
              >
                <TextField.Input placeholder="Enter app name" value={form.name} onChange={e => onChange('name', e.target.value)} />
              </TextField.Root>
              {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
            </div>
            <div>
              <Text as="label" size="2" color="gray">Description</Text>
              <TextField.Root
                size='2'
              >
                <TextField.Input placeholder="Enter app description" value={form.description} onChange={e => onChange('description', e.target.value)} />
              </TextField.Root>
              {errors.description ? <p className="mt-1 text-xs text-red-600">{errors.description}</p> : null}
            </div>
            <div >
              <Text as="label" size="2" color="gray">Target Audience</Text>
              <SegmentedControlRadioGroup.Root
                value={form.target}
                onValueChange={(val) => onChange('target', val)}
              >
                <SegmentedControlRadioGroup.Item value="B2C">Consumer-facing App</SegmentedControlRadioGroup.Item>
                <SegmentedControlRadioGroup.Item value="B2B">B2B App</SegmentedControlRadioGroup.Item>
              </SegmentedControlRadioGroup.Root>
            </div>
            <div className='flex flex-col'>
              <Text as="label" size="2" color="gray">Category</Text>
              <Select.Root value={form.category} onValueChange={(val) => onChange('category', val)}>
                <Select.Trigger placeholder="Select a category" />
                <Select.Content>
                  {CATEGORIES.map(category => (
                    <Select.Item key={category} value={category}>{category}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              {errors.category ? <p className="mt-1 text-xs text-red-600">{errors.category}</p> : null}
            </div>
            <div>
              <Text as="label" size="2" color="gray">Install Link</Text>
              <Text as="p" size="1" style={{ marginBottom: '0.5rem' }} color="gray">This link should point to the app's installation page on the Whop platform. You can find this link on your apps developer dashboard. For more info go to <a href="https://docs.whop.com/get-started" target="_blank" rel="noopener noreferrer" className="text-blue-500">Whop Developer Docs</a>.</Text>
              <TextField.Root
                size='2'
              >
                <TextField.Input placeholder="https://whop.com/apps/your_whop_app_id/install/" value={form.link} onChange={e => onChange('link', e.target.value)} />
              </TextField.Root>

              {errors.link ? <p className="mt-1 text-xs text-red-600">{errors.link}</p> : null}
            </div>
            <div>
              <Text as="label" size="2" color="gray">App Page Description</Text>
              <Text as="p" size="1" style={{ marginBottom: '0.5rem' }} color="gray">This description will be displayed on the app's page when I users clicks to view more about your app.</Text>
              <TextArea
                color="gray"
                placeholder="Enter app page description"
                size="2"
                variant="surface"
                value={form.pageDescription}
                onChange={e => onChange('pageDescription', e.target.value)}
              />
              {errors.pageDescription ? <p className="mt-1 text-xs text-red-600">{errors.pageDescription}</p> : null}
            </div>
            {serverError ? <p className="mt-1 text-xs text-red-600">{serverError}</p> : null}
            <div className="flex justify-end gap-2">
              <Button color='gray' size="3" variant='soft' onClick={handleBackClick}>Cancel</Button>
              <Button color="orange" size="3" variant='classic' type="button" loading={isSubmitting} onClick={onSubmit}>Submit</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}