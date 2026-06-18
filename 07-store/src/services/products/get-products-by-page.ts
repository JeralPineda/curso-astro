// src/lib/products.ts

import { db } from "@/db";
import { products, type Product } from "@/db/schema";
import { count } from "drizzle-orm";

type ProductsPageResult = {
  products: Product[];
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

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
      hasNextPage: false,
      hasPrevPage: page > 1,
    };
  }

  const offset = (page - 1) * limit;

  // 3. Productos de la página actual.
  const allProducts = await db
    .select()
    .from(products)
    .limit(limit)
    .offset(offset);

  return {
    products: allProducts,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
