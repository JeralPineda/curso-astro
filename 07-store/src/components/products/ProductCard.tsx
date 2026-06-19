import type { ProductWithImages } from "@/db/schema";

interface Props {
  product: ProductWithImages;
}

export const ProductCard = ({ product }: Props) => {
  return <div>{product.title}</div>;
};
