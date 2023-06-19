<template>
  <view class="tui-code__input" :style="{ marginTop: marginTop + 'rpx', marginBottom: marginBottom + 'rpx' }" @tap="onClick">
    <view class="tui-code__input" :style="{ paddingLeft: gap + 'rpx', paddingRight: gap + 'rpx' }">
      <view
        class="tui-cinput__item"
        :style="{
          width: width + 'rpx',
          height: height + 'rpx',
          background: background,
          borderRadius: radius + 'rpx',
          borderColor: activeIndex === index || inputVal[index] ? getActiveColor : borderColor,
          borderTopWidth: (borderType == 1 ? borderWidth : 0) + 'rpx',
          borderLeftWidth: (borderType == 1 ? borderWidth : 0) + 'rpx',
          borderRightWidth: (borderType == 1 ? borderWidth : 0) + 'rpx',
          borderBottomWidth: (borderType == 1 || borderType == 2 ? borderWidth : 0) + 'rpx'
        }"
        @tap="onTap"
        v-for="(item, index) in inputArr"
        :key="index"
      >
        <text class="tui-cinput__text" :style="{ width: width + 'rpx', height: height + 'rpx', fontSize: size + 'rpx', lineHeight: height + 'rpx', color: color, fontWeight: fontWeight }">{{
          password ? (inputVal[index] ? '●' : '') : inputVal[index] || ''
        }}</text>
        <text class="tui-cinput__placeholder" :style="{ fontSize: size + 'rpx', fontWeight: fontWeight }">{{ password ? (inputVal[index] ? '●' : '') : inputVal[index] || '' }}</text>
        <view
          class="tui-cinput__cursor"
          :class="{ 'tui-cinput__cursor-ani': activeIndex === index && focus }"
          v-if="cursor && !disabled"
          :style="{ height: cursorHeight + 'rpx', background: getCursorColor }"
        >
        </view>
      </view>
    </view>
    <input
      :value="val"
      :password="password"
      :type="type"
      class="tui-cinput__hidden"
      :class="{ 'tui-cinput__ali': ali }"
      @input="onInput"
      @blur="onBlur"
      :focus="focus"
      :maxlength="length"
      :disabled="disabled"
      @confirm="onConfirm"
      @focus="onTap"
    />
  </view>
</template>

<script>
export default {
  name: 'tuiCodeInput',
  emits: ['complete', 'focus', 'input', 'blur', 'confirm'],
  props: {
    //组件外层左右间距
    gap: {
      type: [Number, String],
      default: 80
    },
    marginTop: {
      type: [Number, String],
      default: 0
    },
    marginBottom: {
      type: [Number, String],
      default: 0
    },
    //初始值，不可超过length长度
    value: {
      type: String,
      default: ''
    },
    //H5不支持动态切换type类型
    type: {
      type: String,
      default: 'text'
    },
    password: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    //获取焦点
    isFocus: {
      type: Boolean,
      default: false
    },
    cursor: {
      type: Boolean,
      default: true
    },
    cursorColor: {
      type: String,
      default: ''
    },
    cursorHeight: {
      type: [Number, String],
      default: 60
    },
    //输入框个数
    length: {
      type: Number,
      default: 4
    },
    width: {
      type: [Number, String],
      default: 108
    },
    height: {
      type: [Number, String],
      default: 108
    },
    background: {
      type: String,
      default: 'transparent'
    },
    //1-显示所有边框 2-只显示底部边框，3-无边框
    borderType: {
      type: [Number, String],
      default: 1
    },
    borderColor: {
      type: String,
      default: '#eaeef1'
    },
    activeColor: {
      type: String,
      default: ''
    },
    borderWidth: {
      type: [Number, String],
      default: 2
    },
    radius: {
      type: [Number, String],
      default: 0
    },
    size: {
      type: [Number, String],
      default: 48
    },
    color: {
      type: String,
      default: '#333'
    },
    fontWeight: {
      type: [Number, String],
      default: 600
    }
  },
  computed: {
    getCursorColor() {
      return this.cursorColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    },
    getActiveColor() {
      return this.activeColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    }
  },
  data() {
    return {
      inputArr: [],
      inputVal: [],
      focus: false,
      activeIndex: -1,
      ali: false,
      val: ''
    };
  },
  watch: {
    length(val) {
      const nums = Number(val);
      if (nums !== this.inputArr.length) {
        this.inputArr = this.getArr(nums);
      }
    },
    value(val) {
      this.focus = true;
      val = val.replace(/\s+/g, '');
      this.getVals(val);
    },
    isFocus(val) {
      this.initFocus(val);
    }
  },
  created() {
    this.inputArr = this.getArr(Number(this.length));
    let val = this.value.replace(/\s+/g, '');
    this.getVals(val, true);
  },
  mounted() {
    setTimeout(() => {
      this.initFocus(this.isFocus);
    }, 300);
  },
  methods: {
    initFocus(val) {
      if (this.disabled) return;
      if (val && this.activeIndex === -1) {
        this.activeIndex = 0;
      }
      if (!this.value && !val) {
        this.activeIndex = -1;
      }
      this.$nextTick(() => {
        this.focus = val;
      });
    },
    getArr(end) {
      return Array.from(new Array(end + 1).keys()).slice(1);
    },
    getVals(val, init = false) {
      this.val = val;
      if (!val) {
        this.inputVal = [];
        this.activeIndex = init ? -1 : 0;
      } else {
        let vals = val.split('');
        let arr = [];
        this.inputArr.forEach((item, index) => {
          arr.push(vals[index] || '');
        });
        this.inputVal = arr;
        const len = vals.length;
        this.activeIndex = len > this.length ? this.length : len;
        if (len === this.length) {
          this.$emit('complete', {
            detail: {
              value: val
            }
          });
          this.focus = false;
          uni.hideKeyboard();
        }
      }
    },
    onTap() {
      if (this.disabled) return;
      this.focus = true;
      if (this.activeIndex === -1) {
        this.activeIndex = 0;
      }
      if (this.activeIndex === this.length) {
        this.activeIndex--;
      }
      this.$emit('focus', {});
    },
    onInput(e) {
      let value = e.detail.value;
      value = value.replace(/\s+/g, '');
      this.getVals(value);
      this.$emit('input', {
        detail: {
          value: value
        }
      });
    },
    onBlur(e) {
      let value = e.detail.value;
      value = value.replace(/\s+/g, '');
      this.focus = false;
      // #ifdef MP-ALIPAY
      this.ali = false;
      // #endif
      if (!value) {
        this.activeIndex = -1;
      }
      this.$emit('blur', {
        detail: {
          value: value
        }
      });
    },
    onConfirm(e) {
      this.focus = false;
      uni.hideKeyboard();
      this.$emit('confirm', e);
    },
    onClick() {
      // #ifdef MP-ALIPAY
      setTimeout(() => {
        this.ali = true;
      }, 50);
      // #endif
    },
    clear() {
      this.val = '';
      this.inputVal = [];
      this.activeIndex = -1;
      this.$nextTick(() => {
        this.onTap();
      });
    }
  }
};
</script>

<style scoped>
.tui-code__input {
  position: relative;
  /* #ifdef MP-BAIDU */
  max-width: 100%;
  overflow: hidden;
  /* #endif */
}

.tui-code__input {
  /* #ifndef APP-NVUE */
  width: 100%;
  display: flex;
  box-sizing: border-box;
  /* #endif */
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.tui-cinput__item {
  /* #ifndef APP-NVUE */
  display: flex;
  box-sizing: border-box;
  /* #endif */
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-style: solid;
  position: relative;
  overflow: hidden;
}

.tui-cinput__text {
  position: absolute;
  left: 0;
  top: 0;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.tui-cinput__placeholder {
  text-align: center;
  opacity: 0;
}

.tui-cinput__cursor {
  border-radius: 2px;
  width: 0;
}

.tui-cinput__cursor-ani {
  width: 2px;
  animation: ani_cursor 1s infinite steps(1, start);
}

@keyframes ani_cursor {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.tui-cinput__hidden {
  position: absolute;
  left: 0;
  top: 0;
  /* #ifndef MP */
  right: 0;
  bottom: 0;
  /* #endif */
  /* #ifndef MP-WEIXIN || MP-QQ */
  width: 100%;
  height: 100%;
  /* #endif */
  z-index: 2;
  /* #ifdef MP-WEIXIN || MP-QQ || MP-TOUTIAO */
  height: 0;
  width: 0;
  border: none;
  /* #endif */
  margin: 0;
  padding: 0;
  opacity: 0;
  /* #ifdef MP-ALIPAY || MP-BAIDU || MP-TOUTIAO */
  font-size: 0;
  /* #endif */

  /* #ifdef MP-BAIDU */
  transform: scaleX(2);
  transform-origin: 100% center;
  /* #endif */
  color: transparent;
}

/* #ifdef MP-ALIPAY */
.tui-cinput__ali {
  height: 0;
  width: 0;
}

/* #endif */
</style>
