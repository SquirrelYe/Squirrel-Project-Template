import { defineConfig, presetIcons } from 'unocss';
import { transformerClass, transformerAttributify } from 'unocss-preset-weapp/transformer';
import { transformerCompileClass, transformerVariantGroup } from 'unocss';
import { presetWeapp } from 'unocss-preset-weapp';

export default defineConfig({
  presets: [
    presetWeapp({ whRpx: true, platform: 'uniapp', prefix: 'u-' }),
    presetIcons({
      scale: 1,
      warn: true,
      extraProperties: { display: 'inline-block', 'vertical-align': 'middle' },
      prefix: 'u-icon-',
      collections: {}
    })
  ],
  transformers: [transformerAttributify(), transformerClass(), transformerCompileClass(), transformerVariantGroup()]
});
