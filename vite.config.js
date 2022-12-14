import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./frontend/",
  build: {
    outDir: "../dist/",
  },
  publicDir: "../dist/",
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "./frontend/assets/",
          dest: "../dist/",
        },
      ],
    }),
  ],
});
