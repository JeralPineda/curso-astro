import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const roles = sqliteTable("roles", {
  id: text().primaryKey(),
  name: text().notNull(),
});

export const users = sqliteTable("users", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  role: text()
    .notNull()
    .references(() => roles.id),
});

export const products = sqliteTable("products", {
  id: text().primaryKey(),
  description: text().notNull(),
  gender: text().notNull(), // 'men' | 'women' | 'kid' | 'unisex'
  price: integer().notNull(),
  sizes: text({ mode: "json" }).$type<string[]>().notNull(),
  slug: text().notNull().unique(),
  stock: integer().notNull(),
  tags: text({ mode: "json" }).$type<string[]>().notNull(),
  title: text().notNull(),
  type: text().notNull(), // 'shirts' | 'pants' | 'hoodies' | 'hats'
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});

export const productImages = sqliteTable("product_images", {
  id: text().primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  image: text().notNull(),
});
