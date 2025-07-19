import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        "jquery.min": resolve(__dirname, 'src/entry/jquery-entry.js'),
        "videojs.min": resolve(__dirname, 'src/entry/videojs-entry.js'),
        "clusterizejs.min": resolve(__dirname, 'src/entry/clusterizejs-entry.js'),
        "lazyload.min": resolve(__dirname, 'src/entry/lazyload-entry.js'),
      },
      output: {
        entryFileNames: assetInfo => {
          if (assetInfo.name.endsWith('.min')) {
            return 'assets/[name].js';
          }
          return 'assets/[name]-[hash].js';
        },
      },
    },
  },
});
