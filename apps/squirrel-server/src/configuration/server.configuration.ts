import { BaseConfiguration } from '@/configuration/base.configuration';

/**
 * @description 后台项目 NestJS 配置清单
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.20 09:48:34
 */
class ServerConfiguration extends BaseConfiguration {
  constructor() {
    super();
    this.configurationName = 'ServerConfiguration';
    this.configurationDescription = '后台项目 NestJS 配置清单';
  }

  // 运行设置
  public static readonly ServerBootstrapPort: number = 3000; // 服务端口

  // 微信服务设置
  public static readonly SystemWechatAccessTokenRefreshInterval: number = 7 * 1000 * 1000; // 微信 AccessToken 刷新间隔，每7000秒刷新一次

  // 鉴权配置
  public static readonly AuthenticationJwtSecret: string = 'f1896f88-f2ad-4adf-a6f3-59a256061ea9'; // 鉴权 JWT 密钥
  public static readonly AuthenticationJwtExpiresIn: string = '7d'; // 鉴权 JWT 过期时间
}

export { ServerConfiguration };
