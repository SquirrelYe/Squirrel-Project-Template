<template>
  <view class="x-login-container">
    <view class="x-login-banner">
      <tui-banner-arc height="300" background="-webkit-linear-gradient(#0076ff,#fff)"></tui-banner-arc>
    </view>

    <view class="x-login-box">
      <image :src="CommonConfiguration.defaultUserAvatar" class="x-login-box-photo"></image>
    </view>

    <form>
      <view class="x-login-from">
        <!-- 注册表单 -->
        <view v-if="!isUserRegister" class="x-login-line-cell" style="margin-top: 28rpx">
          <tui-icon name="people" :size="20" color="#6d7a87"></tui-icon>
          <input type="nickname" @change="e => handleSyncOperation('nickname:change', e)" v-model="formUserNickname" class="x-login-input" placeholder="请输入昵称" />
        </view>

        <tui-button v-if="isUserRegister" height="80rpx" margin="60rpx 0 0 0" color="#0076ff" shape="circle" @click="e => handleAsyncOperation('user:login')">已注册，点击直接登录</tui-button>
        <tui-button v-else height="80rpx" margin="60rpx 0 0 0" color="#0076ff" shape="circle" @click="e => handleAsyncOperation('user:register')">注册</tui-button>

        <view class="x-login-protocol" hover-class="opcity" :hover-stay-time="150">
          点击"登录"即表示已同意
          <text class="x-login-protocol-red" @click="handleSyncOperation('protocol:nav')">《用户协议》</text>
        </view>
      </view>
    </form>

    <!-- 注册成功，展示注册码 OpenID -->
    <tui-modal
      :show="isShowTokenModal"
      title="注册成功"
      :button="modalButtonList"
      :content="`你的识别码为：${userIdentity}，请在阿拉AI助手中认证此识别码哦。`"
      @click="handleSyncOperation('openid:copy')"
    >
    </tui-modal>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow, onHide, onError, onLoad } from '@dcloudio/uni-app';

import { CommonConfiguration } from '@/config/common.config';
import { APIConfiguration } from '@/config/api.config';
import { RequestUtils } from '@/utils/request';

import { useSystemStore } from '@/stores/system';
import { useProfileStore } from '@/stores/profile';

import tuiText from '@/components/thorui/tui-text/tui-text.vue';
import tuiModal from '@/components/thorui/tui-modal/tui-modal.vue';
import tuiBannerArc from '@/components/thorui/tui-banner-arc/tui-banner-arc.vue';
import tuiIcon from '@/components/thorui/tui-icon/tui-icon.vue';
import tuiButton from '@/components/thorui/tui-button/tui-button.vue';

const modalButtonList = [{ text: '复制识别码并登录', type: 'primary', plain: false }];

// 业务Hooks
const systemStore = useSystemStore();
const profileStore = useProfileStore();

// 业务数据
const isUserRegister = ref(false);
const isShowTokenModal = ref(false);
const formUserNickname = ref('');
const userIdentity = computed(() => systemStore.sysMiniProgramConfig.UserIdentificationCodePrefix + profileStore.userOpenID);

onLoad(async () => {
  await handleAsyncOperation('user:verify');
});
onShow(() => {});
onHide(() => {});
onError(() => {});

// 异步处理汇总
// user:verify -> 验证用户是否注册
// user:login -> 登录
// user:register -> 注册
const handleAsyncOperation = async (type: string, args?: any) => {
  const requestUtils = new RequestUtils();
  switch (type) {
    case 'user:verify': {
      const reqPath = APIConfiguration.ApiAuthVerify;
      const reqObj = {};
      const [_, res] = await requestUtils.request({ path: reqPath, data: reqObj, header: {} });
      isUserRegister.value = !!res.Data;
      break;
    }
    case 'user:register': {
      if (!formUserNickname.value) {
        uni.showToast({ title: '请输入昵称', icon: 'error', duration: 2000 });
        return;
      }
      const reqPath = APIConfiguration.ApiAuthRegister;
      const reqObj = { UserName: formUserNickname.value };
      const [_, res] = await requestUtils.request({ path: reqPath, data: reqObj, header: {} });
      isShowTokenModal.value = true;
      break;
    }
    case 'user:login': {
      const reqPath = APIConfiguration.ApiAuthLogin;
      const reqObj = {};
      const [_, res] = await requestUtils.request({ path: reqPath, data: reqObj, header: {} });
      profileStore.setUserToken(res.Data.Token);
      profileStore.setUserIsLogin(true);

      // 跳转首页
      uni.switchTab({ url: '/pages/index/index' });
      break;
    }
    default:
      break;
  }
};

// 同步处理汇总
// protocol:nav -> 跳转协议
// nickname:change -> 修改昵称
// openid:copy -> 复制OpenID
const handleSyncOperation = (type: string, args?: any) => {
  switch (type) {
    case 'protocol:nav': {
      uni.navigateTo({ url: '/pages/login/protocol' });
      break;
    }
    case 'nickname:change': {
      formUserNickname.value = args.target.value;
      break;
    }
    case 'openid:copy': {
      uni.setClipboardData({ data: userIdentity.value }).then(() => {
        uni.showToast({ title: '复制成功', icon: 'none', duration: 2000 });
      });
      isShowTokenModal.value = false;
      // 登录
      handleAsyncOperation('user:login');
      break;
    }
    default:
      break;
  }
};
</script>

<style lang="scss" scoped>
.x-login-container {
  height: 100vh;
  width: 100vw;
  padding-bottom: env(safe-area-inset-bottom);
  background-color: #fff;
  .x-login-banner {
    position: absolute;
    width: 100vw;
  }

  .x-login-box {
    width: 100%;
    box-sizing: border-box;
    position: relative;
    padding-top: 80rpx;
  }

  .x-login-box-photo {
    height: 138rpx;
    width: 138rpx;
    display: block;
    margin: 10rpx auto 0 auto;
    border-radius: 50%;
    position: relative;
    z-index: 2;
  }

  .x-login-from {
    width: 100%;
    padding: 150rpx 104rpx 0 104rpx;
    box-sizing: border-box;
  }

  .x-login-input {
    font-size: 32rpx;
    flex: 1;
    display: inline-block;
    padding-left: 32rpx;
    box-sizing: border-box;
    overflow: hidden;
  }

  .x-login-input-phone {
    font-size: 32rpx;
    flex: 1;
    color: #333;
    display: inline-block;
    padding-left: 32rpx;
    box-sizing: border-box;
    overflow: hidden;
    justify-content: flex-start;
  }

  .x-login-line-cell {
    padding: 27rpx 0;
    display: -webkit-flex;
    display: flex;
    -webkiit-align-items: center;
    align-items: center;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
  }

  .x-login-line-cell::after {
    content: '';
    position: absolute;
    border-bottom: 1rpx solid #e0e0e0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    bottom: 0;
    right: 0;
    left: 0;
  }

  .x-login-protocol {
    color: #333;
    font-size: 24rpx;
    text-align: center;
    width: 100%;
    margin-top: 29rpx;
  }

  .x-login-protocol-red {
    color: #0076ff;
  }
}
</style>
