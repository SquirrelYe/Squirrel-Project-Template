import { Injectable } from '@nestjs/common';
import { axiosService } from '@/util/request';
import { AxiosResponse } from 'axios';

/**
 * @description WeiXinService 微信服务类，用于处理微信相关业务逻辑，如微信开放平台接口调用等等
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.08 11:09:57
 */
@Injectable()
export class WeiXinService {
  /**
   * @description getWeiXinOpenAPIResult 获取微信开放平台接口调用结果
   * @author SquirrelYe <will@aesen.cc>
   * @time 2023.06.08 11:09:48
   */
  async getWeiXinOpenAPIResult(url: string) {
    let error: any, result: AxiosResponse;
    try {
      result = await axiosService.get(url);
    } catch (error) {
      error = error;
    }
    return [error, result];
  }

  /**
   * @description postWeiXinOpenAPIResult 获取微信开放平台接口调用结果（POST方式）
   * @author SquirrelYe <will@aesen.cc>
   * @time 2023.06.12 19:29:28
   */
  async postWeiXinOpenAPIResult(url: string, data: any) {
    let error: any, result: AxiosResponse;
    try {
      result = await axiosService.post(url, data);
    } catch (error) {
      error = error;
    }
    return [error, result];
  }
}
