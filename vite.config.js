import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ghPages } from "vite-plugin-gh-pages";

export default defineConfig({
  plugins: [react(), ghPages()],
  base: "/Civic/",
  server: {
    proxy: {
      "/api": {
        target: "https://civic-h9ti.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
