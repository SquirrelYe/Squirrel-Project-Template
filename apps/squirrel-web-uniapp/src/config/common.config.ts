/**
 * @description 通用配置文件
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.16 17:14:38
 */
class CommonConfiguration {
  // 环境配置
  public static readonly environment: 'development' | 'release' = 'development'; // 当前环境，development 开发环境，release 发布环境

  // 全局业务数据
  public static readonly requestSenderType: 'container' | 'http' = 'http'; // 请求发送方式，container 云托管，http 普通请求
  public static readonly requestUploadFileType: 'container' | 'http' = 'container'; // 文件上传方式，container 云托管，http 普通请求
  public static readonly requestHttpReleaseBaseUrl: string = 'https://xxxx.sh.run.tcloudbase.com';
  public static readonly requestHttpDevelopmentBaseUrl: string = 'http://127.0.0.1:3001';
  public static readonly requestContainerConfigEnvironment: string = 'prod-xxxx'; // 云托管环境ID
  public static readonly requestContainerConfigService: string = 'xxxx'; // 云托管服务名称

  public static readonly requestTimeout: number = 10 * 1000;
  public static readonly requestSuccessCode: number = 200;
  public static readonly requestSimulationHttpHeader: Record<string, string> = { 'x-wx-appid': 'xxxx', 'x-wx-openid': 'xxxx' }; // 开发环境下模拟请求头

  // 云托管COS业务数据
  public static readonly requestContainerFileWorkDirectory: string = 'server-storage'; // 云托管文件工作目录
  public static readonly requestContainerFileSessionFileUploadDirectory: string = 'session-file'; // 云托管文件会话文件上传目录
  public static readonly requestContainerFileUserAvatarUploadDirectory: string = 'user-avatar'; // 云托管文件用户头像上传目录

  // 部分弹窗业务数据
  public static readonly dialogButtonList: Array<any> = [{ text: '取消' }, { text: '确定', color: '#0076ff' }];
  public static readonly dialogUserGenderList: Array<string> = ['男', '女', '未知'];
  public static readonly dialogSysSettingModel: Array<any> = ['GPT 3.5', 'GPT 4.0'];
  public static readonly dialogSysSettingTemperature: Array<any> = ['精确', '正常', '更有创造性'];

  // 部分用户详细信息业务数据
  public static readonly defaultUserAvatar: string = '/static/system/avatar-default.png';
  public static readonly defaultUserNickName: string = '微信用户';
  public static readonly defaultUserGender: string = '未知';
  public static readonly defaultUserBirthday: string = '1990-01-01';
  public static readonly defaultUserPhone: string = '未绑定';

  // 页面常用图片数据
  public static readonly defaultNoDataIcon: string = '/static/system/img_nodata.png';
}

export { CommonConfiguration };
