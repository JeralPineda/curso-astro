import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ params, request }) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  if (slug) {
    const postFiltered = await getCollection("blog", ({ data }) =>
      data.title.toLowerCase().includes(slug.toLowerCase()),
    );
    // puede ser undefined si no existe
    // esto para que llegue al 404 porque siempre devuelve un array vació o con 1 elemento.
    const post = postFiltered[0];

    if (post) {
      return new Response(JSON.stringify(post), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ msg: `Post ${slug} not found` }), {
      status: 404,
      statusText: "Not Found",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const posts = await getCollection("blog");

  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
