import { defineConfig } from '@umijs/max';
import { resolve } from 'node:path';

import { DefaultSettings } from './default.settings';
import { Proxy } from './proxy';
import { Routes } from './routes';

const environment = process.env.NODE_ENV || 'development';
const cdnHost = 'https://prod-4g3qwhltc0f94f6c-1318691297.tcloudbaseapp.com/'; // 关联云开发环境的 静态资源存储 - CDN 域名
const publicPath = process.env.NODE_ENV === 'production' ? cdnHost : '/';

console.log('development --->', environment);

/**
 * @description UniJS Max 项目配置文件
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.18 12:50:31
 */
export default defineConfig({
  hash: true,
  history: { type: 'hash' },
  routes: Routes,
  theme: { 'root-entry-name': 'variable' }, // 如果不想要 configProvide 动态设置主题需要把这个设置为 default。只有设置为 variable，才能使用 configProvide 动态设置主色调。
  ignoreMomentLocale: true,
  proxy: Proxy[environment],
  fastRefresh: true,
  alias: {
    '@components/*': resolve(__dirname, '../src/components/'),
    '@@/*': resolve(__dirname, '../src/.umi/'),
    '@/*': resolve(__dirname, '../src/')
  },
  publicPath: publicPath,

  //============== 以下都是 Max 的插件配置 ===============

  title: DefaultSettings.title,
  layout: { locale: true, ...DefaultSettings },
  moment2dayjs: { preset: 'antd', plugins: ['duration'] },
  model: {},
  initialState: {},
  antd: {},
  request: {},
  access: {},
  valtio: {},
  headScripts: [{ src: publicPath + 'scripts/loading.js', async: true }],

  //================ Pro 插件配置 =================

  presets: ['umi-presets-pro'],
  mfsu: { strategy: 'normal' },
  requestRecord: {}
});
