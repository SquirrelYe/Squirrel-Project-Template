import { Inject } from '@nestjs/common';
import { Controller, Post, Headers, Body, Query, Request, HttpCode, HttpStatus, HttpException } from '@nestjs/common';

import { AppService } from '@/service/app.service';
import { AuthService } from '@/service/auth.service';
import { UserService } from '@/service/user.service';

import { R } from '@/util/R';
import { Logger } from '@/util/logger';
import { Public, Roles, Role } from '@/framework/decorator/public.decorator';

const logger = new Logger('AppController');

@Controller('/api/v1/test')
export class TestController {
  @Inject() private readonly appService: AppService;
  @Inject() private readonly authService: AuthService;
  @Inject() private readonly userService: UserService;

  @Post('/Test')
  @Public()
  @Roles(Role.Admin, Role.WeChatMiniProgram)
  @HttpCode(HttpStatus.OK)
  async Test(@Request() request: Request, @Headers() headers: Record<string, any>, @Body() body: Record<string, any>, @Query() querys: Record<string, any>) {
    logger.log('headers --->', headers);
    logger.log('body --->', body);
    logger.log('querys --->', querys);
    logger.log('request --->', request);

    const [errtoken, restoken] = await this.authService.generateToken('openid_xxxxx', [Role.User]);
    const [erruser, resuser] = await this.appService.listUser();

    return R.ok({ Token: restoken, Data: resuser });
  }

  @Post('/ListTestTableData')
  @Public()
  @Roles(Role.Admin, Role.WeChatMiniProgram)
  @HttpCode(HttpStatus.OK)
  async ListTestTableData(@Body() body: Record<string, any>) {
    logger.log('body --->', body);

    return R.ok({
      Data: [
        {
          key: 99,
          disabled: false,
          href: 'https://ant.design',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
          name: 'TradeCode 99',
          owner: '曲丽丽',
          desc: '这是一段描述',
          callNo: 503,
          status: '0',
          updatedAt: '2022-12-06T05:00:57.040Z',
          createdAt: '2022-12-06T05:00:57.040Z',
          progress: 81
        }
      ],
      Total: 100,
      Success: true,
      PageSize: 20,
      Current: 1
    });
  }

  @Post('/AddTestTableData')
  @Public()
  @Roles(Role.Admin, Role.WeChatMiniProgram)
  @HttpCode(HttpStatus.OK)
  async AddTestTableData(@Body() body: Record<string, any>) {
    logger.log('body --->', body);

    return R.ok({});
  }

  @Post('/UpdateTestTableData')
  @Public()
  @Roles(Role.Admin, Role.WeChatMiniProgram)
  @HttpCode(HttpStatus.OK)
  async UpdateTestTableData(@Body() body: Record<string, any>) {
    logger.log('body --->', body);

    return R.ok({});
  }
}
