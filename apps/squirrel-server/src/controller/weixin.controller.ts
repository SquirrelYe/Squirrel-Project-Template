import { Inject } from '@nestjs/common';
import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

import { WeiXinService } from '@/service/weixin.service';
import { SystemConfigurationService } from '@/service/system.service';
import { Public, Role } from '@/framework/decorator/public.decorator';
import { Logger } from '@/util/logger';
import { R } from '@/util/R';

const logger = new Logger('WeiXinController');

@Controller('/api/v1/weixin')
export class WeiXinController {
  @Inject() private readonly weiXinService: WeiXinService;
  @Inject() private readonly systemConfigurationService: SystemConfigurationService;

  @Get('/getCosSignatureToken')
  @HttpCode(HttpStatus.OK)
  async getCosSignatureToken() {
    const [error, result] = await this.weiXinService.getWeiXinCloudBaseStorageTicketSignature();
    if (error) return R.error(-1, error);
    return R.ok(result);
  }

  @Post('/getUserPhoneNumber')
  @HttpCode(HttpStatus.OK)
  async getUserPhoneNumber(@Body() body: any) {
    const Code = body.Code;

    // 获取微信AccessToken
    const [tokenerr, tokenres] = await this.systemConfigurationService.getWechatAccessToken();
    if (tokenerr) return R.error(-1, tokenerr);

    // 获取微信用户手机号
    const AccessToken = tokenres.Content;
    const [error, result] = await this.weiXinService.getWeiXinUserPhoneNumber(Code, AccessToken);
    if (error) return R.error(-1, error);
    return R.ok(result);
  }

  @Post('/getOpenId')
  @Public()
  @HttpCode(HttpStatus.OK)
  async getOpenId(@Body() body: any) {
    const Code = body.Code;
    const [error, result] = await this.weiXinService.getWeiXinUserOpenID(Code);
    if (error) return R.error(-1, error);
    return R.ok({ OpenId: result.openid, SessionKey: result.session_key });
  }
}
