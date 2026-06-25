import { db } from "@/db";
import { productImages, products } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ImageUpload } from "@/utils/image-upload";
import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { eq } from "drizzle-orm";

const MAX_FILE_SIZE = 5_000_000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

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

    imageFiles: z
      .array(
        z
          .instanceof(File)
          .refine((file) => file.size <= MAX_FILE_SIZE, "Max image size is 5MB")
          .refine(
            (file) => {
              if (file.size === 0) return true;

              return ACCEPTED_IMAGE_TYPES.includes(file.type);
            },
            `Only supported image files are valid, ${ACCEPTED_IMAGE_TYPES.join(",")}`,
          ),
      )
      .optional(),
  }),
  handler: async (form, { request }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    const user = session?.user;

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { id = crypto.randomUUID(), imageFiles, ...rest } = form;
    rest.slug = rest.slug.toLowerCase().replaceAll(" ", "_").trim();

    const product = {
      id,
      userId: user.id,
      ...rest,
    };

    if (!form.id) {
      await db.insert(products).values(product);
    } else {
      await db.update(products).set(product).where(eq(products.id, id));
    }

    // Insert de imágenes
    if (imageFiles && imageFiles.length > 0 && imageFiles[0].size > 0) {
      const uploadPromises = imageFiles
        .filter((file) => file.size > 0)
        .map(async (file) => {
          const url = await ImageUpload.upload(file);
          return {
            id: crypto.randomUUID(),
            productId: id,
            image: url,
          };
        });

      const newImages = await Promise.all(uploadPromises);

      if (newImages.length > 0) {
        await db.insert(productImages).values(newImages);
      }
    }

    return product;
  },
});
