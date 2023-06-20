import { BaseConfiguration } from '@/configuration/base.configuration';

/**
 * @description Uniapp 配置清单
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.20 09:40:15
 */
class UniappConfiguration extends BaseConfiguration {
  constructor() {
    super();
    this.configurationName = 'UniappConfiguration';
    this.configurationDescription = 'Uniapp 配置清单';
  }

  // 本地开发数据
  public static readonly RequestTimeout: number = 10 * 1000;
  public static readonly RequestSuccessCode: number = 200;
  public static readonly RequestSuccessResponseCode: number = 0;
  public static readonly RequestHttpDevelopmentBaseUrl: string = 'http://127.0.0.1:3001';
  public static readonly RequestHttpDevelopmentSimulationHttpHeader: Record<string, string> = { 'x-wx-appid': 'xxxx', 'x-wx-openid': 'xxxx' }; // 开发环境下模拟请求头
}

export { UniappConfiguration };
