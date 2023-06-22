/**
 * @description Api配置文件
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.16 17:14:38
 */
class APIConfiguration {
  public static readonly ApiTestRequest = '/api/v1/test/test';

  public static readonly ApiWeiXinGetUserPhoneNumber = '/api/v1/weixin/getUserPhoneNumber'; // 获取微信用户手机号
  public static readonly ApiWeiXinGetOpenId = '/api/v1/weixin/getOpenId'; // 获取微信用户OpenId
  public static readonly ApiWeiXinGetCosSignatureToken = '/api/v1/weixin/getCosSignatureToken'; // 获取云托管对象存储票据信息，已废弃
  public static readonly ApiWeiXinGetCosUploadFileUrl = '/api/v1/weixin/getCosUploadFileUrl'; // 获取云托管对象存储上传文件地址

  public static readonly ApiSystemGetConfiguration = '/api/v1/system/GetSystemConfiguration'; // 获取系统配置
  public static readonly ApiSystemReportDeviceInfo = '/api/v1/system/ReportDeviceInfo'; // 上报用户设备信息

  public static readonly ApiAuthVerify = '/api/v1/auth/Verify'; // 验证用户是否存在
  public static readonly ApiAuthValidate = '/api/v1/auth/Validate'; // 验证用户登录态
  public static readonly ApiAuthLogin = '/api/v1/auth/Login'; // 用户登录
  public static readonly ApiAuthLogout = '/api/v1/auth/Logout'; // 用户登出
  public static readonly ApiAuthRegister = '/api/v1/auth/Register'; // 用户注册

  public static readonly ApiGetUserProfile = '/api/v1/user/GetUserProfile'; // 获取用户信息
  public static readonly ApiUpdateUserProfile = '/api/v1/user/UpdateUserProfile'; // 更新用户信息
  public static readonly ApiGetUserConfiguration = '/api/v1/user/GetUserConfiguration'; // 获取用户配置
  public static readonly ApiUpdateUserConfiguration = '/api/v1/user/UpdateUserConfiguration'; // 更新用户配置
}

export { APIConfiguration };
