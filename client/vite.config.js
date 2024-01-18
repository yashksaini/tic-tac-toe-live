import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    assetsDir: "assets",
  },
  resolve: {
    alias: {
      // Assuming you have an assets folder inside src
      "@assets": "/src/assets",
    },
  },
});
