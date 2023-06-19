/**
 * @description 公共配置类
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.19 20:15:23
 */
export class CommonConfiguration {
  // 数据库配置
  public static readonly DATABASE_DIALECT = 'mysql';
  public static readonly DATABASE_HOST = 'xxxx.sql.tencentcdb.com';
  public static readonly DATABASE_PORT = 8080;
  public static readonly DATABASE_USERNAME = 'root';
  public static readonly DATABASE_PASSWORD = 'xxxx';
  public static readonly DATABASE_DATABASE = 'xxxx-development';

  // 小程序开发者中心配置
  public static readonly WEIXIN_APP_SECRET = 'xxx';
  public static readonly WEIXIN_APP_ID = 'xxx';
  public static readonly WEIXIN_GRANT_TYPE = 'client_credential';

  // 鉴权配置
  public static readonly AUTH_JWT_SECRET = 'f1896f88-f2ad-4adf-a6f3-59a256061ea9';
  public static readonly AUTH_JWT_EXPIRESIN = '30d';

  // 微信小程序配置
  public static readonly WEICHAT_MINI_PROGRAM_CONFIGURATION = {};

  // 管理系统配置
  public static readonly ADMIN_SYSTEM_CONFIGURATION = {};
}
