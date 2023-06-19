<template>
  <view class="tui-progress__box">
    <view class="tui-progressbar__bg" :style="{ height: width + 'rpx', borderRadius: radius, background: backgroundColor }">
      <view class="tui-progress__bar" :style="{ height: width + 'rpx', background: getActiveColor, transform: `translate3d(-${translateX},0,0)`, transitionDuration: `${time}s` }"> </view>
    </view>
    <view class="tui-progress__percent" :style="{ width: percentWidth + 'rpx', fontSize: size + 'rpx', color: color }" v-if="showInfo"> {{ percentage }}% </view>
  </view>
</template>

<script>
export default {
  name: 'tuiProgress',
  emits: ['activeend'],
  props: {
    //百分比 0-100
    percent: {
      type: [Number, String],
      default: 0
    },
    //右侧是否显示百分比
    showInfo: {
      type: Boolean,
      default: false
    },
    //圆角大小
    radius: {
      type: String,
      default: '8rpx'
    },
    //右侧百分比字体大小 rpx
    size: {
      type: Number,
      default: 28
    },
    //右侧百分比颜色
    color: {
      type: String,
      default: '#333'
    },
    //右侧百分比宽度
    percentWidth: {
      type: Number,
      default: 96
    },
    //进度条线条宽度 rpx
    width: {
      type: Number,
      default: 8
    },
    //已选进度条颜色,可渐变
    activeColor: {
      type: String,
      default: ''
    },
    //未选择的进度条的颜色
    backgroundColor: {
      type: String,
      default: '#EBEBEB'
    },
    //进度增加1%所需毫秒数
    duration: {
      type: Number,
      default: 15
    }
  },
  watch: {
    percent(val) {
      this.darwProgress();
    }
  },
  mounted() {
    this.darwProgress();
  },
  computed: {
    getActiveColor() {
      return this.activeColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    }
  },
  data() {
    return {
      percentage: 0,
      translateX: '-100%',
      time: 0
    };
  },
  methods: {
    darwProgress() {
      let percent = Number(this.percent);
      percent = percent > 100 ? 100 : percent;
      this.time = (this.duration * Math.abs(percent - this.percentage)) / 1000;
      if (percent < this.percentage && this.percentage - percent > 30) {
        //后百分比数大于30时 时间缩短
        this.time = this.time / 2;
      }
      setTimeout(() => {
        this.$emit('activeend', {});
      }, this.time);
      this.percentage = percent;
      this.translateX = 100 - percent + '%';
    }
  }
};
</script>

<style scoped>
.tui-progress__box {
  width: 100%;
  display: flex;
  align-items: center;
}

.tui-progressbar__bg {
  width: 100%;
  position: relative;
  overflow: hidden;
  transform: translateZ(0);
}

.tui-progress__bar {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  transform: translateX(-100%);
  transition-delay: 0s;
  transition-property: transform;
  transition-timing-function: linear;
}

.tui-progress__percent {
  text-align: center;
}
</style>
