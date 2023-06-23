<template>
  <view class="u-text-32 u-flex u-justify-center">
    <WaterMark></WaterMark>
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import WaterMark from '@/components/watermark.vue';
</script>

<style lang="scss"></style>
