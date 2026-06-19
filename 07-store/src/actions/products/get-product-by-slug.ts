import { db } from "@/db";
import { productImages, products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getProductBySlug(slug: string) {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug));

  if (!product) return null; // <-- null en vez de throw

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, product.id));

  return {
    product,
    images: images.map((i) => i.image),
  };
}
