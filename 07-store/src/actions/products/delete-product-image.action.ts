import { db } from "@/db";
import { productImages } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ImageUpload } from "@/utils/image-upload";
import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { eq } from "drizzle-orm";

export const deleteProductImage = defineAction({
  accept: "json",
  input: z.string(),
  handler: async (imageId, { request }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    const user = session?.user;

    if (!user) {
      throw new Error("Unauthorized");
    }

    const [productImage] = await db
      .select()
      .from(productImages)
      .where(eq(productImages.id, imageId));

    if (!productImages) {
      throw new Error(`image with id ${imageId} not found`);
    }

    const deleted = await db
      .delete(productImages)
      .where(eq(productImages.id, imageId));

    if (productImage.image.includes("http")) {
      await ImageUpload.delete(productImage.image);
    }

    return { ok: true };
  },
});
