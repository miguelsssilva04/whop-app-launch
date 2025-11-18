'use client';
import UploadIcon from '@/app/components/Icons/Upload';
import { Avatar, Button, Heading, Text, TextField, TextArea, SegmentedControlRadioGroup, Select } from '@whop/react/components';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CATEGORIES } from '@/app/lib/types';

type FormState = {
  name: string;
  description: string;
  link: string;
  logo: string;
  pageDescription: string;
};

interface ExperiencePageProps {
  params: Promise<{ experienceId: string }>;
}

export default function SubmitPage({ params }: ExperiencePageProps) {
  const [experienceId, setExperienceId] = useState<string>('');
  useEffect(() => {
    params.then(({ experienceId }) => setExperienceId(experienceId));
  }, [params]);
  const [form, setForm] = useState<FormState>({ name: '', description: '', link: '', logo: '', pageDescription: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  function validate(values: FormState) {
    const e: Record<string, string> = {};
    if (!values.name.trim()) e.name = 'Name is required';
    if (!values.description.trim()) e.description = 'Description is required';
    if (!/^https?:\/\//.test(values.link)) e.link = 'Valid URL required';
    if (!values.logo.trim()) e.logo = 'Logo URL is required';
    return e;
  }

  const handleBackClick = () => {
        setIsNavigating(true);
        router.push(`/experiences/${experienceId}`);
  }

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length === 0) setSubmitted(true);
  }

  function onChange<K extends keyof FormState>(key: K, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
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
          <form className="space-y-4" onSubmit={onSubmit} noValidate>
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
                <Button color="gray" size="2" variant="surface"><UploadIcon size={20} color="white" className="mr-1" />Upload icon</Button>
                <Text as="p" size="2" color="gray">
                  Recommended size: 520x520
                </Text>
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
                defaultValue="B2C"
              >
                <SegmentedControlRadioGroup.Item value="B2C">Consumer-facing App</SegmentedControlRadioGroup.Item>
                <SegmentedControlRadioGroup.Item value="B2B">B2B App</SegmentedControlRadioGroup.Item>
              </SegmentedControlRadioGroup.Root>
            </div>
            <div className='flex flex-col'>
              <Text as="label" size="2" color="gray">Category</Text>
              <Select.Root>
                <Select.Trigger placeholder="Select a category" />
                <Select.Content>
                  {CATEGORIES.map(category => (
                    <Select.Item key={category} value={category}>{category}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
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
            <div className="flex justify-end gap-2">
              <Button color='gray' size="3" variant='soft' onClick={handleBackClick}>Cancel</Button>
              <Button color="orange" size="3" variant='classic' type="submit">Submit</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}