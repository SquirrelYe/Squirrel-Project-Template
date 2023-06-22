import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages';
import { UniappConfiguration } from '@squirreljs/squirrel-project-settings';

export default defineUniPages({
  tabBar: {
    color: '#2c2c2c',
    selectedColor: '#0076ff',
    borderStyle: 'black',
    backgroundColor: '#ffffff',
    height: '50px',
    fontSize: '10px',
    iconWidth: '24px',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'static/system/tabbar/home.png',
        selectedIconPath: 'static/system/tabbar/home_selected.png'
      },
      {
        pagePath: 'pages/index/profile',
        text: '我的',
        iconPath: 'static/system/tabbar/me.png',
        selectedIconPath: 'static/system/tabbar/me_selected.png'
      }
    ]
  },
  globalStyle: {
    navigationBarTextStyle: 'black',
    navigationBarTitleText: UniappConfiguration.ProjectName,
    navigationBarBackgroundColor: '#f8f8f8',
    backgroundColor: '#f8f8f8'
  },
  usingComponents: {},
  easycom: {
    autoscan: false,
    custom: {}
  },
  pages: [
    {
      path: 'pages/index/index',
      style: {
        navigationBarBackgroundColor: '#f8f8f8',
        navigationBarTextStyle: 'black',
        navigationBarTitleText: '首页信息',
        'mp-weixin': { disableScroll: true }
      }
    },
    {
      path: 'pages/index/profile',
      style: {
        navigationBarBackgroundColor: '#FFFFFF',
        navigationBarTextStyle: 'black',
        navigationBarTitleText: '个人中心',
        'mp-weixin': { disableScroll: true }
      }
    },
    {
      path: 'pages/profile/setting',
      style: {
        navigationBarBackgroundColor: '#FFFFFF',
        navigationBarTextStyle: 'black',
        navigationBarTitleText: '个人信息',
        'mp-weixin': { disableScroll: true }
      }
    },
    {
      path: 'pages/setting/index',
      style: {
        navigationBarBackgroundColor: '#FFFFFF',
        navigationBarTextStyle: 'black',
        navigationBarTitleText: '系统设置',
        'mp-weixin': { disableScroll: true }
      }
    },
    {
      path: 'pages/about/index',
      style: {
        navigationBarBackgroundColor: '#FFFFFF',
        navigationBarTextStyle: 'black',
        navigationBarTitleText: '关于系统',
        'mp-weixin': { disableScroll: true }
      }
    },
    {
      path: 'pages/login/login',
      style: {
        navigationBarBackgroundColor: '#0076ff',
        navigationBarTextStyle: 'black',
        navigationBarTitleText: '',
        'mp-weixin': { disableScroll: true }
      },
      layout: 'default'
    },
    {
      path: 'pages/login/protocol',
      style: {
        navigationBarBackgroundColor: '#FFFFFF',
        navigationBarTextStyle: 'black',
        navigationBarTitleText: '用户协议',
        'mp-weixin': { disableScroll: false }
      }
    }
  ]
});
