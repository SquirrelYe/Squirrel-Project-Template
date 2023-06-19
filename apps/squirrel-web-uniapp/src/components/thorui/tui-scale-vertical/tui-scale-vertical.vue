<template>
  <view class="tui-scale__box">
    <view class="tui-scale__pointer" :style="{ width: pointerWidth + 'px', height: pointerWidth + 'px', background: getPointerColor, left: pointerLeft + 'px' }" v-if="isPointer">
      <view
        class="tui-scale__triangle"
        :style="{
          left: pointerWidth + 'px',
          borderBottomWidth: pointerWidth / 2 + 'px',
          borderTopWidth: pointerWidth / 2 + 'px',
          borderLeftColor: getPointerColor,
          borderLeftWidth: pointerWidth + 'px'
        }"
      >
      </view>
    </view>
    <scroll-view
      :throttle="false"
      scroll-y
      scroll-with-animation
      :style="{ height: scrollHeight + 'px', background: backgroundColor, paddingRight: paddingRight + 'rpx' }"
      @scroll="handleScroll"
      :scroll-top="currentTop"
    >
      <view class="tui-scale__flex">
        <view class="tui-seat__box" :style="{ height: scrollHeight / 2 + 'px' }"></view>
        <view style="display: flex">
          <view class="tui-tickmarks__box" :style="{ width: lWidth + 'rpx', borderTopColor: lineColor }">
            <view class="tui-scale__flex" v-for="(m, i) in rulerLength" :key="i">
              <view
                class="tui-tick__marks"
                v-for="(item, index) in tickMarks"
                :key="index"
                :style="{ width: getWidth(index, width, mWidth, lWidth), height: singleHeight + 'px', borderBottomColor: lineColor }"
              >
              </view>
            </view>
          </view>
          <view class="tui-scale__flex">
            <view class="tui-scale__num" :style="{ height: singleHeight * 10 + 'px', fontSize: size + 'rpx', paddingLeft: left + 'rpx', color: color }">
              {{ min }}
            </view>
            <view class="tui-scale__num" :style="{ height: singleHeight * 10 + 'px', fontSize: size + 'rpx', paddingLeft: left + 'rpx', color: color }" v-for="(e, i) in rulerLength" :key="i">
              {{ (i + 1) * interval + min }}
            </view>
          </view>
        </view>
        <view class="tui-seat__box" :style="{ height: scrollHeight / 2 - singleHeight * 10 + 'px' }"></view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'tuiScaleVertical',
  emits: ['change'],
  props: {
    //默认值
    value: {
      type: Number,
      default: 0
    },
    //刻度尺外层容器宽度/高度 ，默认为屏幕宽度
    height: {
      type: Number,
      default: 0
    },
    //刻度尺外层容器背景色
    backgroundColor: {
      type: String,
      default: '#FEFEFE'
    },
    //刻度尺外层容器 padding-right值 rpx
    paddingRight: {
      type: [Number, String],
      default: 30
    },
    //刻度尺最小值
    min: {
      type: Number,
      default: 0
    },
    //刻度尺最大值
    max: {
      type: Number,
      default: 10
    },
    //标尺每段的间隔，取值必须大于 0，并且可被(max - min)整除
    interval: {
      type: Number,
      default: 1
    },
    //刻度线长度（最短）rpx
    width: {
      type: Number,
      default: 40
    },
    //刻度线长度（中等）rpx
    mWidth: {
      type: Number,
      default: 60
    },
    //刻度线长度（最长）rpx
    lWidth: {
      type: Number,
      default: 80
    },
    //刻度线颜色
    lineColor: {
      type: String,
      default: '#333'
    },
    //单个格子高度 px
    singleHeight: {
      type: Number,
      default: 8
    },
    //刻度值字体大小
    size: {
      type: [Number, String],
      default: 32
    },
    //刻度值字体颜色
    color: {
      type: String,
      default: '#000'
    },
    //刻度值距离刻度线距离 rpx
    left: {
      type: Number,
      default: 12
    },
    //是否需要指针
    isPointer: {
      type: Boolean,
      default: true
    },
    //刻度尺指针宽度 px
    pointerWidth: {
      type: Number,
      default: 12
    },
    //刻度尺指针颜色
    pointerColor: {
      type: String,
      default: ''
    },
    //刻度尺指针left值 px
    pointerLeft: {
      type: Number,
      default: -12
    }
  },
  computed: {
    getPointerColor() {
      return this.pointerColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    }
  },
  data() {
    return {
      tickMarks: 10,
      rulerLength: 1,
      scrollHeight: 0,
      currentTop: 0
    };
  },
  created() {
    this.getHeight();
    this.getLength();
  },
  mounted() {
    this.getTop();
  },
  watch: {
    height(val) {
      this.getHeight();
    },
    max(val) {
      this.getLength();
    },
    min(val) {
      this.getLength();
    },
    value(val) {
      this.getTop();
    }
  },
  methods: {
    getHeight() {
      if (!this.height) {
        let sys = uni.getSystemInfoSync();
        this.scrollHeight = sys.windowWidth;
      } else {
        this.scrollHeight = this.height;
      }
    },
    getLength() {
      //必须满足整除
      this.rulerLength = parseInt((this.max - this.min) / this.interval);
    },
    getTop() {
      let value = this.value;
      if (value < this.min) value = this.min;
      if (value > this.max) value = this.max;
      this.currentTop = ((this.singleHeight * 10) / this.interval) * (value - this.min);
    },
    getWidth(index, width, mWidth, lWidth) {
      let w = width;
      if (index === 4) w = mWidth;
      if (index === 9) w = lWidth;
      return `${w}rpx`;
    },
    handleScroll(e) {
      let scrollTop = e.detail.scrollTop;
      let value = this.min + (scrollTop / this.singleHeight / 10) * this.interval;
      if (value < this.min) value = this.min;
      if (value > this.max) value = this.max;
      this.$emit('change', {
        value: value
      });
    }
  }
};
</script>

<style scoped>
.tui-scale__box {
  position: relative;
  display: inline-block;
}

.tui-scroll__view {
  display: inline-flex;
  flex-direction: column;
}

.tui-tickmarks__box {
  display: flex;
  flex-direction: column;
  border-top: 1px solid;
  box-sizing: border-box;
  position: relative;
}

.tui-scale__flex {
  display: inline-flex;
  flex-direction: column;
  box-sizing: border-box;
}

.tui-tick__marks {
  border-bottom: 1px solid;
  box-sizing: border-box;
}

.tui-scale__num {
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: right;
  flex-shrink: 0;
  transform: translate(0, -50%);
  padding-top: 1px;
  box-sizing: border-box;
}

.tui-seat__box {
  flex-shrink: 0;
}

.tui-scale__pointer {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0;
  z-index: 10;
}

.tui-scale__triangle {
  position: absolute;
  top: 0;
  width: 0;
  height: 0;
  border-left-style: solid;
  border-top-style: solid;
  border-bottom-style: solid;
  border-top-color: transparent;
  border-bottom-color: transparent;
}
</style>
