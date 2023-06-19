<template>
  <view class="tui-slider__box" :style="{ width: width + 'px', height: height + 'px', borderRadius: radius, background: backgroundColor, border: border }">
    <!-- #ifdef APP-PLUS || MP-WEIXIN || H5 -->
    <view class="tui-slider__glided" :style="{ background: getActiveColor, borderTopLeftRadius: radius, borderBottomLeftRadius: radius }"></view>
    <view
      class="tui-slider__block"
      :style="{
        width: blockWidth + 'px',
        height: blockHeight + 'px',
        marginTop: `-${blockHeight / 2}px`,
        borderRadius: blockRadius,
        boxShadow: blockShadow,
        border: blockBorder,
        background: blockColor
      }"
      :change:prop="parse.slidevalue"
      :prop="initValue"
      :data-blockWidth="blockWidth"
      :data-width="width"
      :data-step="step"
      :data-min="min"
      :data-max="max"
      :data-disabled="disabled"
      :data-value="start"
      :data-endValue="end"
      :data-section="section"
      @touchstart="parse.touchstart"
      @touchmove="parse.touchmove"
      @touchend="parse.touchend"
    >
      <slot name="start"></slot>
      <view
        v-if="showValue"
        class="tui-value__box"
        :class="['tui-value__' + position]"
        :style="{ backgroundColor: boxColor, padding: padding, color: valueColor, fontSize: valueSize + 'rpx', zIndex: zIndex }"
        @touchmove.stop="stop"
      >
        {{ formatValue(start) }}
        <view
          :class="['tui-triangle__' + position]"
          :style="{ borderColor: position == 'top' ? `${boxColor} transparent transparent transparent` : `transparent transparent ${boxColor} transparent` }"
        >
        </view>
      </view>
    </view>

    <view
      v-if="section"
      class="tui-section__block"
      :style="{
        width: blockWidth + 'px',
        height: blockHeight + 'px',
        marginTop: `-${blockHeight / 2}px`,
        borderRadius: blockRadius,
        boxShadow: blockShadow,
        border: blockBorder,
        background: blockColor
      }"
      :change:prop="parse.sectionSlidevalue"
      :prop="initEndValue"
      :data-blockWidth="blockWidth"
      :data-width="width"
      :data-step="step"
      :data-min="min"
      :data-max="max"
      :data-disabled="disabled"
      :data-value="start"
      :data-endValue="end"
      :data-section="section"
      @touchstart="parse.sectionTouchstart"
      @touchmove="parse.sectionTouchmove"
      @touchend="parse.sectionTouchend"
    >
      <slot name="end"></slot>
      <view
        v-if="showValue"
        class="tui-value__box"
        :class="['tui-value__' + position]"
        :style="{ backgroundColor: boxColor, padding: padding, color: valueColor, fontSize: valueSize + 'rpx', zIndex: zIndex }"
        @touchmove.stop="stop"
      >
        {{ formatValue(end) }}
        <view
          :class="['tui-triangle__' + position]"
          :style="{ borderColor: position == 'top' ? `${boxColor} transparent transparent transparent` : `transparent transparent ${boxColor} transparent` }"
        >
        </view>
      </view>
    </view>
    <view class="tui-section__glided" :style="{ background: getActiveColor, borderTopRightRadius: radius, borderBottomRightRadius: radius }"></view>
    <!-- #endif -->

    <!-- #ifndef APP-PLUS || MP-WEIXIN || H5 -->
    <view class="tui-slider__bar-inner" :style="{ width: width + 'px', height: height + 'px', borderRadius: radius }">
      <view class="tui-slider__glided" :class="['tui-slider__bar-left']" :style="{ background: getActiveColor, borderTopLeftRadius: radius, borderBottomLeftRadius: radius, transform: transLeft }">
      </view>
      <view
        class="tui-section__glided"
        :class="['tui-slider__bar-right']"
        :style="{ background: getActiveColor, borderTopRightRadius: radius, borderBottomRightRadius: radius, transform: transRight }"
      >
      </view>
    </view>
    <view
      class="tui-slider__block"
      :style="{
        width: blockWidth + 'px',
        height: blockHeight + 'px',
        marginTop: `-${blockHeight / 2}px`,
        borderRadius: blockRadius,
        boxShadow: blockShadow,
        border: blockBorder,
        background: blockColor,
        transform: moveLeft
      }"
      @touchstart="touchstart"
      @touchmove="touchmove"
      @touchend="touchend"
    >
      <slot name="start"></slot>
      <view
        v-if="showValue"
        class="tui-value__box"
        :class="['tui-value__' + position]"
        :style="{ backgroundColor: boxColor, padding: padding, color: valueColor, fontSize: valueSize + 'rpx', zIndex: zIndex }"
        @touchmove.stop="stop"
      >
        {{ formatValue(start) }}
        <view
          :class="['tui-triangle__' + position]"
          :style="{ borderColor: position == 'top' ? `${boxColor} transparent transparent transparent` : `transparent transparent ${boxColor} transparent` }"
        >
        </view>
      </view>
    </view>

    <view
      v-if="section"
      class="tui-section__block"
      :class="{ 'tui-slider__right': isRight }"
      :style="{
        width: blockWidth + 'px',
        height: blockHeight + 'px',
        marginTop: `-${blockHeight / 2}px`,
        borderRadius: blockRadius,
        boxShadow: blockShadow,
        border: blockBorder,
        background: blockColor,
        transform: moveRight
      }"
      @touchstart="endTouchstart"
      @touchmove.stop.prevent="endTouchmove"
      @touchend="endTouchend"
    >
      <slot name="end"></slot>
      <view
        v-if="showValue"
        class="tui-value__box"
        :class="['tui-value__' + position]"
        :style="{ backgroundColor: boxColor, padding: padding, color: valueColor, fontSize: valueSize + 'rpx', zIndex: zIndex }"
        @touchmove.stop="stop"
      >
        {{ formatValue(end) }}
        <view
          :class="['tui-triangle__' + position]"
          :style="{ borderColor: position == 'top' ? `${boxColor} transparent transparent transparent` : `transparent transparent ${boxColor} transparent` }"
        >
        </view>
      </view>
    </view>

    <!-- #endif -->
  </view>
</template>
<!-- #ifdef APP-PLUS || MP-WEIXIN || H5 -->
<script src="./tui-slider.wxs" module="parse" lang="wxs"></script>
<!-- #endif -->
<script>
import mp from './index.js';
export default {
  name: 'tuiSlider',
  mixins: [mp],
  emits: ['change', 'changing'],
  props: {
    //slider宽度 px
    width: {
      type: Number,
      default: 240
    },
    //slider高度 px
    height: {
      type: Number,
      default: 4
    },
    border: {
      type: String,
      default: '0'
    },
    //slider圆角
    radius: {
      type: String,
      default: '2px'
    },
    //最小值
    min: {
      type: Number,
      default: 0
    },
    //最大值
    max: {
      type: Number,
      default: 100
    },
    //步长，取值必须大于 0，并且可被(max - min)整除
    step: {
      type: Number,
      default: 1
    },
    //是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    //当前取值（起始）
    value: {
      type: Number,
      default: 0
    },
    //是否为区间选择/显示
    section: {
      type: Boolean,
      default: false
    },
    //当前取值（结束），section为true时生效
    endValue: {
      type: Number,
      default: 100
    },
    //滑块左侧已选择部分的线条颜色
    activeColor: {
      type: String,
      default: ''
    },
    //滑块右侧背景条的颜色
    backgroundColor: {
      type: String,
      default: '#e9e9e9'
    },
    //滑块宽度 px
    blockWidth: {
      type: Number,
      default: 20
    },
    //滑块高度 px
    blockHeight: {
      type: Number,
      default: 20
    },
    //滑块背景颜色
    blockColor: {
      type: String,
      default: '#fff'
    },
    //滑块圆角
    blockRadius: {
      type: String,
      default: '50%'
    },
    //滑块阴影
    blockShadow: {
      type: String,
      default: '#b2b2b2 0 0 10rpx'
    },
    //滑块边框
    blockBorder: {
      type: String,
      default: '0'
    },
    //是否显示当前value
    showValue: {
      type: Boolean,
      default: false
    },
    //value显示位置 top，bottom
    position: {
      type: String,
      default: 'top'
    },
    //value显示格式，如：￥value,显示时value会被替换成数值
    valueFormat: {
      type: String,
      default: 'value'
    },
    //value框z-index值
    zIndex: {
      type: Number,
      default: 10
    },
    //value框颜色
    boxColor: {
      type: String,
      default: 'rgba(255,255,255,.9)'
    },
    padding: {
      type: String,
      default: '2px 6px'
    },
    //value字体颜色
    valueColor: {
      type: String,
      default: '#333'
    },
    //value字体大小 rpx
    valueSize: {
      type: Number,
      default: 30
    }
  },
  computed: {
    getActiveColor() {
      return this.activeColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    }
  },
  watch: {
    value(val) {
      this.initValue = val;
      this.start = val;
    },
    endValue(val) {
      this.initEndValue = val;
      this.end = val;
    }
  },
  data() {
    return {
      start: 0,
      end: 0,
      initValue: 0,
      initEndValue: 0
    };
  },
  mounted() {
    this.start = this.value || this.min;
    this.end = this.endValue || this.max;
    setTimeout(() => {
      this.initValue = this.value;
      this.initEndValue = this.endValue || this.max;
    }, 10);
  },
  methods: {
    getParams(e) {
      let val = e.value || 0;
      if (this.section && !e.isStart) {
        this.end = val;
      } else {
        this.start = val;
      }
      let params = {
        value: this.start
      };
      if (this.section) {
        params.endValue = this.end;
      }
      return params;
    },
    change(e) {
      let params = this.getParams(e);
      this.$emit('change', params);
    },
    changing(e) {
      let params = this.getParams(e);
      this.$emit('changing', params);
    },
    formatValue(val) {
      let value = val || 0;
      if (this.valueFormat) {
        value = this.valueFormat.replace('value', val);
      }
      return value;
    },
    stop() {}
  }
};
</script>

<style scoped>
.tui-slider__box {
  width: 100%;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.tui-slider__glided {
  /* #ifdef APP-PLUS || MP-WEIXIN || H5 */
  width: 0;
  /* #endif */
  /* #ifndef APP-PLUS || MP-WEIXIN || H5 */
  width: 100%;
  right: 0;
  /* #endif */
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  overflow: hidden;
}

.tui-section__glided {
  /* #ifdef APP-PLUS || MP-WEIXIN || H5 */
  width: 0;
  /* #endif */

  /* #ifndef APP-PLUS || MP-WEIXIN || H5 */
  width: 100%;
  left: 0;
  /* #endif */
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  overflow: hidden;
}

/* #ifndef APP-PLUS || MP-WEIXIN || h5 */
.tui-slider__bar-left {
  transform: translate3d(-100%, 0, 0);
}

.tui-slider__bar-right {
  transform: translate3d(100%, 0, 0);
}

/* #endif */

.tui-slider__trans {
  transition: all 0.2s;
}

.tui-slider__block {
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  left: 0;
  top: 50%;
}

.tui-section__block {
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  right: 0;
  top: 50%;
}

.tui-value__box {
  position: absolute;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.tui-value__top {
  left: 50%;
  top: 0;
  transform: translate(-50%, -100%);
  margin-top: -10px;
}

.tui-triangle__top {
  position: absolute;
  top: 97%;
  left: 50%;
  transform: translate(-50%, 0);
  border-width: 5px;
  border-style: solid;
}

.tui-value__bottom {
  left: 50%;
  top: 100%;
  transform: translate(-50%, 0);
  margin-top: 10px;
}

.tui-triangle__bottom {
  position: absolute;
  top: 1rpx;
  left: 50%;
  transform: translate(-50%, -100%);
  border-width: 5px;
  border-style: solid;
}
.tui-slider__bar-inner {
  position: relative;
  z-index: 1;
  overflow: hidden;
}
.tui-slider__right {
  z-index: 5 !important;
}
</style>
