import type { ProductWithImages } from "@/db/schema";
import { useState } from "react";

interface Props {
  product: ProductWithImages;
}

const imageUrl = import.meta.env.PUBLIC_URL;

export const ProductCard = ({ product }: Props) => {
  const images = product.images.map((img) => {
    return img.startsWith("http") ? img : `${imageUrl}/images/products/${img}`;
  });

  const [currentImage, setCurrentImage] = useState(images[0]);

  return (
    <a href={`/products/${product.slug}`}>
      <img
        src={currentImage}
        alt={product.title}
        className="h-[350px] object-contain"
        onMouseEnter={() => setCurrentImage(images[1] ?? images[0])}
        onMouseLeave={() => setCurrentImage(images[0])}
      />
      <h4>{product.title}</h4>
      <p>${product.price}</p>
    </a>
  );
};
