import { firebase } from "@/firebase/config";
import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { createUserWithEmailAndPassword, type AuthError } from "firebase/auth";

export const registerUser = defineAction({
  accept: "form",
  input: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional(),
  }),
  handler: async ({ name, email, password, remember_me }, { cookies }) => {
    if (remember_me) {
      cookies.set("email", email, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 año
        path: "/",
      });
    } else {
      cookies.delete("email", { path: "/" });
    }

    // Creación de usuario
    try {
      const user = await createUserWithEmailAndPassword(
        firebase.auth,
        email,
        password,
      );
      console.log("🚀 register.action.ts -> #31 ~ user:", user);

      // Actualizar el nombre (displayName)

      // Verificar el correo electrónico

      // return user;
      return {
        uid: user.user.uid,
        email: user.user.email,
      };
    } catch (error) {
      const firebaseError = error as AuthError;

      console.log(
        "🚀 register.action.ts -> #45 ~ firebaseError:",
        firebaseError,
      );

      if (firebaseError.code === "auth/email-already-in-use") {
        throw new Error("El correo ya está en uso");
      }

      throw new Error("Error al crear el usuario");
    }
  },
});
