// Carga las variables de .env ANTES de importar el cliente de la base de datos.
import "dotenv/config";
import { client, db } from "@/db";
import { productImages, products, roles, users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { seedProducts } from "@/db/seed-data";

async function seed() {
  console.log("🌱 Sembrando datos...");

  const rolesData = [
    { id: "admin", name: "Administrador" },
    { id: "user", name: "Usuario de sistema" },
  ];

  const johnDoe = {
    id: crypto.randomUUID(),
    name: "John Doe",
    email: "john.doe@google.com",
    password: bcrypt.hashSync("123456"),
    role: "admin",
  };

  const janeDoe = {
    id: crypto.randomUUID(),
    name: "Jane Doe",
    email: "jane.doe@google.com",
    password: bcrypt.hashSync("123456"),
    role: "user",
  };

  await db.insert(roles).values(rolesData);
  await db.insert(users).values([johnDoe, janeDoe]);

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
