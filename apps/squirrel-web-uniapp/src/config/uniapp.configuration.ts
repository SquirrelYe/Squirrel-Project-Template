import { BaseConfiguration } from '@/config/base.configuration';

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

  // 请求设置
  public static readonly RequestTimeout: number = 10 * 1000;
  public static readonly RequestSuccessCode: number = 200;
  public static readonly RequestSuccessResponseCode: number = 0;
  public static readonly RequestHttpDevelopmentBaseUrl: string = 'http://127.0.0.1:3000';
  public static readonly RequestHttpReleaseBaseUrl: string = 'https://xxxx.sh.run.tcloudbase.com';
}

export { UniappConfiguration };
