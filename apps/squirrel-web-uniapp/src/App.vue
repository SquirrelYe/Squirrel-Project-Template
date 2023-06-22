<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useSystemStore } from '@/stores/system';
import { useProfileStore } from '@/stores/profile';

import { APIConfiguration } from '@/config/api.config';
import { RequestUtils } from '@/utils/request';
import { SystemUtils } from '@/utils/system';

const systemStore = useSystemStore();
const profileStore = useProfileStore();

onLaunch(async () => {
  const requestUtils = new RequestUtils();
  const systemUtils = new SystemUtils();

  console.log('App Launch');

  // await systemUtils.testRequest(); // 测试请求
  await systemUtils.checkUpdate(); // 检查更新
  await systemUtils.getOpenId(); // 获取用户OpenID
  await systemUtils.reportDeviceInfo(); // 获取系统信息，数据上报数据分析
  await systemUtils.getSystemConfiguration(); // 拉取全局系统配置信息
  await systemUtils.validateUserLoginStatus(); // 验证用户登录状态

  // 判断用户是否登录
  const userIsLogin = profileStore.userIsLogin;
  if (!userIsLogin) {
    uni.redirectTo({ url: '/pages/login/login' });
  }
});

onShow(() => {});
onHide(() => {});
</script>

<style>
/* 每个页面公共css */
@import './styles/thorui.css';
@import './styles/common.css';

/* 引入自定义IconFont字体文件 */
@import './static/fonts/chat/iconfont-chat.css';
@import './static/fonts/element/iconfont-element.css';
</style>
