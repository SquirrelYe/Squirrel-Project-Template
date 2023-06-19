import { ConsoleLogger, Inject } from '@nestjs/common';
import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

import { CommonConfiguration } from '@/configuration/common.configuration';
import { WeiXinService } from '@/service/weixin.service';
import { R } from '@/util/R';

const logger = new ConsoleLogger('WeiXinController');

@Controller('/api/v1/weixin')
export class WeiXinController {
  @Inject() private readonly weiXinService: WeiXinService;

  @Get('/getwxadevinfo')
  @HttpCode(HttpStatus.OK)
  async getWxAdevInfo() {
    const [error, result] = await this.weiXinService.getWeiXinOpenAPIResult('http://api.weixin.qq.com/wxa/getwxadevinfo');
    if (error) return R.error(-1, error);
    return R.ok(result);
  }

  @Get('/getauth')
  @HttpCode(HttpStatus.OK)
  async getWxAuthInfo() {
    const [error, result] = await this.weiXinService.getWeiXinOpenAPIResult('http://api.weixin.qq.com/_/cos/getauth');
    if (error) return R.error(-1, error);
    return R.ok(result);
  }

  @Post('/getuserphonenumber')
  @HttpCode(HttpStatus.OK)
  async getUserPhoneNumber(@Body() body: any) {
    const Code = body.Code;
    // const AccessToken = body.AccessToken;
    // const QueryString = `?access_token=${AccessToken}`; // 云开发不再需要 AccessToken
    const reqbody = { code: Code };
    const [error, result] = await this.weiXinService.postWeiXinOpenAPIResult('http://api.weixin.qq.com/wxa/business/getuserphonenumber', reqbody);
    if (error) return R.error(-1, error);
    return R.ok(result);
  }

  // 此接口仅在开发环境下可用，本地开发环境还是需要获取 AccessToken 来进行微信API调用
  @Post('/getaccesstoken')
  @HttpCode(HttpStatus.OK)
  async getAccessToken() {
    const Secret = CommonConfiguration.WEIXIN_APP_SECRET;
    const AppID = CommonConfiguration.WEIXIN_APP_ID;
    const GrantType = CommonConfiguration.WEIXIN_GRANT_TYPE;
    const QueryString = `?grant_type=${GrantType}&appid=${AppID}&secret=${Secret}`;
    const [error, result] = await this.weiXinService.getWeiXinOpenAPIResult('http://api.weixin.qq.com/cgi-bin/token' + QueryString);
    if (error) return R.error(-1, error);
    return R.ok(result);
  }
}
