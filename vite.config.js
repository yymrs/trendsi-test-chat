import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import Unocss from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Unocss({
      /* options */
    }),
  ],
  server: {
    host: "0.0.0.0",
  },
});
