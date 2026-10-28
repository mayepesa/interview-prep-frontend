import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    // Las páginas de teoría son .mdx: markdown con componentes de React dentro.
    { enforce: "pre", ...mdx({ remarkPlugins: [remarkGfm], rehypePlugins: [rehypeHighlight] }) },
    react({ include: /\.(mdx|ts|tsx)$/ }),
  ],
  // Es una app local de estudio con todas las páginas en un solo bundle: el aviso de tamaño no aplica.
  build: { chunkSizeWarningLimit: 3000 },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "concepts",
          environment: "jsdom",
          include: ["src/**/*.test.{ts,tsx}"],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "practice",
          environment: "jsdom",
          include: ["exercises/**/*.test.{ts,tsx}"],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
    ],
  },
});
