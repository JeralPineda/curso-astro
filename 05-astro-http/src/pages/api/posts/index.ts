import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ params, request }) => {
  const posts = await getCollection("blog");

  console.log("🚀 index.ts -> #7 ~ request:", request);

  return new Response(JSON.stringify(posts), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
