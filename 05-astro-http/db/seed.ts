import { db, Clients } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Clients).values([
    { id: 1, name: "Juan", age: 30, isActive: true },
    { id: 2, name: "Maria", age: 25, isActive: false },
  ]);

  console.log("Seed executed");
}
