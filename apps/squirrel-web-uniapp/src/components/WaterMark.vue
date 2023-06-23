<template>
  <view class="x-watermark-container">
    <view class="x-watermark-list">
      <view class="x-watermark-item" v-for="i in 500">
        <text>{{ watermarkNameText }}</text>
        <text>{{ watermarkOpenIDText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useProfileStore } from '@/stores/profile';

const watermarkNameText = ref('昵称水印');
const watermarkOpenIDText = ref('ID水印');

onMounted(() => {
  const profileStore = useProfileStore();
  watermarkNameText.value = profileStore.userName;
  watermarkOpenIDText.value = profileStore.userOpenID?.slice(-4); // 取后四位
});
</script>

<style lang="scss" scoped>
.x-watermark-container {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0);
  pointer-events: none;

  .x-watermark-list {
    width: 500%;
    height: 400%;
    position: absolute;
    top: -50%;
    left: -50%;
    transform: rotate(-30deg);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    pointer-events: none;

    .x-watermark-item {
      font-size: 24px;
      color: rgba(220, 220, 220, 0.2);
      font-weight: bold;
      padding: 30rpx;
      pointer-events: none;
    }
  }
}
</style>
