<template>
  <view class="x-setting-container">
    <!-- 表单区域 -->
    <view class="x-setting-form">
      <tui-form-item label="回复模型" labelWidth="160rpx" left="0" labelSize="28" highlight arrow @click="handleSyncOperation('setting:model:change')">
        <template #right>
          <tui-text :text="userConfiguration.ModelType" size="28" type="gray"></tui-text>
        </template>
      </tui-form-item>

      <tui-form-item label="选择温度" labelWidth="160rpx" left="0" labelSize="28" highlight arrow @click="handleSyncOperation('setting:temp:change')">
        <template #right>
          <tui-text :text="userConfiguration.Temperature" size="28" type="gray"></tui-text>
        </template>
      </tui-form-item>

      <tui-form-item label="是否携带历史记录" labelWidth="160rpx" left="0" labelSize="28">
        <template #right>
          <tui-switch :checked="userConfiguration.IsAllowCarryHistory" scaleRatio="0.7" color="#0076ff" @change="e => handleSyncOperation('setting:history:change', e)"></tui-switch>
        </template>
      </tui-form-item>

      <tui-form-item label="是否语音回复" labelWidth="160rpx" left="0" labelSize="28">
        <template #right>
          <tui-switch :checked="userConfiguration.IsAllowVoiceReply" scaleRatio="0.7" color="#0076ff" @change="e => handleSyncOperation('setting:voicereply:change', e)"></tui-switch>
        </template>
      </tui-form-item>

      <tui-form-item label="最大回复Token数" labelWidth="160rpx" left="0" labelSize="28">
        <template #right>
          <tui-numberbox :max="99999" :value="userConfiguration.MaxToken" @change="e => handleSyncOperation('setting:maxtoken:change', e)"></tui-numberbox>
        </template>
      </tui-form-item>

      <tui-form-item label="携带历史记录条数" labelWidth="160rpx" left="0" labelSize="28">
        <template #right>
          <tui-numberbox :max="99999" :value="userConfiguration.CarryHistoryNumber" @change="e => handleSyncOperation('setting:carryhistory:change', e)"></tui-numberbox>
        </template>
      </tui-form-item>
    </view>

    <!-- 提交表单 -->
    <view class="x-setting-submit">
      <tui-button margin="20rpx 0" size="30" color="#0076ff" height="70rpx" @click="e => handleAsyncOperation('setting:form:submit', e)">提交修改</tui-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { onShow, onHide, onError, onLoad } from '@dcloudio/uni-app';
import { useSystemStore } from '@/stores/system';
import { useProfileStore } from '@/stores/profile';

import { CommonConfiguration } from '@/config/common.config';
import { APIConfiguration } from '@/config/api.config';
import { RequestUtils } from '@/utils/request';

import tuiTag from '@/components/thorui/tui-tag/tui-tag.vue';
import tuiIcon from '@/components/thorui/tui-icon/tui-icon.vue';
import tuiBadge from '@/components/thorui/tui-badge/tui-badge.vue';
import tuiListView from '@/components/thorui/tui-list-view/tui-list-view.vue';
import tuiListCell from '@/components/thorui/tui-list-cell/tui-list-cell.vue';
import tuiButton from '@/components/thorui/tui-button/tui-button.vue';

import tuiText from '@/components/thorui/tui-text/tui-text.vue';
import tuiSwitch from '@/components/thorui/tui-switch/tui-switch.vue';
import tuiFormItem from '@/components/thorui/tui-form-item/tui-form-item.vue';
import tuiNumberbox from '@/components/thorui/tui-numberbox/tui-numberbox.vue';

// 业务Hooks
const systemStore = useSystemStore();
const profileStore = useProfileStore();

const userConfiguration = ref<any>({
  ConfigurationID: 1,
  ModelType: 'GPT 3.5',
  Temperature: '正常',
  IsAllowCarryHistory: true,
  IsAllowVoiceReply: true,
  MaxToken: 4096,
  CarryHistoryNumber: 5
});

onLoad(() => {});
onShow(() => {
  handleAsyncOperation('user:config:load');
});
onHide(() => {});
onError(() => {});

// 异步处理汇总
const handleAsyncOperation = async (type: string, args?: any) => {
  switch (type) {
    case 'user:config:load': {
      const reqPath = APIConfiguration.ApiGetUserConfiguration;
      const reqObj = {};
      const [err, res] = await new RequestUtils().request({ path: reqPath, method: 'POST', data: reqObj, header: {} });
      if (err) return;
      break;
    }
    case 'setting:form:submit': {
      const reqPath = APIConfiguration.ApiUpdateUserConfiguration;
      const reqObj = {};
      const [err, res] = await new RequestUtils().request({ path: reqPath, method: 'POST', data: reqObj, header: {} });
      if (err) return;
      else {
        handleAsyncOperation('user:config:load');
        uni.showToast({ title: '修改成功', icon: 'none' });
      }
      break;
    }
    default:
      break;
  }
};

// 同步处理汇总
const handleSyncOperation = (type: string, args?: any) => {
  switch (type) {
    case 'setting:model:change': {
      console.log('setting:model:change');
      uni.showActionSheet({
        itemList: CommonConfiguration.dialogSysSettingModel,
        success: res => {
          console.log(res.tapIndex);
          userConfiguration.value.ModelType = CommonConfiguration.dialogSysSettingModel[res.tapIndex];
        },
        fail: err => {
          uni.showToast({ title: '取消选择', icon: 'none' });
          uni.showLoading({ title: '加载中...', mask: true });
          uni.hideLoading();
        }
      });
      break;
    }
    case 'setting:temp:change': {
      console.log('setting:temp:change');
      uni.showActionSheet({
        itemList: CommonConfiguration.dialogSysSettingTemperature,
        success: res => {
          console.log(res.tapIndex);
          userConfiguration.value.Temperature = CommonConfiguration.dialogSysSettingTemperature[res.tapIndex];
        },
        fail: err => {
          uni.showToast({ title: '取消选择', icon: 'none' });
          uni.showLoading({ title: '加载中...', mask: true });
          uni.hideLoading();
        }
      });
      break;
    }
    case 'setting:history:change': {
      userConfiguration.value.IsAllowCarryHistory = args.detail.value;
      break;
    }
    case 'setting:voicereply:change': {
      userConfiguration.value.IsAllowVoiceReply = args.detail.value;
      break;
    }
    case 'setting:maxtoken:change': {
      userConfiguration.value.MaxToken = args.value;
      break;
    }
    case 'setting:carryhistory:change': {
      userConfiguration.value.CarryHistoryNumber = args.value;
      break;
    }
    default:
      break;
  }
};
</script>

<style lang="scss" scoped>
.x-setting-container {
  height: 100vh;
  width: 100vw;
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
  .x-setting-form {
    margin-top: 20rpx;
    background-color: #fff;
  }
  .x-setting-submit {
    padding: 0 10rpx;
  }
}
</style>
