import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    tag: z.string(),
    accent: z.enum(['amber', 'rose', 'emerald', 'sky']),
  }),
});

export const collections = {
  blog,
};