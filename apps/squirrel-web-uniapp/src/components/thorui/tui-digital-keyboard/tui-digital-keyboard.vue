<template>
  <view class="tui-digital-keyboard" :class="{ 'tui-keyboard__action': show }" :style="{ backgroundColor: darkMode ? '#1E1E1E' : backgroundColor, zIndex: zIndex }">
    <!--自定义内容，如关闭键盘按钮-->
    <slot></slot>
    <view class="tui-keyboard__grids">
      <view class="tui-keyboard__left">
        <view class="tui-keyboard__grid" :class="{ 'tui-flex__2': item == '0' }" v-for="(item, index) in keyArr" :key="index">
          <view
            class="tui-key__item"
            :style="{ color: darkMode ? '#D1D1D1' : color, backgroundColor: darkMode ? '#2C2C2C' : keyBackground }"
            :hover-class="!isDecimal && index == 10 ? '' : 'tui-key__item-active'"
            :hover-stay-time="150"
            @tap.stop="handleClick"
            :data-value="item"
            >{{ item }}</view
          >
        </view>
      </view>
      <view class="tui-keyboard__right">
        <view class="tui-keyboard__grid">
          <view class="tui-key__item" @tap.stop="backspace" hover-class="tui-key__item-active" :hover-stay-time="150" :style="{ backgroundColor: darkMode ? '#2C2C2C' : keyBackground }">
            <text class="tui-dk__icon tui-icon__backspace" :style="{ color: darkMode ? '#D1D1D1' : color }"></text>
          </view>
        </view>
        <view class="tui-keyboard__grid tui-dk__btn">
          <view
            class="tui-key__item"
            :class="{ 'tui-dkBtn__disabled': disabled }"
            @tap.stop="confirm"
            :style="{ color: buttonColor, background: getButtonBackground, fontSize: buttonSize + 'rpx', fontWeight: buttonFontBold ? 'bold' : 'normal' }"
            :hover-class="disabled ? '' : 'tui-key__item-active'"
            :hover-stay-time="150"
            >{{ buttonText }}</view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'tuiDigitalKeyboard',
  emits: ['click', 'backspace', 'confirm'],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: [Number, String],
      default: 996
    },
    backgroundColor: {
      type: String,
      default: '#F7F7F7'
    },
    //数字以及删除键字体颜色
    color: {
      type: String,
      default: '#1a1a1a'
    },
    keyBackground: {
      type: String,
      default: '#fff'
    },
    buttonText: {
      type: String,
      default: '确定'
    },
    buttonBackground: {
      type: String,
      default: ''
    },
    buttonColor: {
      type: String,
      default: '#fff'
    },
    //rpx
    buttonSize: {
      type: [Number, String],
      default: 32
    },
    buttonFontBold: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    //是否需要小数点
    isDecimal: {
      type: Boolean,
      default: true
    },
    //可自定义颜色，设置为true时，自定义设置失效
    darkMode: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isDecimal(val) {
      this.initData(val);
    }
  },
  computed: {
    getButtonBackground() {
      return this.buttonBackground || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    }
  },
  data() {
    return {
      keyArr: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.']
    };
  },
  created() {
    this.initData(this.isDecimal);
  },
  methods: {
    initData(val) {
      let keyArr = this.keyArr;
      if (val) {
        keyArr = keyArr.splice(10, 1, '.');
      } else {
        keyArr = keyArr.splice(10, 1, '');
      }
    },
    handleClick(e) {
      if (!this.show) return;
      const keyVal = e.currentTarget.dataset.value;
      if (keyVal) {
        this.$emit('click', {
          value: keyVal
        });
      }
    },
    backspace() {
      this.$emit('backspace', {});
    },
    confirm() {
      if (this.disabled) return;
      this.$emit('confirm', {});
    }
  }
};
</script>

<style scoped>
@font-face {
  font-family: 'digitalKeyboard';
  src: url('data:font/truetype;charset=utf-8;base64,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')
    format('truetype');
  font-weight: normal;
  font-style: normal;
}

.tui-dk__icon {
  font-family: 'digitalKeyboard' !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 48rpx;
}

.tui-icon__backspace:before {
  content: '\e610';
}

.tui-digital-keyboard {
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  visibility: hidden;
  transform: translate3d(0, 100%, 0);
  transform-origin: center;
  transition: all 0.25s ease-in-out;
  padding-bottom: env(safe-area-inset-bottom);
}

.tui-digital-keyboard::before {
  content: ' ';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  border-top: 1px solid rgba(51, 51, 51, 0.1);
  -webkit-transform: scaleY(0.5) translateZ(0);
  transform: scaleY(0.5) translateZ(0);
  transform-origin: 0 0;
  z-index: 2;
  pointer-events: none;
}

.tui-keyboard__action {
  transform: translate3d(0, 0, 0);
  visibility: visible;
}

.tui-keyboard__grids {
  width: 100%;
  display: flex;
  padding-top: 16rpx;
}

.tui-keyboard__left {
  width: 75%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-right: 8rpx;
  box-sizing: border-box;
}

.tui-keyboard__right {
  width: 25%;
  display: flex;
  flex-direction: column;
  padding-left: 8rpx;
  box-sizing: border-box;
}

.tui-keyboard__grid {
  width: 33.3333%;
  flex-shrink: 0;
  padding-left: 16rpx;
  padding-bottom: 16rpx;
  box-sizing: border-box;
}

.tui-keyboard__right .tui-keyboard__grid {
  width: 100%;
  padding-left: 0;
  padding-right: 16rpx;
}

.tui-dk__btn {
  padding-bottom: 16rpx;
}

.tui-dkBtn__disabled {
  opacity: 0.5;
}

.tui-key__item {
  width: 100%;
  font-size: 40rpx;
  font-weight: 600;
  height: 88rpx;
  background-color: #fff;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tui-key__item-active::after {
  content: ' ';
  background-color: rgba(0, 0, 0, 0.1);
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  z-index: 1;
  border-radius: 8rpx;
}

.tui-dk__btn .tui-key__item {
  height: 296rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.tui-flex__2 {
  flex: 2;
}
</style>
