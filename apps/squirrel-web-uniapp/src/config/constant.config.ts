/**
 * @description 常量配置文件
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.16 17:14:38
 */
class ConstantConfiguration {
  public static readonly SystemConfigurationTypeMiniProgram: string = 'MiniProgram'; // 系统配置类型-小程序
  public static readonly SystemConfigurationTypeWeb: string = 'Web'; // 系统配置类型-Web
  public static readonly SystemConfigurationTypeApp: string = 'App'; // 系统配置类型-App

  public static readonly SystemReportTypeDevice: string = 'Device'; // 系统上报类型-设备
  public static readonly SystemReportSourceMiniProgram: string = 'MiniProgram'; // 系统上报来源-小程序
}

export { ConstantConfiguration }