import Countdown from "@/src/components/Countdown";
import type { Product } from "@/src/data/mock";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  return (
    <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <img
        src={product.image}
        alt={product.name}
        width={64}
        height={64}
        loading="lazy"
        className="h-16 w-16 rounded object-cover"
      />
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
          {product.launchEndDate ? <Countdown endDate={product.launchEndDate} /> : null}
        </div>
        <p className="mt-1 text-sm text-gray-600">{product.description}</p>
      </div>
    </div>
  );
}