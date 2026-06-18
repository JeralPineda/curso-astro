import "dotenv/config";
import { client, db } from "@/db";
import {
  accounts,
  products,
  roles,
  sessions,
  users,
  verifications,
} from "@/db/schema";
import { seedProducts } from "@/db/seed-data";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

async function reset() {
  console.log("🧹 Limpiando datos previos...");
  // Borrar de hijo -> padre, respetando las foreign keys
  // await db.delete(productImages); // Descomentar si se agrega la tabla
  await db.delete(products);
  await db.delete(sessions);
  await db.delete(accounts);
  await db.delete(verifications);
  await db.delete(users);
  await db.delete(roles);
}

async function seed() {
  // Precaución el reset limpia la base de datos, si se crearon nuevos elementos se perderán, debe ser usado con precaución
  // Es solo para desarrollo
  // Se agrego el reset ya que si se ejecuta el seed con datos repetidos podría dar problemas
  await reset();

  console.log("🌱 Sembrando datos...");

  const rolesData = [
    { id: "admin", name: "Administrador" },
    { id: "user", name: "Usuario de sistema" },
  ];

  await db.insert(roles).values(rolesData);

  await auth.api.signUpEmail({
    body: {
      name: "John Doe",
      email: "john.doe@google.com",
      password: "123456789",
    },
  });

  await auth.api.signUpEmail({
    body: {
      name: "Jane Doe",
      email: "jane.doe@google.com",
      password: "123456789",
    },
  });

  await db
    .update(users)
    .set({ role: "admin" })
    .where(eq(users.email, "john.doe@google.com"));

  const [johnDoe] = await db
    .select()
    .from(users)
    .where(eq(users.email, "john.doe@google.com"));

  if (!johnDoe) {
    throw new Error("No se encontró John Doe después del signup");
  }

  // Batch de productos
  // Armar todos los productos e imágenes para insertarlos en lote
  // Se cambio for a map para mejorar el rendimiento
  const productRows = seedProducts.map((p) => ({
    id: crypto.randomUUID(),
    description: p.description,
    gender: p.gender,
    price: p.price,
    sizes: p.sizes,
    slug: p.slug,
    stock: p.stock,
    tags: p.tags,
    images: p.images,
    title: p.title,
    type: p.type,
    userId: johnDoe.id,
  }));

  // Si se agrega la tabla de imagenes
  // const imageRows = seedProducts.flatMap((p, i) =>
  //   p.images.map((img) => ({
  //     id: crypto.randomUUID(),
  //     image: img,
  //     productId: productRows[i].id,
  //   })),
  // );

  await db.insert(products).values(productRows);

  // Si se agrega la tabla de imagenes
  // if (imageRows.length > 0) {
  //   await db.insert(productImages).values(imageRows);
  // }

  console.log("✅ Listo, datos insertados.");
}

seed()
  .catch((err) => {
    console.error("❌ Error al sembrar la base de datos:", err);
    process.exit(1);
  })
  .finally(() => {
    client.close();
    process.exit(0);
  });
