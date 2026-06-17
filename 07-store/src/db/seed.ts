import "dotenv/config";
import { client, db } from "@/db";
import { productImages, products, roles, users } from "@/db/schema";
import { seedProducts } from "@/db/seed-data";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

async function seed() {
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

  for (const p of seedProducts) {
    const product = {
      id: crypto.randomUUID(),
      description: p.description,
      gender: p.gender,
      price: p.price,
      sizes: p.sizes,
      slug: p.slug,
      stock: p.stock,
      tags: p.tags,
      title: p.title,
      type: p.type,
      userId: johnDoe.id,
    };

    await db.insert(products).values(product);

    const images = p.images.map((img) => ({
      id: crypto.randomUUID(),
      image: img,
      productId: product.id,
    }));

    if (images.length > 0) {
      await db.insert(productImages).values(images);
    }
  }

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
