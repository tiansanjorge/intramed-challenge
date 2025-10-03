/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "node_modules/",
        "src/tests/**",
        ".next/**", // 👈 excluí la carpeta .next
        "**/webpack-internal:*", // 👈 excluí imports internos de Next
        "**/*.d.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
