<template>
  <view class="tui-form__box" :style="{ backgroundColor: backgroundColor, padding: padding, borderRadius: radius }">
    <slot></slot>
    <view
      class="tui-form__errmsg"
      :style="{ top: tipTop + 'px', padding: tipPadding, backgroundColor: getTipBgColor, borderRadius: tipRidus }"
      v-if="showMessage"
      :class="{ 'tui-message__show': errorMsg }"
      ><text class="tui-form__text" :style="{ fontSize: tipSize + 'rpx', color: tipColor }">{{ errorMsg }}</text></view
    >
    <view class="tui-form__mask" v-if="disabled"></view>
  </view>
</template>

<script>
import form from './tui-validation.js';
export default {
  name: 'tui-form',
  props: {
    //表单数据对象，即将废弃
    model: {
      type: Object,
      default() {
        return {};
      }
    },
    //表单验证规则，即将废弃
    rules: {
      type: Array,
      default() {
        return [];
      }
    },
    //表单背景颜色
    backgroundColor: {
      type: String,
      default: 'transparent'
    },
    //表单padding值
    padding: {
      type: String,
      default: '0'
    },
    //是否显示校验错误信息
    showMessage: {
      type: Boolean,
      default: true
    },
    //表单圆角值
    radius: {
      type: String,
      default: '0'
    },
    //是否禁用该表单内的所有组件,透明遮罩层
    disabled: {
      type: Boolean,
      default: false
    },
    //提示框top值 px
    tipTop: {
      type: [Number, String],
      // #ifdef H5
      default: 44,
      // #endif
      // #ifndef H5
      default: 0
      // #endif
    },
    //错误提示框padding值
    tipPadding: {
      type: String,
      default: '20rpx'
    },
    //错误提示框背景色
    tipBackgroundColor: {
      type: String,
      default: ''
    },
    //错误提示字体大小
    tipSize: {
      type: [Number, String],
      default: 28
    },
    //错误提示字体颜色
    tipColor: {
      type: String,
      default: '#fff'
    },
    //错误提示框圆角值
    tipRidus: {
      type: String,
      default: '12rpx'
    },
    //错误消息显示时间 ms
    duration: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    getTipBgColor() {
      return this.tipBackgroundColor || (uni && uni.$tui && uni.$tui.tuiForm.tipBackgroundColor) || '#f74d54';
    }
  },
  data() {
    return {
      errorMsg: '',
      timer: null
    };
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
  methods: {
    clearTimer() {
      clearTimeout(this.timer);
      this.timer = null;
    },
    //{Object} model 表单数据对象
    //{Array} rules 表单验证规则
    validate(model, rules) {
      model = model || this.model;
      rules = rules || this.rules;
      return new Promise((resolve, reject) => {
        let checkRes = form.validation(model, rules);
        let obj = {
          isPass: true,
          errorMsg: checkRes
        };
        if (!checkRes) {
          resolve(obj);
        } else {
          if (this.showMessage) {
            this.clearTimer();
            this.errorMsg = checkRes;
            const duration = this.duration || (uni && uni.$tui && uni.$tui.tuiForm.duration) || 2000;
            this.timer = setTimeout(() => {
              this.errorMsg = '';
            }, Number(duration));
          }
          obj.isPass = false;
          reject(obj);
        }
      });
    }
  }
};
</script>

<style scoped>
.tui-form__box {
  /* #ifndef APP-NVUE */
  width: 100%;
  box-sizing: border-box;
  /* #endif */
  flex: 1;
  position: relative;
}

.tui-form__errmsg {
  position: fixed;
  z-index: 900;
  text-align: center;
  left: 20rpx;
  right: 20rpx;
  /* #ifndef APP-NVUE */
  box-sizing: border-box;
  display: flex;
  word-break: break-all;
  /* #endif */
  align-items: center;
  justify-content: center;
  padding: 24rpx;
  opacity: 0;
  transform: translateZ(0) translateY(-100%);
  transition-property: transform, opacity;
  transition-duration: 0.25s;
  transition-delay: 0s;
  transition-timing-function: ease-in-out;
}

.tui-form__text {
  text-align: center;
}

.tui-message__show {
  transform: translateY(0) translateZ(0);
  opacity: 1;
}

.tui-form__mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  z-index: 99;
}
</style>
