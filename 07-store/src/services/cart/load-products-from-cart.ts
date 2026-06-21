import { db } from "@/db";
import { productImages, products } from "@/db/schema";
import type { CartItem } from "@/interfaces/cart-item";
import type { AstroCookies } from "astro";
import { eq, inArray } from "drizzle-orm";

export async function loadProductsFromCart(cookies: AstroCookies) {
  const cart = JSON.parse(cookies.get("cart")?.value ?? "[]") as CartItem[];

  if (cart.length === 0) return [];

  // Load products
  const productIds = cart.map((item) => item.productId);

  const dbProducts = await db
    .select()
    .from(products)
    .innerJoin(productImages, eq(products.id, productImages.productId))
    .where(inArray(products.id, productIds));

  return cart.map((item) => {
    const dbProduct = dbProducts.find((p) => p.products.id === item.productId);

    if (!dbProduct) {
      throw new Error(`Product with id ${item.productId} not found`);
    }

    const { title, price, slug } = dbProduct.products;
    const image = dbProduct.product_images.image;

    return {
      productId: item.productId,
      title,
      size: item.size,
      quantity: item.quantity,
      image: image.startsWith("http")
        ? image
        : `${import.meta.env.PUBLIC_URL}/images/products/${image}`,
      price,
      slug,
    };
  });
}
