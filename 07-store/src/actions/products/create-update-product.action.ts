import { db } from "@/db";
import { products } from "@/db/schema";
import { auth } from "@/lib/auth";
import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { eq } from "drizzle-orm";

export const createUpdateProduct = defineAction({
  accept: "form",
  input: z.object({
    id: z.string().optional(),
    description: z.string(),
    gender: z.string(),
    price: z.number(),
    sizes: z.string().transform((value) => value.split(",")),
    slug: z.string(),
    stock: z.number(),
    tags: z.string().transform((value) =>
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
    title: z.string(),
    type: z.string(),

    //TODO: images
  }),
  handler: async (form, { request }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    const user = session?.user;

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { id = crypto.randomUUID(), ...rest } = form;

    rest.slug = rest.slug.toLowerCase().replaceAll(" ", "_").trim();
    const product = {
      id,
      userId: user.id,
      ...rest,
    };

    const result = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id));
    console.log("update result:", result);

    //Crear
    //Update
    // Insert de imágenes

    return product;
  },
});
