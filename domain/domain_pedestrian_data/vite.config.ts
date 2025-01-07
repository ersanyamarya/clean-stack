import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/domain/domain_pedestrian_data',
  plugins: [nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  test: {
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      enabled: true,
      exclude: ['**/*.d.ts', '**/*.spec.*', 'src/index.ts', '*.config.ts', '*.config.js', '*.config.cjs', 'src/**/index.ts'],
      reportsDirectory: '../../coverage/domain/domain_pedestrian_data',
      provider: 'v8',
      reporter: ['json', 'text'],
    },
  },
});
