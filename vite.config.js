import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === "true" ? "/online-voting/" : "/",
  plugins: [react({ jsxRuntime: "classic" })]
});
