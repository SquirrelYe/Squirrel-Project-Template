<template>
  <view class="tui-msg__box">
    <view class="tui-msg__icon">
      <icon :color="getColor" :type="type" :size="size" v-if="type && !src"></icon>
      <image class="thorui-msg__img" :style="{ width: width, height: height }" :src="src" mode="aspectFit" v-if="src" />
    </view>
    <view class="tui-msg__title" v-if="title">{{ title }}</view>
    <view class="tui-msg__desc" v-if="desc">{{ desc }}</view>
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'tuiMsg',
  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    //icon size
    size: {
      type: Number,
      default: 64
    },
    src: {
      //设置src 之后，type失效
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '180rpx'
    },
    height: {
      type: String,
      default: '180rpx'
    },
    desc: {
      type: String,
      default: ''
    }
  },
  computed: {
    getColor() {
      return this.color || (uni && uni.$tui && uni.$tui.color.success) || '#07c160';
    }
  }
};
</script>

<style scoped>
.tui-msg__box {
  width: 100%;
  padding-top: 100rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tui-msg__icon {
  padding-bottom: 44rpx;
}

.tui-msg__title {
  font-weight: 700;
  font-size: 44rpx;
}

.tui-msg__desc,
.tui-msg__title {
  margin-bottom: 32rpx;
  color: #333;
  word-wrap: break-word;
  word-break: break-all;
}

.tui-msg__desc {
  font-size: 32rpx;
  text-align: center;
}
</style>
