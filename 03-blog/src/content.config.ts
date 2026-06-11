// Importa el cargador glob
import { glob } from "astro/loaders";
// Importa utilidades de `astro:content` y `astro/zod`
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

// Define un `loader` y un `schema` para cada colección
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    image: z.string().optional(),

    // Relación
    author: z.string(),

    // Relación
    tags: z.array(z.string()),
  }),
});

// Exporta un solo objeto `collections` para registrar tus colecciones
export const collections = { blog };
