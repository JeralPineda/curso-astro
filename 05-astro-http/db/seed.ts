import { getCollection } from "astro:content";
import { db, Clients, Posts } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Clients).values([
    { id: 1, name: "Juan", age: 30, isActive: true },
    { id: 2, name: "Maria", age: 25, isActive: false },
  ]);

  const posts = await getCollection("blog");

  await db.insert(Posts).values(
    posts.map((post) => ({
      id: post.id,
      title: post.data.title,
      likes: Math.round(Math.random() * 100),
    })),
  );

  console.log("Seed executed");
}
