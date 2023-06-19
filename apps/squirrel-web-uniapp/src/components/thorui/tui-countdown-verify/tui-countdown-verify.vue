<template>
  <view
    class="tui-countdown__verify"
    :class="{ 'tui-verify__opacity': status > 1 && isOpacity }"
    :style="{ width: width, height: height, padding: padding, margin: margin, borderRadius: radius, fontSize: size + 'rpx', color: getColor, background: background }"
    :hover-class="hover && status == 1 ? 'tui-verify__opacity' : ''"
    :hover-stay-time="150"
    @tap.stop="sendCode"
  >
    {{ showText }}
    <view class="tui-verify__line" :style="{ borderWidth: borderWidth, borderColor: getBorderColor, borderRadius: radius }"></view>
  </view>
</template>

<script>
export default {
  name: 'tuiCountdownVerify',
  emits: ['send', 'countdown', 'end'],
  props: {
    //发送前显示文本
    text: {
      type: String,
      default: '发送验证码'
    },
    //发送中显示文本
    sendText: {
      type: String,
      default: '请稍候...'
    },
    //发送后显示文本(前面会自动加上seconds)
    countdownText: {
      type: String,
      default: 's后获取'
    },
    //倒计时秒数
    seconds: {
      type: Number,
      default: 60
    },
    //宽度
    width: {
      type: String,
      default: '182rpx'
    },
    //高度
    height: {
      type: String,
      default: '56rpx'
    },
    padding: {
      type: String,
      default: '0'
    },
    margin: {
      type: String,
      default: '0'
    },
    //圆角
    radius: {
      type: String,
      default: '6rpx'
    },
    //字体大小 rpx
    size: {
      type: Number,
      default: 24
    },
    //字体颜色
    color: {
      type: String,
      default: ''
    },
    //背景色
    background: {
      type: String,
      default: 'transparent'
    },
    //边框宽度
    borderWidth: {
      type: String,
      default: '1px'
    },
    //边框颜色
    borderColor: {
      type: String,
      default: ''
    },
    //倒计时的时候是否改变opacity值
    isOpacity: {
      type: Boolean,
      default: true
    },
    //是否需要点击效果
    hover: {
      type: Boolean,
      default: true
    },
    //短信发送成功（改变数值且数值大于0表示发送成功，多次发送数值递增即可）
    successVal: {
      type: Number,
      default: 0
    },
    //重置组件状态（改变数值且数值大于0，多次重置数值递增即可）
    resetVal: {
      type: Number,
      default: 0
    },
    //是否默认为倒计时状态
    start: {
      type: Boolean,
      default: false
    },
    //自定义参数
    params: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    getColor() {
      return this.color || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    },
    getBorderColor() {
      return this.borderColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    }
  },
  data() {
    return {
      showText: '',
      //1-发送前，2-发送中 3-发送成功，倒计时
      status: 1,
      countdownTimer: null
    };
  },
  created() {
    if (this.start) {
      this.doLoop();
    } else {
      this.showText = this.text;
      this.clearTimer();
    }
  },
  // #ifndef VUE3
  beforeDestroy() {
    this.clearTimer();
  },
  // #endif
  // #ifdef VUE3
  beforeUnmount() {
    this.clearTimer();
  },
  // #endif
  watch: {
    successVal(val) {
      if (val && val > 0) {
        this.doLoop();
      }
    },
    resetVal(val) {
      if (val && val > 0) {
        this.reset();
      }
    }
  },
  methods: {
    sendCode() {
      if (this.status > 1) return;
      this.clearTimer();
      this.status = 2;
      this.showText = this.sendText;
      this.$emit('send', {
        params: this.params
      });
    },
    doLoop: function () {
      this.clearTimer();
      this.status = 3;
      let seconds = this.seconds || 60;
      this.showText = seconds + this.countdownText;
      this.countdownTimer = setInterval(() => {
        if (seconds > 1) {
          --seconds;
          this.showText = seconds + this.countdownText;
          //倒计时
          this.$emit('countdown', {
            seconds: seconds,
            params: this.params
          });
        } else {
          this.reset();
          //倒计时结束
          this.$emit('end', {
            params: this.params
          });
        }
      }, 1000);
    },
    //验证码发送成功
    success() {
      this.doLoop();
    },
    //重置发送组件
    reset() {
      this.clearTimer();
      this.showText = this.text;
      this.status = 1;
    },
    clearTimer() {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }
};
</script>

<style scoped>
.tui-countdown__verify {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  box-sizing: border-box;
}

.tui-verify__opacity {
  opacity: 0.5;
}

.tui-verify__line {
  position: absolute;
  width: 200%;
  height: 200%;
  transform-origin: 0 0;
  transform: scale(0.5, 0.5) translateZ(0);
  box-sizing: border-box;
  border-style: solid;
  left: 0;
  top: 0;
  pointer-events: none;
}
</style>
