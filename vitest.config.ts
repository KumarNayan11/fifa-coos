import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache", "e2e/**", "**/*.spec.ts"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
