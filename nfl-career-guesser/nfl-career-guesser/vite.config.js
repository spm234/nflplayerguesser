import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base: "./"` uses relative asset paths, so the build works whether it's
// deployed at the root of a domain (username.github.io) or in a
// subdirectory (username.github.io/repo-name) — no need to edit this
// when you create your GitHub repo.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
