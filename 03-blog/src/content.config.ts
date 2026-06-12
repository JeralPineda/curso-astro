// Importa el cargador glob
import { glob } from "astro/loaders";
// Importa utilidades de `astro:content` y `astro/zod`
import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";

// Define un `loader` y un `schema` para cada colección
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      description: z.string(),
      image: image(), //.refine((img) => img.width < 1200, {
      // message: "Image should be lower than 1200px",
      // }),

      // Relación
      author: reference("author"),

      // Relación
      tags: z.array(z.string()),

      isDraft: z.boolean().default(false),
    }),
});

const author = defineCollection({
  loader: glob({ pattern: "**/*.{yml, yaml}", base: "./src/author" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      avatar: image(),
    }),
});

// Exporta un solo objeto `collections` para registrar tus colecciones
export const collections = { blog, author };
