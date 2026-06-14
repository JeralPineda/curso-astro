import type { APIRoute } from "astro";
import { Clients, db } from "astro:db";

export const GET: APIRoute = async ({ params, request }) => {
  const clients = await db.select().from(Clients).all();

  return new Response(JSON.stringify(clients), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const { id, ...body } = await request.json();

    const { lastInsertRowid } = await db.insert(Clients).values(body);

    return new Response(
      JSON.stringify({
        id: Number(lastInsertRowid),
        ...body,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        msg: `Error: ${error}`,
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
