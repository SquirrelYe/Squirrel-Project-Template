/**
 * @description 权限管理
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.17 17:08:45
 * @see https://v3.umijs.org/zh-CN/plugins/plugin-access
 */
export default function access(initialState: Record<string, any>) {
  console.log('access', initialState);
  const { currentAdminProfile } = initialState ?? {};

  return {
    AccessRoleAdmin: currentAdminProfile && currentAdminProfile.access === 'admin'
  };
}
