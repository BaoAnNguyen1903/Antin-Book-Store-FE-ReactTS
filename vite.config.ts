import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // or "modern"
        silenceDeprecations: [
          "mixed-decls",
          "color-functions",
          "global-builtin",
          "import"
        ] // k hiện warning của thư viện gallery
      }
    }
  }
});
