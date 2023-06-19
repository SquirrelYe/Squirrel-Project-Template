import { Module } from '@nestjs/common';

import { AppController } from '@/controller/app.controller';
import { AuthController } from '@/controller/auth.controller';
import { WeiXinController } from '@/controller/weixin.controller';
import { UserController } from '@/controller/user.controller';
import { AdminController } from '@/controller/admin.controller';
import { TestController } from '@/controller/test.controller';
import { SystemController } from '@/controller/system.controller';

import { AppService } from '@/service/app.service';
import { AuthService } from '@/service/auth.service';
import { WeiXinService } from '@/service/weixin.service';
import { UserService } from '@/service/user.service';

import { frameworkProviders } from '@/framework/provider/framework.provider';
import { databaseProviders } from '@/framework/provider/database.provider';
import { repositoryProviders } from '@/framework/provider/repository.provider';

@Module({
  imports: [],
  controllers: [AppController, WeiXinController, UserController, AdminController, AuthController, TestController, SystemController],
  providers: [AppService, AuthService, WeiXinService, UserService, ...frameworkProviders, ...databaseProviders, ...repositoryProviders]
})
export class AppModule {}
