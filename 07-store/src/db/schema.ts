import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const roles = sqliteTable("roles", {
  id: text().primaryKey(),
  name: text().notNull(),
});

export const users = sqliteTable("users", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: integer({ mode: "boolean" }).notNull().default(false),
  image: text(),
  createdAt: integer({ mode: "timestamp" }).notNull(),
  updatedAt: integer({ mode: "timestamp" }).notNull(),
  role: text()
    .notNull()
    .default("user")
    .references(() => roles.id),
});

export const sessions = sqliteTable("sessions", {
  id: text().primaryKey(),
  expiresAt: integer({ mode: "timestamp" }).notNull(),
  token: text().notNull().unique(),
  createdAt: integer({ mode: "timestamp" }).notNull(),
  updatedAt: integer({ mode: "timestamp" }).notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: text()
    .notNull()
    .references(() => users.id),
});

export const accounts = sqliteTable("accounts", {
  id: text().primaryKey(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: text()
    .notNull()
    .references(() => users.id),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: integer({ mode: "timestamp" }),
  refreshTokenExpiresAt: integer({ mode: "timestamp" }),
  scope: text(),
  password: text(),
  createdAt: integer({ mode: "timestamp" }).notNull(),
  updatedAt: integer({ mode: "timestamp" }).notNull(),
});

export const verifications = sqliteTable("verifications", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: integer({ mode: "timestamp" }).notNull(),
  createdAt: integer({ mode: "timestamp" }),
  updatedAt: integer({ mode: "timestamp" }),
});

export const products = sqliteTable("products", {
  id: text().primaryKey(),
  description: text().notNull(),
  gender: text().notNull(),
  price: integer().notNull(),
  sizes: text({ mode: "json" }).$type<string[]>().notNull(),
  slug: text().notNull().unique(),
  stock: integer().notNull(),
  tags: text({ mode: "json" }).$type<string[]>().notNull(),
  images: text({ mode: "json" }).$type<string[]>().notNull(), // solo si no están en otra tabla
  title: text().notNull(),
  type: text().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});

// Ejemplo de como seria si las imágenes estuvieran en otra tabla
// export const productImages = sqliteTable("product_images", {
//   id: text().primaryKey(),
//   productId: text("product_id")
//     .notNull()
//     .references(() => products.id),
//   image: text().notNull(),
// });
//
//
export type Role = typeof roles.$inferSelect;
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Verification = typeof verifications.$inferSelect;
export type Product = typeof products.$inferSelect;
// export type ProductImage = typeof productImages.$inferSelect;
