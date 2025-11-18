import Link from 'next/link';
import ProductCard from '@/src/components/ProductCard';
import { userProducts } from '@/src/data/mock';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <nav className="flex gap-3 text-sm">
            <Link href=".." className="rounded px-3 py-1 text-gray-700 hover:bg-gray-200">Home</Link>
            <Link href="../submit" className="rounded px-3 py-1 text-gray-700 hover:bg-gray-200">Submit</Link>
          </nav>
        </header>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">My Products</h2>
          {userProducts.length === 0 ? (
            <p className="text-sm text-gray-600">No products yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {userProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}