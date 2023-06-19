<template>
  <view
    class="tui-form__item-wrap"
    :class="{ 'tui-form__highlight': highlight }"
    :style="{ padding: getPadding, background: getBgColor, marginTop: marginTop + 'rpx', marginBottom: marginBottom + 'rpx', borderRadius: getRadius }"
    @tap="handleClick"
  >
    <!-- #ifdef APP-NVUE -->
    <view class="tui-form__asterisk" v-if="asterisk">
      <text :style="{ color: getAsteriskColor }">*</text>
    </view>
    <!-- #endif -->
    <!-- #ifndef APP-NVUE -->
    <view class="tui-form__asterisk" v-if="asterisk" :style="{ color: getAsteriskColor }">*</view>
    <!-- #endif -->
    <view :style="getLabelStyl" v-if="label">{{ label }}</view>
    <view class="tui-form__item-content">
      <slot></slot>
    </view>
    <slot name="right"></slot>
    <view v-if="bottomBorder" :style="{ background: getBorderColor, left: left + 'rpx', right: right + 'rpx' }" class="tui-form__item-bottom"></view>
    <view class="tui-form__item-arrow" v-if="arrow" :style="{ 'border-color': getArrowColor }"> </view>
  </view>
</template>

<script>
export default {
  name: 'tui-form-item',
  emits: ['click'],
  props: {
    padding: {
      type: String,
      default: ''
    },
    marginTop: {
      type: [Number, String],
      default: 0
    },
    marginBottom: {
      type: [Number, String],
      default: 0
    },
    label: {
      type: String,
      default: ''
    },
    labelSize: {
      type: [Number, String],
      default: 0
    },
    labelColor: {
      type: String,
      default: ''
    },
    //2.3.0+
    labelFontWeight: {
      type: [Number, String],
      default: 0
    },
    labelWidth: {
      type: [Number, String],
      default: 140
    },
    labelRight: {
      type: [Number, String],
      default: 16
    },
    asterisk: {
      type: Boolean,
      default: false
    },
    asteriskColor: {
      type: String,
      default: ''
    },
    background: {
      type: String,
      default: ''
    },
    highlight: {
      type: Boolean,
      default: false
    },
    arrow: {
      type: Boolean,
      default: false
    },
    arrowColor: {
      type: String,
      default: ''
    },
    bottomBorder: {
      type: Boolean,
      default: true
    },
    borderColor: {
      type: String,
      default: ''
    },
    left: {
      type: [Number, String],
      default: 30
    },
    right: {
      type: [Number, String],
      default: 0
    },
    radius: {
      type: String,
      default: ''
    },
    index: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    getPadding() {
      return this.padding || (uni && uni.$tui && uni.$tui.tuiFormItem.padding) || '26rpx 30rpx';
    },
    getBgColor() {
      return this.background || (uni && uni.$tui && uni.$tui.tuiFormItem.background) || '#fff';
    },
    getRadius() {
      return this.radius || (uni && uni.$tui && uni.$tui.tuiFormItem.radius) || '0';
    },
    getAsteriskColor() {
      return this.asteriskColor || (uni && uni.$tui && uni.$tui.tuiFormItem.asteriskColor) || '#EB0909';
    },
    getLabelStyl() {
      const labelSize = this.labelSize || (uni && uni.$tui && uni.$tui.tuiFormItem.labelSize) || 32;
      const labelColor = this.labelColor || (uni && uni.$tui && uni.$tui.tuiFormItem.labelColor) || '#333';
      const weight = this.labelFontWeight || (uni && uni.$tui && uni.$tui.tuiFormItem.labelFontWeight) || 400;
      return `width:${this.labelWidth}rpx;font-size:${labelSize}rpx;color:${labelColor};padding-right:${this.labelRight}rpx;font-weight:${weight};`;
    },
    getArrowColor() {
      return this.arrowColor || (uni && uni.$tui && uni.$tui.tuiFormItem.arrowColor) || '#c0c0c0';
    },
    getBorderColor() {
      return this.borderColor || (uni && uni.$tui && uni.$tui.tuiFormItem.borderColor) || '#eaeef1';
    }
  },
  methods: {
    handleClick() {
      this.$emit('click', {
        index: this.index
      });
    }
  }
};
</script>

<style scoped>
.tui-form__item-wrap {
  /* #ifndef APP-NVUE */
  width: 100%;
  box-sizing: border-box;
  display: flex;
  /* #endif */
  flex-direction: row;
  flex: 1;
  align-items: center;
  position: relative;
}

.tui-form__highlight:active {
  background-color: #f1f1f1 !important;
}

.tui-form__asterisk {
  position: absolute;
  left: 12rpx;
  /* #ifndef APP-NVUE */
  height: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  line-height: 1.15;
  /* #endif */
  /* #ifdef APP-NVUE */
  flex: 1;
  align-items: center;
  justify-content: center;
  line-height: 1;
  /* #endif */
}

.tui-form__item-label {
  padding-right: 12rpx;
  /* #ifndef APP-NVUE */
  display: inline-block;
  flex-shrink: 0;
  /* #endif */
}

.tui-form__item-content {
  flex: 1;
}

.tui-form__item-bottom {
  position: absolute;
  bottom: 0;
  /* #ifdef APP-NVUE */
  height: 0.5px;
  z-index: -1;
  /* #endif */
  /* #ifndef APP-NVUE */
  height: 1px;
  -webkit-transform: scaleY(0.5) translateZ(0);
  transform: scaleY(0.5) translateZ(0);
  transform-origin: 0 100%;
  z-index: 1;
  /* #endif */
}

.tui-form__item-arrow {
  height: 40rpx;
  width: 40rpx;
  border-width: 3px 3px 0 0;
  border-style: solid;
  transform: rotate(45deg) scale(0.5);
  /* #ifndef APP-NVUE */
  border-radius: 4rpx;
  flex-shrink: 0;
  margin-left: auto;
  box-sizing: border-box;
  /* #endif */
  /* #ifdef APP-NVUE */
  border-top-right-radius: 3rpx;
  /* #endif */
  transform-origin: center center;
  margin-right: -5.8579rpx;
}
</style>
