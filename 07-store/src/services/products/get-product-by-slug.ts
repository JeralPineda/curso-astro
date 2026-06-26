import { db } from "@/db";
import { productImages, products } from "@/db/schema";
import { eq } from "drizzle-orm";

const newProduct = {
  id: "",
  description: "Nueva descripción",
  gender: "men",
  price: 100,
  sizes: ["XS", "S", "M"],
  slug: "nuevo-producto",
  stock: 5,
  tags: ["shirt", "men", "nuevo"],
  title: "Nuevo Producto",
  type: "shirts",
};

export async function getProductBySlug(slug: string) {
  if (slug === "new") {
    return {
      product: newProduct,
      images: [],
    };
  }

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug));

  if (!product) {
    return {
      product: null,
      images: null,
    };
  }

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, product.id));

  return {
    product,
    // images: images.map((i) => i.image),
    images,
  };
}
