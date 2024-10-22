import { APIConfiguration } from '@/config/api.config';
import { CommonConfiguration } from '@/config/common.config';
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
      Type: CommonConfiguration.SystemReportTypeDevice,
      Source: CommonConfiguration.SystemReportSourceMiniProgram,
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
    const reqSysConfigObj = { Type: CommonConfiguration.SystemConfigurationTypeMiniProgram };
    const [sysConfigerr, sysConfigres] = await requestUtils.request({ path: reqSysConfigPath, data: reqSysConfigObj, header: {} });
    if (sysConfigerr) {
      uni.showToast({ title: '系统配置信息拉取失败', icon: 'none' });
      return;
    }

    const systemStore = useSystemStore();
    systemStore.setSysMiniProgramConfig(sysConfigres.Data);
  }

  // 获取OpenId
  public async getOpenId() {
    const loginCode = await uni.login({ provider: 'weixin' });
    const reqPath = APIConfiguration.ApiWeiXinGetOpenId;
    const reqObj = { Code: loginCode.code };
    const [usererr, userres] = await requestUtils.request({ path: reqPath, method: 'POST', data: reqObj, header: {} });
    if (usererr) return;
    const { OpenId, SessionKey } = userres.Data;
    useProfileStore().setUserOpenID(OpenId, SessionKey);
  }

  // 验证用户登录态
  public async validateUserLoginStatus() {
    const profileStore = useProfileStore();
    const reqValidatePath = APIConfiguration.ApiAuthValidate;
    const reqValidateObj = {};

    const [validateerr, validateres] = await requestUtils.request({ path: reqValidatePath, data: reqValidateObj, header: {} });
    if (validateerr) {
      profileStore.clearUserLoginStatus();
      uni.showToast({ title: '用户登录态验证失败', icon: 'none' });
      uni.redirectTo({ url: '/pages/login/login' });
      return;
    }
  }

  // 测试请求
  public async testRequest() {
    const reqPath = APIConfiguration.ApiTestRequest;
    const reqObj = { Name: 'SquirrelYe' };
    const [testerr, testres] = await requestUtils.request({ path: reqPath, method: 'POST', data: reqObj, header: {} });
    if (testerr) {
      uni.showToast({ title: '测试请求失败', icon: 'none' });
      return;
    }
    console.log('测试请求 --->', testres);
  }
}

export { SystemUtils };
