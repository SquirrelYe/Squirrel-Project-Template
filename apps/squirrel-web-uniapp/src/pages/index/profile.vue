<template>
  <view class="x-profile-container">
    <tui-list-view title="" unlined="all">
      <!-- 顶部简要信息展示 -->
      <view class="x-profile-header-center">
        <image :src="userProfile.avatar" class="x-profile-avatar" @click="handleSyncOperation('profile:edit')"></image>

        <view class="x-profile-info">
          <view class="x-profile-nickname"> {{ userProfile.nickname }} </view>
          <view class="x-profile-explain">{{ userProfile.explain }}</view>
        </view>

        <view class="x-profile-set-box">
          <view class="x-profile-icon-box tui-icon-setup" @click="handleSyncOperation('profile:edit')">
            <tui-icon name="edit" color="" :size="22"></tui-icon>
          </view>
        </view>
      </view>

      <tui-list-cell @click="(e: any) => handleSyncOperation('menu:choose', 'setting')" :arrow="true">
        <view class="x-profile-item-box">
          <tui-icon color="#5677fc" :size="20" customPrefix name="iconfont-chat icon-chat-act_shezhi_fill"></tui-icon>
          <view class="x-profile-list-cell_name">聊天设置</view>
        </view>
      </tui-list-cell>

      <!-- 菜单展示，跳转对应表单信息 -->
      <tui-list-cell @click="(e: any) => handleSyncOperation('menu:choose', 'about')" :arrow="true" last="true">
        <view class="x-profile-item-box">
          <tui-icon color="#8c8c8c" :size="20" customPrefix name="iconfont-chat icon-chat-show_wenhao"></tui-icon>
          <text class="x-profile-list-cell_name">系统信息</text>
          <view class="x-profile-right"></view>
        </view>
      </tui-list-cell>
    </tui-list-view>
  </view>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { onShow, onHide, onError, onLoad, onTabItemTap } from '@dcloudio/uni-app';
import { useSystemStore } from '@/stores/system';
import { useProfileStore } from '@/stores/profile';

import { CommonConfiguration } from '@/config/common.config';
import { APIConfiguration } from '@/config/api.config';
import { RequestUtils } from '@/utils/request';
import { TimeUtils } from '@/utils/time';

import tuiTag from '@/components/thorui/tui-tag/tui-tag.vue';
import tuiIcon from '@/components/thorui/tui-icon/tui-icon.vue';
import tuiBadge from '@/components/thorui/tui-badge/tui-badge.vue';
import tuiListView from '@/components/thorui/tui-list-view/tui-list-view.vue';
import tuiListCell from '@/components/thorui/tui-list-cell/tui-list-cell.vue';
import tuiButton from '@/components/thorui/tui-button/tui-button.vue';
import tuiDivideList from '@/components/thorui/tui-divide-list/tui-divide-list.vue';

// 业务Hooks
const systemStore = useSystemStore();
const profileStore = useProfileStore();

const refUserProfile = ref<any>(null);
const userProfile = ref({ avatar: '', nickname: '', explain: '' });

onLoad(() => {
  handleAsyncOperation('user:profile:load');
});
onTabItemTap(() => {
  refUserProfile.value?.handleAsyncOperation('user:profile:load');
  handleAsyncOperation('user:profile:load');
});
onError(() => {});

// 异步处理汇总
// user:profile:load -> 用户信息加载
const handleAsyncOperation = async (type: string, args?: any) => {
  const requestUtils = new RequestUtils();
  switch (type) {
    case 'user:profile:load': {
      const reqPath = APIConfiguration.ApiGetUserProfile;
      const reqObj = {};
      const [usererr, userres] = await requestUtils.request({ path: reqPath, method: 'POST', data: reqObj, header: {} });
      if (usererr) return;
      userProfile.value = {
        avatar: userres.Data.Avatar || CommonConfiguration.defaultUserAvatar,
        nickname: userres.Data.UserName,
        explain: userres.Data.Explain || '这家伙很懒…'
      };
      break;
    }
    default:
      break;
  }
};

// 同步处理汇总
const handleSyncOperation = (type: string, args?: any) => {
  switch (type) {
    case 'menu:choose': {
      if (args === 'token') uni.navigateTo({ url: '/pages/profile/token' });
      if (args === 'setting') uni.navigateTo({ url: '/pages/setting/index' });
      if (args === 'about') uni.navigateTo({ url: '/pages/about/index' });
      break;
    }
    case 'profile:edit': {
      console.log('profile:edit');
      uni.navigateTo({
        url: '/pages/profile/setting'
      });
      break;
    }
    default:
      break;
  }
};
</script>

<style lang="scss" scoped>
.x-profile-container {
  height: 100vh;
  width: 100vw;
  padding-bottom: env(safe-area-inset-bottom);

  .x-profile-header-center {
    background-color: #fff;
    width: 100%;
    height: 200rpx;
    margin: 20rpx 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333;
    padding: 0 30rpx;
    box-sizing: border-box;

    .x-profile-avatar {
      flex-shrink: 0;
      width: 128rpx;
      height: 128rpx;
      display: block;
    }

    .x-profile-info {
      width: 70%;
      padding-left: 30rpx;

      .x-profile-nickname {
        font-size: 28rpx;
        font-weight: 500;
        display: flex;
        align-items: center;
      }

      .x-profile-explain {
        width: 80%;
        margin-top: 6rpx;
        font-size: 24rpx;
        font-weight: 400;
        opacity: 0.75;
        padding-top: 8rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .x-profile-set-box {
      position: absolute;
      right: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .x-profile-icon-box {
        position: relative;
      }
    }
  }

  .x-profile-item-box {
    width: 100%;
    display: flex;
    align-items: center;
    .x-profile-list-cell_name {
      padding-left: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .x-profile-ml-auto {
      margin-left: auto;
    }
    .x-profile-right {
      margin-left: auto;
      margin-right: 34rpx;
      font-size: 26rpx;
      color: #999;
    }
    .x-profile-logo {
      height: 52rpx;
      width: 52rpx;
      flex-shrink: 0;
    }
  }
}
</style>
