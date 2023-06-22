import { defineStore } from 'pinia';

export const useSystemStore = defineStore('system', {
  state: () => {
    return {
      sysVersion: '1.0.0', // App版本
      sysReturnUrl: '', // 登录后跳转的页面路径 + 页面参数
      sysNetworkConnected: true, // 当前是否有网络连接
      sysIsOnline: false, // 当前是否在线

      sysIsIOS: true, // 是否是IOS
      sysIsAndroid: false, // 是否是Android
      sysPlatform: '', // 平台

      sysIsNetworkLoading: false, // 是否正在请求网络
      sysIsShowTabbar: true, // 是否显示底部导航栏

      sysMiniProgramConfig: {} as any, // 小程序配置
      sysDeviceInfo: {} as any // 设备信息
    };
  },
  actions: {
    setSysMiniProgramConfig(config: any) {
      this.sysMiniProgramConfig = config;
      uni.setStorageSync('system::sys_mini_program_config', config);
    },
    setSysDeviceInfo(deviceInfo: any) {
      this.sysDeviceInfo = deviceInfo;
      uni.setStorageSync('system::sys_device_info', deviceInfo);
    }
  }
});
