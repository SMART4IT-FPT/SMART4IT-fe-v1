// REMOVE this block from vite.config.js
{
  name: 'copy-staticwebapp-config',
  closeBundle() {
    const source = resolve(__dirname, 'staticwebapp.config.json');
    const target = resolve(__dirname, 'dist/staticwebapp.config.json');

    if (existsSync(source)) {
      copyFileSync(source, target);
    } else {
      console.warn(`⚠️ Cannot copy staticwebapp.config.json — file not found at: ${source}`);
    }
  },
},
