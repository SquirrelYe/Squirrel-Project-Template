<template>
  <view
    class="tui-input__wrap"
    :class="{ 'tui-border__top': borderTop && !inputBorder, 'tui-border__bottom': borderBottom && !inputBorder, 'tui-radius__fillet': isFillet && !getRadius, 'tui-input__border-nvue': inputBorder }"
    :style="getStyles"
    @tap="fieldClick"
  >
    <!-- #ifndef APP-NVUE -->
    <view class="tui-input__border-top" v-if="borderTop && !inputBorder" :style="{ borderTopColor: borderColor }"> </view>
    <view class="tui-input__border-bottom" :class="{ 'tui-line__left': lineLeft }" v-if="borderBottom && !inputBorder" :style="{ borderBottomColor: borderColor }"></view>
    <view class="tui-input__border" :class="{ 'tui-radius__fillet': isFillet && !getRadius }" v-if="inputBorder" :style="{ borderColor: borderColor, borderRadius: getRadius * 2 + 'rpx' }"></view>
    <!-- #endif -->
    <!-- #ifdef APP-NVUE -->
    <view class="tui-input__required" v-if="required">
      <text :style="{ color: getRequiredColor }">*</text>
    </view>
    <!-- #endif -->
    <!-- #ifndef APP-NVUE -->
    <view class="tui-input__required" :style="{ color: getRequiredColor }" v-if="required">*</view>
    <!-- #endif -->
    <view class="tui-input__label" :style="{ fontSize: getLabelSize + 'rpx', color: getLabelColor, minWidth: labelWidth + 'rpx' }" v-if="label">
      <text :style="{ fontSize: getLabelSize + 'rpx', color: getLabelColor }">{{ label }}</text>
    </view>
    <slot name="left"></slot>
    <input
      class="tui-input__self"
      :class="{ 'tui-text__right': textRight }"
      :style="{ fontSize: getSize + 'rpx', color: color }"
      placeholder-class="tui-input__placeholder"
      :type="type"
      :name="name"
      :value="inputVal"
      :password="password"
      :placeholder="placeholder"
      :placeholder-style="placeholderStyl"
      :disabled="disabled"
      :cursor-spacing="cursorSpacing"
      :maxlength="maxlength"
      :focus="focused"
      :confirm-type="confirmType"
      :confirm-hold="confirmHold"
      :cursor="cursor"
      :selection-start="selectionStart"
      :selection-end="selectionEnd"
      :adjust-position="adjustPosition"
      :hold-keyboard="holdKeyboard"
      :auto-blur="autoBlur"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
      @confirm="onConfirm"
      @keyboardheightchange="onKeyboardheightchange"
    />
    <icon type="clear" :size="clearSize" :color="clearColor" v-if="clearable && inputVal != ''" @tap.stop="onClear"> </icon>
    <slot name="right"></slot>
  </view>
</template>

<script>
export default {
  name: 'tui-input',
  emits: ['input', 'update:modelValue', 'focus', 'blur', 'confirm', 'click', 'keyboardheightchange'],
  //这里加group是为了避免在表单中使用时给组件加value属性
  // #ifdef MP-WEIXIN
  behaviors: ['wx://form-field-group'],
  // #endif
  // #ifdef MP-BAIDU || MP-QQ
  //如果在这些平台不需要也能识别，则删除
  behaviors: ['uni://form-field'],
  // #endif
  // #ifdef MP-WEIXIN
  options: {
    addGlobalClass: true,
    virtualHost: true
  },
  // #endif
  props: {
    //是否为必填项
    required: {
      type: Boolean,
      default: false
    },
    requiredColor: {
      type: String,
      default: ''
    },
    //左侧标题
    label: {
      type: String,
      default: ''
    },
    //标题字体大小
    labelSize: {
      type: [Number, String],
      default: 0
    },
    labelColor: {
      type: String,
      default: ''
    },
    //label 最小宽度 rpx
    labelWidth: {
      type: Number,
      default: 140
    },
    clearable: {
      type: Boolean,
      default: false
    },
    //px
    clearSize: {
      type: Number,
      default: 15
    },
    clearColor: {
      type: String,
      default: '#bfbfbf'
    },
    //获取焦点
    focus: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    placeholderStyle: {
      type: String,
      default: ''
    },
    //输入框名称
    name: {
      type: String,
      default: ''
    },
    //输入框值
    value: {
      type: [Number, String],
      default: ''
    },
    // #ifdef VUE3
    //输入框值
    modelValue: {
      type: [Number, String],
      default: ''
    },
    // #endif
    modelModifiers: {
      default: () => ({})
    },
    //与官方input type属性一致
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
    maxlength: {
      type: [Number, String],
      default: 140
    },
    min: {
      type: [Number, String],
      default: 'NaN'
    },
    max: {
      type: [Number, String],
      default: 'NaN'
    },
    cursorSpacing: {
      type: Number,
      default: 0
    },
    confirmType: {
      type: String,
      default: 'done'
    },
    confirmHold: {
      type: Boolean,
      default: false
    },
    cursor: {
      type: Number,
      default: -1
    },
    selectionStart: {
      type: Number,
      default: -1
    },
    selectionEnd: {
      type: Number,
      default: -1
    },
    adjustPosition: {
      type: Boolean,
      default: true
    },
    holdKeyboard: {
      type: Boolean,
      default: false
    },
    autoBlur: {
      type: Boolean,
      default: false
    },
    //输入框字体大小 rpx
    size: {
      type: [Number, String],
      default: 0
    },
    //输入框字体颜色
    color: {
      type: String,
      default: ''
    },
    // 是否显示 input 边框
    inputBorder: {
      type: Boolean,
      default: false
    },
    borderColor: {
      type: String,
      default: 'rgba(0, 0, 0, 0.1)'
    },
    //input是否显示为圆角
    isFillet: {
      type: Boolean,
      default: false
    },
    // 是否显示上边框
    borderTop: {
      type: Boolean,
      default: false
    },
    // 是否显示下边框
    borderBottom: {
      type: Boolean,
      default: true
    },
    //下边框线条是否有左偏移距离
    lineLeft: {
      type: Boolean,
      default: true
    },
    // 是否自动去除两端的空格
    trim: {
      type: Boolean,
      default: true
    },
    textRight: {
      type: Boolean,
      default: false
    },
    //输入框padding值
    padding: {
      type: String,
      default: ''
    },
    //输入框背景颜色
    backgroundColor: {
      type: String,
      default: ''
    },
    radius: {
      type: [Number, String],
      default: -1
    },
    //输入框margin-top值 rpx
    marginTop: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    getLabelSize() {
      return this.labelSize || (uni && uni.$tui && uni.$tui.tuiInput.labelSize) || 32;
    },
    getLabelColor() {
      return this.labelColor || (uni && uni.$tui && uni.$tui.tuiInput.labelColor) || '#333';
    },
    getSize() {
      return this.size || (uni && uni.$tui && uni.$tui.tuiInput.size) || 32;
    },
    getColor() {
      return this.color || (uni && uni.$tui && uni.$tui.tuiInput.color) || '#333';
    },
    getRadius() {
      let radius = this.radius;
      if (radius === -1 || radius === true) {
        radius = uni && uni.$tui && uni.$tui.tuiInput.radius;
      }
      return Number(radius || 0);
    },
    getStyles() {
      const padding = this.padding || (uni && uni.$tui && uni.$tui.tuiInput.padding) || '26rpx 30rpx';
      const bgColor = this.backgroundColor || (uni && uni.$tui && uni.$tui.tuiInput.backgroundColor) || '#FFFFFF';
      let radius = this.getRadius;
      let styles = `padding:${padding};background:${bgColor};margin-top:${this.marginTop}rpx;`;
      if (radius && radius !== true && radius !== -1) {
        styles += `border-radius:${radius}rpx;`;
      }
      if (this.borderTop || this.borderBottom || this.inputBorder) {
        styles += `border-color:${this.borderColor};`;
      }
      return styles;
    },
    getRequiredColor() {
      return this.requiredColor || (uni && uni.$tui && uni.$tui.tuiInput.requiredColor) || '#EB0909';
    }
  },
  data() {
    return {
      placeholderStyl: '',
      focused: false,
      inputVal: ''
    };
  },
  watch: {
    focus(val) {
      this.$nextTick(() => {
        this.focused = val;
      });
    },
    placeholderStyle() {
      this.fieldPlaceholderStyle();
    },
    // #ifdef VUE3
    modelValue(newVal) {
      this.inputVal = newVal;
    },
    // #endif
    value(newVal) {
      this.inputVal = newVal;
    }
  },
  created() {
    // #ifndef VUE3
    this.inputVal = this.value;
    // #endif

    // #ifdef VUE3
    if (this.value && !this.modelValue) {
      this.inputVal = this.value;
    } else {
      this.inputVal = this.modelValue;
    }
    // #endif
    this.fieldPlaceholderStyle();
  },
  mounted() {
    this.$nextTick(() => {
      // #ifdef MP-TOUTIAO
      setTimeout(() => {
        this.focused = this.focus;
      }, 300);
      // #endif
      // #ifndef MP-TOUTIAO
      setTimeout(() => {
        this.focused = this.focus;
      }, 120);
      // #endif
    });
  },
  methods: {
    fieldPlaceholderStyle() {
      if (this.placeholderStyle) {
        this.placeholderStyl = this.placeholderStyle;
      } else {
        const size = uni.upx2px(this.size || (uni && uni.$tui && uni.$tui.tuiInput.size) || 32);
        this.placeholderStyl = `font-size:${size}px`;
      }
    },
    onInput(event) {
      let value = event.detail.value;
      if (this.trim) value = this.trimStr(value);
      this.inputVal = value;
      if (this.modelModifiers.number || this.type === 'digit' || this.type === 'number') {
        const cVal = Number(value);
        let eVal = this.type === 'digit' ? value : cVal;
        if (typeof cVal === 'number') {
          const min = Number(this.min);
          const max = Number(this.max);
          if (typeof min === 'number' && cVal < min) {
            eVal = min;
          } else if (typeof max === 'number' && max < cVal) {
            eVal = max;
          }
        }
        value = isNaN(eVal) ? value : eVal;
      }
      this.$nextTick(() => {
        event.detail.value !== '' && (this.inputVal = value);
      });
      const inputValue = event.detail.value !== '' ? value : '';
      this.$emit('input', inputValue);
      // #ifdef VUE3
      this.$emit('update:modelValue', inputValue);
      // #endif
    },
    onFocus(event) {
      this.$emit('focus', event);
    },
    onBlur(event) {
      this.$emit('blur', event);
    },
    onConfirm(e) {
      this.$emit('confirm', e);
    },
    onClear(event) {
      if (this.disabled) return;
      uni.hideKeyboard();
      this.inputVal = '';
      this.$emit('input', '');
      // #ifdef VUE3
      this.$emit('update:modelValue', '');
      // #endif
    },
    fieldClick() {
      this.$emit('click', {
        name: this.name
      });
    },
    onKeyboardheightchange(e) {
      this.$emit('keyboardheightchange', e.detail);
    },
    trimStr(str) {
      return str.replace(/^\s+|\s+$/g, '');
    }
  }
};
</script>

<style scoped>
.tui-input__wrap {
  /* #ifndef APP-NVUE */
  width: 100%;
  box-sizing: border-box;
  display: flex;
  /* #endif */
  flex-direction: row;
  align-items: center;
  position: relative;
  flex: 1;
  /* #ifdef APP-NVUE */
  padding: 26rpx 30rpx;
  /* #endif */
  border-width: 0;
}

/* #ifndef APP-NVUE */

.tui-input__border-top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  border-top: 1px solid var(--thorui-line-color, rgba(0, 0, 0, 0.1));
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  transform-origin: 0 0;
  z-index: 2;
  pointer-events: none;
}

.tui-input__border-bottom {
  position: absolute;
  border-bottom: 1px solid var(--thorui-line-color, rgba(0, 0, 0, 0.1));
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  transform-origin: 0 100%;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 2;
  pointer-events: none;
}

.tui-line__left {
  left: 30rpx !important;
}

/* #endif */

/* #ifdef APP-NVUE */
.tui-border__top {
  border-top-width: 0.5px;
  border-top-style: solid;
}

.tui-border__bottom {
  border-top-width: 0.5px;
  border-top-style: solid;
}

/* #endif */
.tui-input__required {
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

.tui-input__label {
  padding-right: 12rpx;
  /* #ifndef APP-NVUE */
  flex-shrink: 0;
  /* #endif */
}

.tui-input__self {
  flex: 1;
  padding-right: 12rpx;
  /* #ifndef APP-NVUE */
  box-sizing: border-box;
  overflow: visible;
  /* #endif */
  background-color: transparent;
}

.tui-input__placeholder {
  /* #ifndef APP-NVUE */
  color: var(--thorui-text-color-placeholder, #ccc);
  overflow: visible;
  /* #endif */
  /* #ifdef APP-NVUE */
  color: #ccc;
  font-size: 32rpx;
  /* #endif */
}

/* #ifdef MP */
::v-deep .tui-input__placeholder {
  color: var(--thorui-text-color-placeholder, #ccc);
  overflow: visible;
}

/* #endif */

/* #ifdef APP-NVUE */
.tui-input__border-nvue {
  border-width: 0.5px;
  border-style: solid;
}

/* #endif */

/* #ifndef APP-NVUE */
.tui-input__border {
  position: absolute;
  height: 200%;
  width: 200%;
  border: 1px solid var(--thorui-border-color, #d1d1d1);
  transform-origin: 0 0;
  transform: scale(0.5);
  left: 0;
  top: 0;
  border-radius: 8rpx;
  pointer-events: none;
}

/* #endif */

.tui-radius__fillet {
  border-radius: 100px !important;
}

.tui-text__right {
  text-align: right;
}
</style>
