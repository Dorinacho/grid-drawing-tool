import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

import netlify from "@astrojs/netlify";

export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: true,
    }),
  ],

  vite: {
    optimizeDeps: {
      include: ["jspdf"],
    },
    resolve: {
      extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
    },
  },

  adapter: netlify(),
});