/**
 * @description API 常量
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.18 15:31:19
 */
class ApiConstant {
  public static readonly ApiTest = '/api/v1/test/Test';
  public static readonly ApiTestListTableData = '/api/v1/test/ListTestTableData';
  public static readonly ApiTestAddTableData = '/api/v1/test/AddTestTableData';
  public static readonly ApiTestUpdateTableData = '/api/v1/test/UpdateTestTableData';

  public static readonly ApiAuthAdminLogin = '/api/v1/auth/AdminLogin'; // 管理员登录
  public static readonly ApiAuthAdminLogout = '/api/v1/auth/AdminLogout'; // 管理员登出

  public static readonly ApiAdminGetAdminProfile = '/api/v1/admin/GetAdminProfile'; // 获取管理员信息
}

export { ApiConstant };
