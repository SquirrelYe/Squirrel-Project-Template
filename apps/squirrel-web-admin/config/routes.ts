/**
 * @description 路由配置
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.17 17:07:42
 * @see https://v3.umijs.org/zh-CN/docs/routing
 * @see https://umijs.org/docs/max/introduce -- UniJS Max
 */
const Routes = [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './Login' }]
  },
  { path: '/welcome', name: '欢迎', icon: 'SmileFilled', component: './Welcome' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'CrownFilled',
    access: 'AccessRoleAdmin', // 权限判断参考 src/access.ts
    routes: [
      { path: '/admin', redirect: '/admin/table' },
      { path: '/admin/table', name: '二级管理页', component: './Admin' }
    ]
  },
  { path: '/list', name: '查询表格', icon: 'TabletFilled', component: './TableList/TableTest' },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' }
];

export { Routes };
