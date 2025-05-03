import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, existsSync } from 'fs';

export default defineConfig({
  plugins: [
    {
      name: 'copy-staticwebapp-config',
      closeBundle() {
        const source = resolve(__dirname, 'staticwebapp.config.json');
        const target = resolve(__dirname, 'dist/staticwebapp.config.json');
        if (existsSync(source)) {
          copyFileSync(source, target);
        }
      }
    }
  ]
});
