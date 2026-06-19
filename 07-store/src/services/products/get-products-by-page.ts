// src/lib/products.ts

import { db } from "@/db";
import { productImages, products, type Product } from "@/db/schema";
import { count, inArray } from "drizzle-orm";

type ProductsPageResult = {
  products: Product[];
  totalPages: number;
};

const IMAGES_PER_PRODUCT = 2;

export async function getProductsByPage(
  page: number = 1,
  limit: number = 12,
): Promise<ProductsPageResult> {
  page = page <= 0 ? 1 : page;

  // 1. Total de productos, para calcular el total de paginas
  const [{ value: totalItems }] = await db
    .select({ value: count() })
    .from(products);

  const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

  // 2. Si pidieran una pagina fuera de rango
  if (page > totalPages) {
    return {
      products: [],
      totalPages,
    };
  }

  const offset = (page - 1) * limit;

  // 3. Productos de la página actual.
  const items = await db.select().from(products).limit(limit).offset(offset);
  const productIds = items.map((p) => p.id);

  // 4. Imágenes de esos productos, limitadas a IMAGES_PER_PRODUCT.
  const imagesByProduct = await getLimitedImages(
    productIds,
    IMAGES_PER_PRODUCT,
  );

  const productsWithImages = items.map((item) => ({
    ...item,
    // sizes y tags YA llegan como array gracias a `mode: "json"` en tu
    // schema (Drizzle los serializa/deserializa solo). No hace falta
    // hacer .split(',') como en el seed viejo de astro:db, donde sizes
    // y tags se guardaban como string separado por comas.
    images: imagesByProduct.get(item.id) ?? [],
  }));

  return {
    products: productsWithImages,
    totalPages,
  };
}

/**
 * Trae todas las filas de productImages que pertenecen a los productos de
 * la página actual con un solo `inArray`, y recorta a `limitPerProduct` del
 * lado de JS (equivalente simple, sin SQL crudo, al GROUP_CONCAT LIMIT 2
 * que tenías antes). Como vimos antes, esto no reduce lo que se le pide a
 * la base de datos -- solo lo que termina en la respuesta -- así que con
 * pocas imágenes por producto (como tu caso, 2 cada uno) la diferencia
 * contra traerlas todas sin límite es prácticamente nula.
 */
async function getLimitedImages(productIds: string[], limitPerProduct: number) {
  if (productIds.length === 0) return new Map<string, string[]>();

  const allImages = await db
    .select()
    .from(productImages)
    .where(inArray(productImages.productId, productIds));

  const imagesByProduct = new Map<string, string[]>();
  for (const img of allImages) {
    const arr = imagesByProduct.get(img.productId) ?? [];
    if (arr.length < limitPerProduct) arr.push(img.image);
    imagesByProduct.set(img.productId, arr);
  }
  return imagesByProduct;
}
