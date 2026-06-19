import type { ProductWithImages } from "@/db/schema";
import { ProductCard } from "./ProductCard";

interface Props {
  products: ProductWithImages[];
}

export const ProductList = ({ products }: Props) => {
  return (
    <div className="grid grid-cols-1 place-items-center gap-4 sm:grid-cols-2 md:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
