import { createSSRApp } from 'vue';
import * as Pinia from 'pinia';
import 'uno.css';

import App from '@/App.vue';

export function createApp() {
  const app = createSSRApp(App);
  const pinia = Pinia.createPinia();

  app.use(pinia);

  return {
    app,
    Pinia
  };
}
