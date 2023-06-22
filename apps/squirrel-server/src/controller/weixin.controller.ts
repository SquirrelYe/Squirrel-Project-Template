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

  // 获取微信小程序云开发存储签名，暂时不开启开放接口调用，此处禁用
  @Get('/getCosSignatureToken')
  @HttpCode(HttpStatus.OK)
  async getCosSignatureToken() {
    const [error, result] = await this.weiXinService.getWeiXinCloudBaseStorageTicketSignature();
    if (error) return R.error(-1, error);
    return R.ok(result);
  }

  // 获取用户手机号
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

  // 获取微信用户OpenId
  @Post('/getOpenId')
  @Public()
  @HttpCode(HttpStatus.OK)
  async getOpenId(@Body() body: any) {
    const Code = body.Code;
    const [error, result] = await this.weiXinService.getWeiXinUserOpenID(Code);
    if (error) return R.error(-1, error);
    return R.ok({ OpenId: result.openid, SessionKey: result.session_key });
  }

  // 获取对象存储文件上传链接
  @Post('/getCosUploadFileUrl')
  @HttpCode(HttpStatus.OK)
  async getCosUploadFileUrl(@Body() body: any) {
    const Path = body.Path;

    // 获取微信AccessToken
    const [tokenerr, tokenres] = await this.systemConfigurationService.getWechatAccessToken();
    if (tokenerr) return R.error(-1, tokenerr);

    // 获取微信对象存储文件上传链接
    const AccessToken = tokenres.Content;
    const [error, result] = await this.weiXinService.getWeiXinCloudBaseStorageUploadFileUrl(Path, AccessToken);
    const { errcode, errmsg, url, token, authorization, file_id, cos_file_id } = result || {};
    if (error || errcode !== 0) return R.error(-1, error || errmsg);
    return R.ok({
      Url: url,
      Token: token,
      Authorization: authorization,
      FileId: file_id,
      CosFileId: cos_file_id
    });
  }
}
