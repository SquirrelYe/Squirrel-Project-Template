/**
 * @description 基础枚举清单
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.20 11:00:32
 */

// 客户端设备类型
export enum SystemConfigurationClientRuntimeType {
  MiniProgramWeiXin = 'MiniProgramWeiXin',
  WebH5 = 'Web',
  AppAndroid = 'AppAndroid',
  AppIOS = 'AppIOS'
}

// 数据上报类型
export enum SystemConfigurationClientReportType {
  Device = 'Device',
  UserLogin = 'UserLogin',
  UserLogout = 'UserLogout',
  UserReach = 'UserReach'
}

// 数据上报来源
export enum SystemConfigurationClientReportSource {
  OnUserLogin = 'OnUserLogin',
  OnUserLogout = 'OnUserLogout',
  OnUserReach = 'OnUserReach',
  OnUserShare = 'OnUserShare',
  OnUserRewards = 'OnUserRewards',
  OnSystemLaunch = 'OnSystemLaunch',
  OnSystemRequestFail = 'OnSystemRequestFail'
}
