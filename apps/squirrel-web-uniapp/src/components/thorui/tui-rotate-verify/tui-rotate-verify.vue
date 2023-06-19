<template>
  <view>
    <view
      class="tui-rotate__verify"
      :class="{ 'tui-verify__hidden': !show }"
      :style="{ width: width + 'rpx', borderRadius: radius + 'rpx', background: backgroundColor, padding: padding, zIndex: zIndex }"
    >
      <view class="tui-rotate-icon tui-icon__close" :style="{ color: closeColor, fontSize: closeSize + 'rpx' }" @tap.stop="close"></view>
      <view class="tui-verify__title" :style="{ color: titleColor, fontSize: titleSize + 'rpx' }">{{ title }} </view>
      <view class="tui-verify__desc" :style="{ color: descColor, fontSize: descSize + 'rpx' }">{{ desc }}</view>
      <view class="tui-box__image" :style="{ width: imgWidth + 'rpx', height: imgWidth + 'rpx' }">
        <!-- #ifdef APP-PLUS || MP-WEIXIN || H5 -->
        <image class="tui-verify__image" :src="imgSrc" :style="{ width: imgWidth + 'rpx', height: imgWidth + 'rpx', borderRadius: imgRadius, transform: 'rotate(' + angle + 'deg)' }"> </image>
        <!-- #endif -->
        <!-- #ifndef APP-PLUS || MP-WEIXIN || H5 -->
        <image
          class="tui-verify__image"
          :class="{ 'tui-block__trans': resetAni }"
          :src="imgSrc"
          :style="{ width: imgWidth + 'rpx', height: imgWidth + 'rpx', borderRadius: imgRadius, transform: 'rotate(' + useAngle + 'deg)' }"
        >
        </image>
        <!-- #endif -->
        <view class="tui-verify__result" v-if="isShow || isPass" :style="{ width: imgWidth + 'rpx', height: imgWidth + 'rpx', borderRadius: imgRadius }">
          <text class="tui-rotate-icon" :class="[isPass ? 'tui-icon__success' : 'tui-icon__close']" :style="{ color: isPass ? getSuccessColor : getErrorColor }"></text>
        </view>
      </view>
      <view
        class="tui-slider_bar"
        :style="{
          width: sliderWidth + 'px',
          height: sliderHeight + 'px',
          borderWidth: sliderBarBorderWidth + 'rpx',
          borderStyle: sliderBarBorderStyle,
          borderColor: geSliderBarBorder,
          background: getSliderBarBackground(sliderBarBorderColor)
        }"
      >
        <!-- #ifdef APP-PLUS || H5 || MP-WEIXIN -->
        <view
          class="tui-slider_block"
          :style="{ width: sliderHeight + 'px', height: sliderHeight + 'px', background: getBlockBackground }"
          :change:prop="parse.slidereset"
          :prop="reset"
          :data-width="sliderWidth"
          :data-height="sliderHeight"
          :data-errorRange="errorRange"
          :data-angle="angle"
          :data-disabled="isPass"
          :data-type="type"
          @touchstart="parse.touchstart"
          @touchmove="parse.touchmove"
          @touchend="parse.touchend"
        >
          <text class="tui-rotate-icon tui-icon__arrow" :style="{ color: arrowColor, fontSize: arrowSize + 'rpx' }"></text>
        </view>
        <!-- #endif -->
        <!-- #ifndef APP-PLUS || H5 || MP-WEIXIN -->
        <view
          class="tui-slider_block"
          :class="{ 'tui-block__trans': resetAni }"
          :style="{ width: sliderHeight + 'px', height: sliderHeight + 'px', background: getBlockBackground, transform: transform }"
          @touchstart="touchstart"
          @touchmove.stop.prevent="touchmove"
          @touchend="touchend"
        >
          <text class="tui-rotate-icon tui-icon__arrow" :style="{ color: arrowColor, fontSize: arrowSize + 'rpx' }"></text>
        </view>
        <!-- #endif -->
      </view>
      <slot></slot>
    </view>
    <view @tap.stop="maskClick" class="tui-verify__mask" :class="{ 'tui-mask__hidden': !show }" :style="{ zIndex: maskZIndex }"></view>
  </view>
</template>
<!-- #ifdef APP-PLUS || MP-WEIXIN || H5 -->
<script src="./tui-rotate-verify.wxs" module="parse" lang="wxs"></script>
<!-- #endif -->
<script>
import mp from './index.js';
export default {
  name: 'tuiRotateVerify',
  mixins: [mp],
  emits: ['success', 'error', 'close', 'result'],
  props: {
    //1-前端验证 2-后端验证，返回旋转角度
    type: {
      type: [Number, String],
      default: 1
    },
    //是否显示验证弹框
    show: {
      type: Boolean,
      default: false
    },
    //验证弹层外层盒子宽度 rpx
    width: {
      type: Number,
      default: 600
    },
    //圆角 rpx
    radius: {
      type: Number,
      default: 24
    },
    backgroundColor: {
      type: String,
      default: '#fff'
    },
    padding: {
      type: String,
      default: '60rpx 30rpx'
    },
    //图片地址
    imgSrc: {
      type: String,
      default: '/static/components/verify/rotate_verify.jpg'
    },
    //图片宽度，约定为正方形图片 rpx
    imgWidth: {
      type: Number,
      default: 240
    },
    imgRadius: {
      type: String,
      default: '50%'
    },
    //图片默认旋转角度 -330deg<angle <-30deg 或 30deg<angle<330deg
    angle: {
      type: Number,
      default: 30
    },
    //角度误差范围
    errorRange: {
      type: Number,
      default: 5
    },
    //关闭图标颜色
    closeColor: {
      type: String,
      default: '#999'
    },
    //关闭图标字体大小 rpx
    closeSize: {
      type: Number,
      default: 40
    },
    title: {
      type: String,
      default: '安全验证'
    },
    titleColor: {
      type: String,
      default: '#999'
    },
    titleSize: {
      type: Number,
      default: 30
    },
    desc: {
      type: String,
      default: '拖动滑块，使图片角度为正'
    },
    descColor: {
      type: String,
      default: '#333'
    },
    descSize: {
      type: Number,
      default: 36
    },
    //滑动条宽度 rpx
    sliderBarWidth: {
      type: Number,
      default: 540
    },
    //滑动条高度 rpx
    sliderBarHeight: {
      type: Number,
      default: 96
    },
    //滑动条边框 宽度 V2.8.0+
    sliderBarBorderWidth: {
      type: [Number, String],
      default: 2
    },
    //V2.8.0+
    sliderBarBorderStyle: {
      type: String,
      default: 'solid'
    },
    //V2.8.0+
    sliderBarBorderColor: {
      type: String,
      default: ''
    },
    sliderBarBackground: {
      type: String,
      default: ''
    },
    blockBackground: {
      type: String,
      default: ''
    },
    arrowColor: {
      type: String,
      default: '#fff'
    },
    arrowSize: {
      type: Number,
      default: 40
    },
    errorColor: {
      type: String,
      default: ''
    },
    successColor: {
      type: String,
      default: ''
    },
    zIndex: {
      type: Number,
      default: 999
    },
    maskZIndex: {
      type: Number,
      default: 998
    },
    //点击遮罩 是否可关闭
    maskClosable: {
      type: Boolean,
      default: true
    },
    //重置滑块，改变数值即表示重置操作，多次重置数值递增
    reset: {
      type: Number,
      default: 0
    }
  },
  watch: {
    isShow(val) {
      if (val) {
        setTimeout(() => {
          this.isShow = false;
        }, 300);
      }
    },
    reset(val) {
      if (val > 0) {
        this.isPass = false;
      }
    },
    show(val) {
      if (!val) {
        this.isPass = false;
        this.isShow = false;
      }
    }
  },
  computed: {
    geSliderBarBorder() {
      return this.sliderBarBorderColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    },
    getBlockBackground() {
      return this.blockBackground || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    },
    getErrorColor() {
      return this.errorColor || (uni && uni.$tui && uni.$tui.color.danger) || '#EB0909';
    },
    getSuccessColor() {
      return this.successColor || (uni && uni.$tui && uni.$tui.color.success) || '#07c160';
    }
  },
  data() {
    return {
      sliderWidth: 0,
      sliderHeight: 0,
      isPass: false,
      isShow: false
    };
  },
  created() {
    this.initData();
  },
  methods: {
    hexToRGB(hex) {
      if (hex.length === 4) {
        let text = hex.substring(1, 4);
        hex = '#' + text + text;
      }
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : {};
    },
    getSliderBarBackground(color) {
      const bg = color || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
      const rgb = this.hexToRGB(bg);
      return this.sliderBarBackground || `rgba(${rgb.r},${rgb.g},${rgb.b},.1)`;
    },
    initData() {
      this.sliderWidth = uni.upx2px(this.sliderBarWidth);
      this.sliderHeight = uni.upx2px(this.sliderBarHeight);
    },
    success() {
      //验证成功
      this.isPass = true;
      this.$emit('success', {});
    },
    error() {
      //验证失败
      this.isPass = false;
      this.isShow = true;
      this.$emit('error', {});
    },
    maskClick() {
      if (!this.maskClosable) return;
      this.close();
    },
    close() {
      this.$emit('close', {});
      this.isPass = false;
      this.isShow = true;
    },
    result(e) {
      this.$emit('result', e);
    }
  }
};
</script>

<style scoped>
@font-face {
  font-family: 'tuiRotateVerify';
  src: url('data:font/truetype;charset=utf-8;base64,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')
    format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

.tui-rotate-icon {
  font-family: 'tuiRotateVerify' !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
}

.tui-icon__close:before {
  content: '\e612';
}

.tui-icon__success:before {
  content: '\e60d';
}

.tui-icon__arrow:before {
  content: '\e64f';
}

.tui-icon__close {
  position: absolute;
  padding: 20rpx 20rpx 0 0;
  right: 10rpx;
  top: 10rpx;
}

.tui-verify__result .tui-icon__close {
  position: static;
  padding: 0;
  font-size: 100rpx;
}

.tui-rotate__verify {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  opacity: 1;
}

.tui-rotate__verify.tui-verify__hidden {
  opacity: 0;
  visibility: hidden;
}

.tui-verify__mask {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 1;
  transform: scale3d(1, 1, 1);
  transition: all 0.2s ease-in;
}

.tui-verify__mask.tui-mask__hidden {
  opacity: 0;
  transform: scale3d(1, 1, 0);
}

.tui-verify__title {
  text-align: center;
  padding-top: 30rpx;
}

.tui-verify__desc {
  text-align: center;
  padding-top: 20rpx;
}

.tui-box__image {
  position: relative;
  margin: 50rpx auto 80rpx;
}

.tui-verify__image {
  width: 240rpx;
  height: 240rpx;
  border-radius: 50%;
  display: block;
}

.tui-verify__result {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
}

.tui-icon__success {
  font-size: 100rpx;
}

.tui-slider_bar {
  border-radius: 100px;
  margin: 0 auto;
}

.tui-slider_block {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.tui-block__trans {
  transition: all 0.3s !important;
}
</style>
