import 'module-alias/register';

import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); // 使用 Cookie Parser 中间件

  await app.listen(3001);
}

bootstrap();
