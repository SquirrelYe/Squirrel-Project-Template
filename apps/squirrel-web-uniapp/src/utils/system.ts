import { APIConfiguration } from '@/config/api.config';
import { ConstantConfiguration } from '@/config/constant.config';
import { RequestUtils } from '@/utils/request';

import { useSystemStore } from '@/stores/system';
import { useProfileStore } from '@/stores/profile';

const requestUtils = new RequestUtils();

/**
 * @description 系统相关工具汇总
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.16 17:22:42
 */
class SystemUtils {
  // 检测更新
  public async checkUpdate() {
    if (uni.canIUse('getUpdateManager')) {
      const updateManager = uni.getUpdateManager();
      updateManager.onCheckForUpdate(res => {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            uni.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: res => {
                if (res.confirm) {
                  updateManager.applyUpdate();
                }
              }
            });
          });
          updateManager.onUpdateFailed(() => {
            // 新的版本下载失败
            uni.showModal({ title: '更新提示', content: '新版本更新失败，为了获得更好的体验，请您删除当前小程序，重新搜索打开！', showCancel: false });
          });
        }
      });
    }
  }

  // 上报用户设备信息
  public async reportDeviceInfo() {
    const res = uni.getSystemInfoSync();
    const reqSysConfigPath = APIConfiguration.ApiSystemReportDeviceInfo;
    const reqSysConfigObj = {
      Type: ConstantConfiguration.SystemReportTypeDevice,
      Source: ConstantConfiguration.SystemReportSourceMiniProgram,
      Content: res
    };
    const [deviceerr, deviceres] = await requestUtils.request({ path: reqSysConfigPath, data: reqSysConfigObj, header: {} });
    console.log('上报用户设备信息 --->', deviceerr, deviceres);

    const systemStore = useSystemStore();
    systemStore.setSysDeviceInfo(res);
  }

  // 获取系统配置
  public async getSystemConfiguration() {
    const reqSysConfigPath = APIConfiguration.ApiSystemGetConfiguration;
    const reqSysConfigObj = { Type: ConstantConfiguration.SystemConfigurationTypeMiniProgram };
    const [sysConfigerr, sysConfigres] = await requestUtils.request({ path: reqSysConfigPath, data: reqSysConfigObj, header: {} });
    if (sysConfigerr) {
      uni.showToast({ title: '系统配置信息拉取失败', icon: 'none' });
      return;
    }

    const systemStore = useSystemStore();
    systemStore.setSysMiniProgramConfig(sysConfigres.Data);
  }
}

export { SystemUtils };