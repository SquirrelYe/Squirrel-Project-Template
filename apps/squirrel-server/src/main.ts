import 'module-alias/register'; // 解决路径别名问题

import * as cookieParser from 'cookie-parser';
import * as proxy from 'http-proxy-middleware';
import { NestFactory } from '@nestjs/core';
import { CommonConfiguration } from '@/configuration/common.configuration';
import { AppModule } from '@/app.module';

/**
 * @description 项目入口文件，用于启动 NestJS 服务端项目，以及配置中间件等等操作。
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.20 19:48:27
 * @see https://docs.nestjs.com/first-steps 了解 NestJS 项目的启动方式
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); // 使用 Cookie Parser 中间件
  app.use(
    '/index.html',
    proxy.createProxyMiddleware({
      target: 'https://prod-4g3qwhltc0f94f6c-1318691297.tcloudbaseapp.com',
      changeOrigin: true,
      pathRewrite: { '^/index.html': '' }
    })
  );

  await app.listen(CommonConfiguration.ServerBootstrapPort);
}

bootstrap();
