<template>
  <view class="tui-button__container" :style="{ width: width, height: height, margin: margin, borderRadius: radius }" @touchstart="handleStart" @touchend="handleClick" @touchcancel="handleEnd">
    <button
      class="tui-button"
      :class="[
        bold ? 'tui-text__bold' : '',
        time && (plain || link) ? 'tui-button__opacity' : '',
        disabled && !disabledBackground ? 'tui-button__opacity' : '',
        (!width || width === '100%' || width === true) && (!btnSize || btnSize === true) ? 'tui-button__flex-1' : '',
        time && !plain && !link ? 'tui-button__active' : ''
      ]"
      :style="{
        width: getWidth,
        height: getHeight,
        lineHeight: getHeight,
        background: disabled && disabledBackground ? disabledBackground : plain ? 'transparent' : getBackground,
        borderWidth: borderWidth,
        borderColor: borderColor ? borderColor : disabled && disabledBackground ? disabledBackground : link ? 'transparent' : getBackground,
        borderRadius: radius,
        fontSize: getSize + 'rpx',
        color: disabled && disabledBackground ? disabledColor : getColor
      }"
      :loading="loading"
      :form-type="formType"
      :open-type="openType"
      :app-parameter="appParameter"
      @getuserinfo="bindgetuserinfo"
      @getphonenumber="bindgetphonenumber"
      @contact="bindcontact"
      @error="binderror"
      @opensetting="bindopensetting"
      @chooseavatar="bindchooseavatar"
      @launchapp="bindlaunchapp"
      :disabled="disabled"
      :scope="scope"
      @tap.stop="handleTap"
    >
      <text
        class="tui-button__text"
        :class="{ 'tui-text__bold': bold }"
        v-if="text"
        :style="{ fontSize: getSize + 'rpx', lineHeight: getSize + 'rpx', color: disabled && disabledBackground ? disabledColor : getColor }"
        >{{ text }}</text
      >
      <slot></slot>
    </button>
  </view>
</template>

<script>
export default {
	name: 'tui-form-button',
	emits: ['click', 'getuserinfo', 'contact', 'getphonenumber', 'error', 'opensetting'],
	// #ifdef MP-WEIXIN
	behaviors: ['wx://form-field-button'],
	// #endif
	props: {
		//按钮背景色
		background: {
			type: String,
			default: ''
		},
		//按钮显示文本
		text: {
			type: String,
			default: ''
		},
		//按钮字体颜色
		color: {
			type: String,
			default: ''
		},
		//按钮禁用背景色
		disabledBackground: {
			type: String,
			default: ''
		},
		//按钮禁用字体颜色
		disabledColor: {
			type: String,
			default: ''
		},
		borderWidth: {
			type: String,
			// #ifdef APP-NVUE
			default: '0.5px'
			// #endif
			// #ifndef APP-NVUE
			default: '1rpx'
			// #endif
		},
		borderColor: {
			type: String,
			default: ''
		},
		//宽度
		width: {
			type: String,
			default: '100%'
		},
		//高度
		height: {
			type: String,
			default: ''
		},
		//medium 368*80 / small 240*80/ mini 116*64
		btnSize: {
			type: String,
			default: ''
		},
		//字体大小，单位rpx
		size: {
			type: [Number, String],
			default: 0
		},
		bold: {
			type: Boolean,
			default: false
		},
		margin: {
			type: String,
			default: '0'
		},
		//圆角
		radius: {
			type: String,
			default: ''
		},
		plain: {
			type: Boolean,
			default: false
		},
		link: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		loading: {
			type: Boolean,
			default: false
		},
		formType: {
			type: String,
			default: ''
		},
		openType: {
			type: String,
			default: ''
		},
		//支付宝小程序
		//当 open-type 为 getAuthorize 时，可以设置 scope 为：phoneNumber、userInfo
		scope: {
			type: String,
			default: ''
		},
		appParameter: {
			type: String,
			default: ''
		},
		index: {
			type: [Number, String],
			default: 0
		}
	},
	computed: {
		getWidth() {
			//medium 184*40 / small 120 40/ mini 58*32
			let width = this.width;
			if (this.btnSize && this.btnSize !== true) {
				width = {
					'medium': '368rpx',
					'small': '240rpx',
					'mini': '116rpx'
				} [this.btnSize] || this.width
			}
			return width
		},
		getHeight() {
			//medium 184*40 / small 120 40/ mini 58*32
			let height = this.height || (uni && uni.$tui && uni.$tui.tuiFormButton.height) || '96rpx';
			if (this.btnSize && this.btnSize !== true) {
				height = {
					'medium': '80rpx',
					'small': '80rpx',
					'mini': '64rpx'
				} [this.btnSize] || height
			}
			return height
		},
		getBackground() {
			return this.background || (uni && uni.$tui && uni.$tui.tuiFormButton.background) || '#5677fc';
		},
		getColor() {
			return this.color || (uni && uni.$tui && uni.$tui.tuiFormButton.color) || '#fff';
		},
		getRadius() {
			return this.radius || (uni && uni.$tui && uni.$tui.tuiFormButton.radius) || '6rpx';
		},
		getSize() {
			return this.size || (uni && uni.$tui && uni.$tui.tuiFormButton.size) || 32;
		}
	},
	data() {
		return {
			time: 0,
			trigger: false,
			tap: false
		};
	},
	methods: {
		handleStart() {
			if (this.disabled) return;
			this.trigger = false;
			this.tap = true;
			if (new Date().getTime() - this.time <= 150) return;
			this.trigger = true;
			this.time = new Date().getTime();
		},
		handleClick() {
			if (this.disabled || !this.trigger) return;
			this.time = 0;
		},
		handleTap() {
			if (this.disabled) return;
			this.$emit('click', {
				index: Number(this.index)
			});
		},
		handleEnd() {
			if (this.disabled) return;
			setTimeout(() => {
				this.time = 0;
			}, 150);
		},
		bindgetuserinfo({
			detail = {}
		} = {}) {
			this.$emit('getuserinfo', detail);
		},
		bindcontact({
			detail = {}
		} = {}) {
			this.$emit('contact', detail);
		},
		bindgetphonenumber({
			detail = {}
		} = {}) {
			this.$emit('getphonenumber', detail);
		},
		binderror({
			detail = {}
		} = {}) {
			this.$emit('error', detail);
		},
		bindopensetting({
			detail = {}
		} = {}) {
			this.$emit('opensetting', detail);
		},
		bindchooseavatar({
			detail = {}
		} = {}) {
			this.$emit('chooseavatar', detail);
		},
		bindlaunchapp({
			detail = {}
		} = {}) {
			this.$emit('launchapp', detail);
		}
	}
};
</script>

<style scoped>
.tui-button__container {
  position: relative;
}

.tui-button {
  /* #ifdef APP-NVUE */
  border-width: 0.5px;
  /* #endif */
  /* #ifndef APP-NVUE */
  border-width: 1rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  /* #endif */
  border-style: solid;
  position: relative;
  padding-left: 0;
  padding-right: 0;
  overflow: hidden;
  /* #ifndef APP-NVUE */
  transform: translateZ(0);
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  /* #endif */
}

.tui-button__flex-1 {
  flex: 1;
  /* #ifndef APP-NVUE */
  width: 100%;
  /* #endif */
}

.tui-button::after {
  border: 0;
}

/* #ifndef APP-NVUE */
.tui-button__active {
  overflow: hidden !important;
}

.tui-button__active::after {
  content: ' ';
  background-color: rgba(0, 0, 0, 0.1);
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  transform: none;
  z-index: 1;
  border-radius: 0;
}

/* #endif */
.tui-button__text {
  text-align: center;
  flex-direction: row;
  align-items: center;
  justify-content: center !important;
  padding-left: 0 !important;
}

.tui-button__opacity {
  opacity: 0.5;
}

.tui-text__bold {
  font-weight: bold;
}
</style>
