/**
 * @description 基础配置清单
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.20 09:41:21
 */
class BaseConfiguration {
  public configurationName: string;
  public configurationDescription: string;

  constructor() {
    this.configurationName = 'BaseConfiguration';
    this.configurationDescription = '基础配置清单';
  }

  // 项目设置
  public static readonly ProjectName: string = '项目名称'; // 项目名称

  // 微信公众平台设置
  public static readonly WeiXinMiniProgramAppId: string = 'xxxx'; // 微信小程序 AppId
  public static readonly WeiXinMiniProgramAppSecret: string = 'xxxx'; // 微信小程序 AppSecret
  public static readonly WeiXinMiniProgramGrantType: string = 'client_credential'; // 微信小程序 GrantType

  // 云托管 服务配置清单
  public static readonly WeiXinCloudBaseBaseUrl: string = 'https://xxxx-prod.sh.run.tcloudbase.com'; // 微信云托管 基础URL
  public static readonly WeiXinCloudBaseEnvironment: string = 'xxxx'; // 微信云托管 环境ID
  public static readonly WeiXinCloudBaseServiceName: string = 'xxxx'; // 微信云托管 服务名称

  // 云托管 对象存储配置清单
  public static readonly WeiXinCloudBaseFileStorageBucket: string = 'xxxx'; // 云托管 文件存储桶
  public static readonly WeiXinCloudBaseFileStorageRegion: string = 'ap-shanghai'; // 云托管 文件存储区域
  public static readonly WeiXinCloudBaseFileWorkDirectory: string = 'server-storage'; // 云托管 文件工作目录
  public static readonly WeiXinCloudBaseFileUserAvatarUploadDirectory: string = 'user-avatar'; // 云托管 文件用户头像上传目录

  // 云托管 数据库配置清单
  public static readonly WeiXinCloudBaseDatabaseDialect: string = 'mysql'; // 云托管 数据库方言
  public static readonly WeiXinCloudBaseDatabaseHost: string = '127.0.0.1'; // 云托管 数据库主机
  public static readonly WeiXinCloudBaseDatabasePort: number = 3306; // 云托管 数据库端口
  public static readonly WeiXinCloudBaseDatabaseUsername: string = 'dbuser'; // 云托管 数据库用户名
  public static readonly WeiXinCloudBaseDatabasePassword: string = 'dbpassword'; // 云托管 数据库密码
  public static readonly WeiXinCloudBaseDatabaseDatabase: string = 'xxxx-development'; // 云托管 数据库名称
}

export { BaseConfiguration };
