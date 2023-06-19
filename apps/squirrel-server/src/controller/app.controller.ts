import { Inject } from '@nestjs/common';
import { Controller, Post, Headers, Body, Query, Request, HttpCode, HttpStatus, HttpException } from '@nestjs/common';

import { AppService } from '@/service/app.service';
import { AuthService } from '@/service/auth.service';
import { UserService } from '@/service/user.service';

import { R } from '@/util/R';
import { Logger } from '@/util/logger';
import { Public, Roles, Role } from '@/framework/decorator/public.decorator';

const logger = new Logger('AppController');

@Controller('/api/v1/app')
export class AppController {
  @Inject() private readonly appService: AppService;
  @Inject() private readonly authService: AuthService;
  @Inject() private readonly userService: UserService;

  @Post('/test')
  @Public()
  @Roles(Role.Admin, Role.WeChatMiniProgram)
  @HttpCode(HttpStatus.OK)
  async test(@Request() request: Request, @Headers() headers: Record<string, any>, @Body() body: Record<string, any>, @Query() querys: Record<string, any>) {
    logger.log('headers --->', headers);
    logger.log('body --->', body);
    logger.log('querys --->', querys);
    logger.log('request --->', request);

    const [errtoken, restoken] = await this.authService.generateToken('openid_xxxxx', [Role.User]);
    const [erruser, resuser] = await this.appService.listUser();

    return R.ok({ Token: restoken, Data: resuser });
  }
}
