import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import Uni from '@dcloudio/vite-plugin-uni';

// import UniHelperManifest from '@uni-helper/vite-plugin-uni-manifest';
// import UniHelperPages from '@uni-helper/vite-plugin-uni-pages';
import UniHelperLayouts from '@uni-helper/vite-plugin-uni-layouts';

/**
 * @description Vite 配置
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.17 11:03:02
 */
export default defineConfig({
  plugins: [
    // UniHelperManifest(),
    // UniHelperPages(),
    UniHelperLayouts(),
    UnoCSS(),
    Uni()
  ]
});
