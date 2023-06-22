import { Injectable, Inject } from '@nestjs/common';
import { axiosService } from '@/util/request';
import { HandleException } from '@/framework/decorator/public.decorator';
import { CommonConfiguration } from '@/configuration/common.configuration';

import type { ServiceReturnType } from '@/types/index';

/**
 * @description WeiXinService 微信服务类，用于处理微信相关业务逻辑，如微信开放平台接口调用等等
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.08 11:09:57
 */
@Injectable()
export class WeiXinService {
  // 获取云托管对象存储票据签名
  @HandleException()
  async getWeiXinCloudBaseStorageTicketSignature(): ServiceReturnType<any> {
    const result = await axiosService.get('https://api.weixin.qq.com/_/cos/getauth');
    return [null, result];
  }

  // 获取微信Access Token
  @HandleException()
  async getWeiXinAccessToken(): ServiceReturnType<any> {
    const AppID = CommonConfiguration.WeiXinMiniProgramAppId;
    const Secret = CommonConfiguration.WeiXinMiniProgramAppSecret;
    const GrantType = 'client_credential';
    const QueryString = `?grant_type=${GrantType}&appid=${AppID}&secret=${Secret}`;
    const result = await axiosService.get(`https://api.weixin.qq.com/cgi-bin/token${QueryString}`);
    return [null, result];
  }

  // 获取用户电话号码
  @HandleException()
  async getWeiXinUserPhoneNumber(Code: string, AccessToken: string): ServiceReturnType<any> {
    const QueryString = `?access_token=${AccessToken}`;
    const reqbody = { code: Code };
    const result = await axiosService.post(`https://api.weixin.qq.com/wxa/business/getuserphonenumber${QueryString}`, reqbody);
    return [null, result];
  }

  // 获取用户OpenId
  @HandleException()
  async getWeiXinUserOpenID(Code: string): ServiceReturnType<any> {
    const AppID = CommonConfiguration.WeiXinMiniProgramAppId;
    const Secret = CommonConfiguration.WeiXinMiniProgramAppSecret;
    const GrantType = 'authorization_code';
    const QueryString = `?grant_type=${GrantType}&appid=${AppID}&secret=${Secret}&js_code=${Code}`;
    const result = await axiosService.get(`https://api.weixin.qq.com/sns/jscode2session${QueryString}`);
    return [null, result];
  }
}
