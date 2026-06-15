import { defineMiddleware } from "astro:middleware";

const privateRoutes = ["/protected"];

export const onRequest = defineMiddleware(async ({ url, request }, next) => {
  const authHeader = request.headers.get("authorization");

  if (privateRoutes.includes(url.pathname)) {
    if (authHeader) {
      return next();
    }

    return new Response("Euth Necesaaria", {
      status: 401,
      headers: {
        "WWW-Authenticate": `Basic real="Secure Area"`,
      },
    });
  }
  return next();
});
