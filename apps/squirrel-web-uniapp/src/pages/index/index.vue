<template>
  <tui-toast ref="refToast"></tui-toast>
  <tui-loading v-if="systemStore.sysIsNetworkLoading"></tui-loading>

  <view class="x-session-container"> </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { onShow, onHide, onError, onLoad, onTabItemTap } from '@dcloudio/uni-app';
import { useSystemStore } from '@/stores/system';
import { useProfileStore } from '@/stores/profile';

import { CommonConfiguration } from '@/config/common.config';
import { APIConfiguration } from '@/config/api.config';
import { RequestUtils } from '@/utils/request';

import tuiBadge from '@/components/thorui/tui-badge/tui-badge.vue';
import tuiListView from '@/components/thorui/tui-list-view/tui-list-view.vue';
import tuiListCell from '@/components/thorui/tui-list-cell/tui-list-cell.vue';
import tuiSearchbar from '@/components/thorui/tui-searchbar/tui-searchbar.vue';
import tuiToast from '@/components/thorui/tui-toast/tui-toast.vue';
import tuiButton from '@/components/thorui/tui-button/tui-button.vue';
import tuiLoading from '@/components/thorui/tui-loading/tui-loading.vue';

// 业务Hooks
const systemStore = useSystemStore();
const profileStore = useProfileStore();

const refToast = ref();

onLoad(async () => {});
onTabItemTap(async () => {});
onShow(() => {});
onHide(() => {});
onError(() => {});

// 异步处理汇总
// session:message:list:pull -> 拉取会话消息列表
const handleAsyncOperation = async (type: string, args?: any) => {
  switch (type) {
    default:
      break;
  }
};

// 同步处理汇总
const handleSyncOperation = (type: string, args?: any) => {
  switch (type) {
    default:
      break;
  }
};
</script>

<style lang="scss" scoped>
.x-session-container {
  background-color: #fff;
  height: 100%;
  color: #333;
}
</style>
