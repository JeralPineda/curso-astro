import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, request }) => {
  const { clientId } = params;

  return new Response(
    JSON.stringify({
      method: "GET",
      clientId,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const { clientId } = params;

  return new Response(
    JSON.stringify({
      method: "PATCH",
      clientId,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const DELETE: APIRoute = async ({ params, request }) => {
  const { clientId } = params;

  return new Response(
    JSON.stringify({
      method: "DELETE",
      clientId,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
