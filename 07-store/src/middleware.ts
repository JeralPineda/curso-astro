import { auth } from "@/lib/auth";
import { defineMiddleware } from "astro:middleware";

const notAuthenticatedRoutes = ["/login", "/register"];

export const onRequest = defineMiddleware(
  async ({ url, locals, redirect, request }, next) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const isLoggedIn = !!session;
    locals.isLoggedIn = isLoggedIn;
    locals.user = session?.user ?? null;
    locals.session = session?.session ?? null;
    locals.isAdmin = session?.user?.role === "admin";

    // TODO: Eventualmente tenemos que controlar el acceso por roles
    if (!locals.isAdmin && url.pathname.startsWith("/dashboard")) {
      return redirect("/");
    }
    //
    if (isLoggedIn && notAuthenticatedRoutes.includes(url.pathname)) {
      return redirect("/");
    }

    return next();
  },
);
