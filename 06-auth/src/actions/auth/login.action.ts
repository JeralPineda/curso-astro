import { firebase } from "@/firebase/config";
import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { signInWithEmailAndPassword } from "firebase/auth";

export const loginUser = defineAction({
  accept: "form",
  input: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional(),
  }),
  handler: async ({ email, password, remember_me }, { cookies }) => {
    if (remember_me) {
      cookies.set("email", email, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 año
        path: "/",
      });
    } else {
      cookies.delete("email", { path: "/" });
    }

    // Login de usuario
    try {
      const user = await signInWithEmailAndPassword(
        firebase.auth,
        email,
        password,
      );

      return {
        uid: user.user.uid,
        email: user.user.email,
      };
    } catch (error) {
      console.log("🚀 login.action.ts -> #25 ~ error:", error);

      throw new Error("Error al iniciar sesión");
    }
  },
});
