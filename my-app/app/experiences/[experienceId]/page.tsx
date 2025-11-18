'use client';
import Link from 'next/link';
import ProductCard from '@/src/components/ProductCard';
import { launchingNow, products } from '@/src/data/mock';

export default function HomePage() {
  return (
    <div className="min-h-screen ">
      <div className="px-6 py-8">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Product Hunt — Mock</h1>
          <nav className="flex gap-3 text-sm">
            <Link href="." className="rounded px-3 py-1 text-gray-700 hover:bg-gray-200">Home</Link>
            <Link href="submit" className="rounded px-3 py-1 text-gray-700 hover:bg-gray-200">Submit</Link>
            <Link href="profile" className="rounded px-3 py-1 text-gray-700 hover:bg-gray-200">My Profile</Link>
          </nav>
        </header>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Launching Now</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {launchingNow.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">All Products</h2>
          <div className="grid grid-cols-1 gap-4">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}