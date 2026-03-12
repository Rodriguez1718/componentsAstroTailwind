/// <reference types="astro/client" />

declare module "*.md" {
  const frontmatter: Record<string, any>;
  const Content: import("astro").AstroComponentFactory;
  export { frontmatter, Content };
}

interface MarkdownPost {
  frontmatter: {
    title: string;
    subtitle: string;
    tag: string;
    accent: "amber" | "rose" | "emerald" | "sky";
  };
  Content: import("astro").AstroComponentFactory;
}