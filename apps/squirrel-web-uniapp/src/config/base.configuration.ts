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
  public static readonly ProjectName: string = '网评小助手'; // 项目名称

  // 微信公众平台设置
  public static readonly WeiXinMiniProgramAppId: string = 'wxb2f6eb6d4540367f'; // 微信小程序 AppId
  public static readonly WeiXinMiniProgramAppSecret: string = '0fdb296e4b64b178f00584a97c7372d8'; // 微信小程序 AppSecret

  // 云托管 服务配置清单
  public static readonly WeiXinCloudBaseBaseUrl: string = 'https://online-review-server-55426-9-1318691297.sh.run.tcloudbase.com'; // 微信云托管 基础URL
  public static readonly WeiXinCloudBaseEnvironment: string = 'prod-4g3qwhltc0f94f6c'; // 微信云托管 环境ID
  public static readonly WeiXinCloudBaseServiceName: string = 'online-review-server'; // 微信云托管 服务名称

  // 云托管 对象存储配置清单
  public static readonly WeiXinCloudBaseFileStorageBucket: string = '7072-prod-4g3qwhltc0f94f6c-1318691297'; // 云托管 文件存储桶
  public static readonly WeiXinCloudBaseFileStorageRegion: string = 'ap-shanghai'; // 云托管 文件存储区域
  public static readonly WeiXinCloudBaseFileUserAvatarUploadDirectory: string = 'server-storage/user-avatar'; // 云托管 文件用户头像上传目录

  // 云托管 数据库配置清单
  public static readonly WeiXinCloudBaseDatabaseDialect: string = 'mysql'; // 云托管 数据库方言
  public static readonly WeiXinCloudBaseDatabaseHost: string = 'sh-cynosdbmysql-grp-qkjz9o5u.sql.tencentcdb.com'; // 云托管 数据库主机
  public static readonly WeiXinCloudBaseDatabasePort: number = 25110; // 云托管 数据库端口
  public static readonly WeiXinCloudBaseDatabaseUsername: string = 'root'; // 云托管 数据库用户名
  public static readonly WeiXinCloudBaseDatabasePassword: string = 'OnlineReview@0615'; // 云托管 数据库密码
  public static readonly WeiXinCloudBaseDatabaseDatabase: string = 'online-review-mysql-development'; // 云托管 数据库名称
}

export { BaseConfiguration };
