import { defineBuildConfig } from 'unbuild';
import { resolve } from 'node:path';

export default defineBuildConfig({
  clean: true,
  entries: ['src/index'],
  declaration: true,
  failOnWarn: false,
  rollup: {
    inlineDependencies: false,
    emitCJS: true,
    esbuild: {}
  },
  outDir: 'dist',
  externals: ['vue'],
  alias: { '@': resolve(__dirname, 'src') }
});
