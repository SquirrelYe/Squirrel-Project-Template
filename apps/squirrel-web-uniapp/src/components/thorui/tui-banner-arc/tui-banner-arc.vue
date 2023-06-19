<template>
  <view class="tui-banner-arc" :style="{ height: height + 'rpx' }">
    <view
      class="tui-banner--box"
      :style="{ background: background, height: height + 'rpx', width: width + '%', paddingLeft: (width - 100) / 2 + '%', paddingRight: (width - 100) / 2 + '%', left: '-' + (width - 100) / 2 + '%' }"
    >
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'tui-banner-arc',
  // #ifdef MP-WEIXIN
  options: {
    virtualHost: true
  },
  // #endif
  props: {
    height: {
      type: [Number, String],
      default: 400
    },
    percent: {
      type: [Number, String],
      default: 120
    },
    background: {
      type: String,
      default: ''
    }
  },
  created() {
    this.width = this.getPercent(this.percent);
  },
  watch: {
    percent(val) {
      this.width = this.getPercent(val);
    }
  },
  data() {
    return {
      width: 120
    };
  },
  methods: {
    getPercent(val) {
      //最低值120，尽量传偶数值
      val = Number(val || 0);
      return val < 120 ? 120 : val;
    }
  }
};
</script>

<style scoped>
.tui-banner-arc {
  width: 100%;
  position: relative;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.tui-banner--box {
  box-sizing: border-box;
  position: absolute;
  z-index: 1;
  top: 0;
  border-radius: 0 0 50% 50%;
  overflow: hidden;
}
</style>
