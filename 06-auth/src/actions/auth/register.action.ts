import { z } from "astro/zod";
import { defineAction } from "astro:actions";

export const registerUser = defineAction({
  accept: "form",
  input: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional(),
  }),
  handler: async ({ name, email, password, remember_me }) => {
    console.log(
      "🚀 register.action.ts -> #13 ~ form",
      JSON.stringify(
        {
          name,
          email,
          password,
          remember_me,
        },
        null,
        2,
      ),
    );

    return true;
  },
});
