import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-staticwebapp-config',
      closeBundle() {
        copyFileSync(
          const source = resolve(__dirname, 'staticwebapp.config.json');
          const target = resolve(__dirname, 'dist/staticwebapp.config.json');
          console.log('SOURCE PATH:', source);
          console.log('TARGET PATH:', target);
        );
      },
    },
  ],
});
