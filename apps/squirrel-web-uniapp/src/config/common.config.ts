import { UniappConfiguration } from '@/config/uniapp.configuration';

/**
 * @description 通用配置文件
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.16 17:14:38
 */
class CommonConfiguration extends UniappConfiguration {
  // 环境配置
  // 注意：development 环境会在请求头中添加模拟请求头并且使用开发环境的请求地址
  // 注意：release 环境会直接请求云托管服务，服务会自动添加请求头
  public static readonly environment: 'development' | 'release' = 'release';

  // 系统配置信息
  public static readonly SystemConfigurationTypeMiniProgram: string = 'MiniProgram'; // 系统配置类型-小程序
  public static readonly SystemConfigurationTypeWeb: string = 'Web'; // 系统配置类型-Web
  public static readonly SystemConfigurationTypeApp: string = 'App'; // 系统配置类型-App
  public static readonly SystemReportTypeDevice: string = 'Device'; // 系统上报类型-设备
  public static readonly SystemReportSourceMiniProgram: string = 'MiniProgram'; // 系统上报来源-小程序

  // 部分弹窗业务数据
  public static readonly dialogButtonList: Array<any> = [{ text: '取消' }, { text: '确定', color: '#0076ff' }];
  public static readonly dialogUserGenderList: Array<string> = ['男', '女', '未知'];
  public static readonly dialogSysSettingModel: Array<string> = ['GPT 3.5', 'GPT 4.0'];
  public static readonly dialogSysSettingTemperature: Array<string> = ['精确', '正常', '更有创造性'];

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
