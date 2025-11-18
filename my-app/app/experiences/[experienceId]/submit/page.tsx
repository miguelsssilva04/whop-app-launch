'use client';
import Link from 'next/link';
import { useState } from 'react';

type FormState = {
  name: string;
  description: string;
  link: string;
  logo: string;
};

export default function SubmitPage() {
  const [form, setForm] = useState<FormState>({ name: '', description: '', link: '', logo: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(values: FormState) {
    const e: Record<string, string> = {};
    if (!values.name.trim()) e.name = 'Name is required';
    if (!values.description.trim()) e.description = 'Description is required';
    if (!/^https?:\/\//.test(values.link)) e.link = 'Valid URL required';
    if (!values.logo.trim()) e.logo = 'Logo URL is required';
    return e;
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Submit Product</h1>
          <nav className="flex gap-3 text-sm">
            <Link href=".." className="rounded px-3 py-1 text-gray-700 hover:bg-gray-200">Home</Link>
            <Link href="../profile" className="rounded px-3 py-1 text-gray-700 hover:bg-gray-200">My Profile</Link>
          </nav>
        </header>

        {submitted ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
            Product submitted (mock). It will appear after backend integration.
          </div>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => onChange('name', e.target.value)}
                className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
              />
              {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={form.description}
                onChange={e => onChange('description', e.target.value)}
                rows={4}
                className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
              />
              {errors.description ? <p className="mt-1 text-xs text-red-600">{errors.description}</p> : null}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Link</label>
              <input
                type="url"
                value={form.link}
                onChange={e => onChange('link', e.target.value)}
                placeholder="https://example.com"
                className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
              />
              {errors.link ? <p className="mt-1 text-xs text-red-600">{errors.link}</p> : null}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Logo URL</label>
              <input
                type="url"
                value={form.logo}
                onChange={e => onChange('logo', e.target.value)}
                placeholder="https://.../logo.webp"
                className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
              />
              {errors.logo ? <p className="mt-1 text-xs text-red-600">{errors.logo}</p> : null}
            </div>
            <div className="flex justify-end">
              <button type="submit" className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Submit</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}