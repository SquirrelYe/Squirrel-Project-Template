<template>
  <view class="tui-copy__box">
    <!-- #ifndef MP-ALIPAY -->
    <text
      :selectable="systemCopy"
      class="tui-ccpy__text"
      @longpress.stop="handleCopy"
      @mousedown="handleCopyByPC"
      @touchstart="handlePC"
      :style="{ color: color, fontSize: size + 'rpx', fontWeight: bold ? 'bold' : 'normal', backgroundColor: showToolTip ? backgroundColor : 'transparent' }"
    >
      {{ value }}
    </text>
    <!-- #endif -->
    <!-- #ifdef MP-ALIPAY -->
    <view
      :selectable="systemCopy"
      class="tui-ccpy__text"
      @longpress.stop="handleCopy"
      @touchstart="handlePC"
      :style="{ color: color, fontSize: size + 'rpx', fontWeight: bold ? 'bold' : 'normal', backgroundColor: showToolTip ? backgroundColor : 'transparent' }"
    >
      {{ value }}
    </view>
    <!-- #endif -->
    <view
      v-if="showToolTip && !systemCopy"
      class="tui-tooltip__list"
      :class="['tui-tooltip__' + direction, (direction == 'left' || direction == 'right') && buttons.length > 0 ? 'tui-tooltip__column' : '']"
      :style="{ zIndex: zIndex }"
    >
      <view
        v-if="!removeCopy || buttons.length === 0"
        class="tui-tooltip__cell"
        :class="[(direction == 'left' || direction == 'right') && buttons.length > 0 ? 'tui-tooltip__cell-column' : '']"
        @tap.stop="copy"
      >
        复制
      </view>
      <view
        class="tui-tooltip__cell tui-tooltip__extend"
        :class="[direction == 'left' || direction == 'right' ? 'tui-tooltip__cell-column' : '']"
        v-for="(item, index) in buttons"
        :key="index"
        :data-index="index"
        @tap.stop="buttonTap"
      >
        {{ item }}
      </view>
    </view>
  </view>
</template>

<script>
import thorui from '@/components/common/tui-clipboard/tui-clipboard.js';
export default {
  name: 'tuiCopyText',
  emits: ['click', 'copy'],
  props: {
    value: {
      type: String,
      default: 'copy text'
    },
    //需要复制的文本，默认空，则默认复制的值为value
    copyValue: {
      type: String,
      default: ''
    },
    //字体大小
    size: {
      type: Number,
      default: 28
    },
    //是否加粗
    bold: {
      type: Boolean,
      default: false
    },
    //字体颜色
    color: {
      type: String,
      default: '#333'
    },
    //选中后背景色
    backgroundColor: {
      type: String,
      default: 'transparent'
    },
    //是否显示复制tooltip，为false时，长按直接复制（无扩展buttons时生效）
    showCopyBtn: {
      type: Boolean,
      default: true
    },
    //复制按钮显示方向：top，left，right，bottom
    direction: {
      type: String,
      default: 'top'
    },
    //复制按钮z-index
    zIndex: {
      type: Number,
      default: 997
    },
    //使用系统长按操作，扩展按钮失效
    systemCopy: {
      type: Boolean,
      default: false
    },
    //是否移除复制按钮(当只需要扩展按钮时使用且有扩展按钮时生效)
    removeCopy: {
      type: Boolean,
      default: false
    },
    //扩展按钮（1~3个左右）
    buttons: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      showToolTip: false,
      isCopy: true
    };
  },
  methods: {
    handlePC(e) {
      this.isCopy = false;
    },
    handleCopyByPC(e) {
      if (this.isCopy) {
        this.handleCopy(e);
      }
    },
    handleCopy(e) {
      if (this.systemCopy) return;
      if (this.showCopyBtn || this.buttons.length > 0) {
        this.showToolTip = true;
      } else {
        this.copy(e);
      }
    },
    copy(e) {
      thorui.getClipboardData(
        this.copyValue || this.value,
        res => {
          if (res) {
            uni.showToast({
              title: '复制成功',
              icon: 'none'
            });
            this.$emit('copy', {
              value: this.value,
              copyValue: this.copyValue
            });
          }
        },
        e
      );
      this.cancel();
    },
    cancel() {
      this.showToolTip = false;
    },
    buttonTap(e) {
      let index = Number(e.currentTarget.dataset.index);
      this.$emit('click', {
        index: index,
        value: this.value,
        copyValue: this.copyValue
      });
      this.cancel();
    }
  }
};
</script>

<style scoped>
.tui-copy__box {
  display: inline-block;
  position: relative;
  font-weight: initial;
}

.tui-ccpy__text {
  position: relative;
  z-index: 2;
}

.tui-tooltip__list {
  font-size: 14px;
  position: absolute;
  border-radius: 6px;
  background-color: #060607;
  padding: 5px 0;
  display: flex;
  align-items: center;
}

.tui-tooltip__column {
  flex-direction: column;
  padding: 0;
}

.tui-tooltip__cell {
  min-width: 60px;
  box-sizing: border-box;
  color: #ffffff;
  text-align: center;
  padding: 0 5px;
}

.tui-tooltip__extend {
  border-left: 1rpx solid rgba(255, 255, 255, 0.3);
}

.tui-tooltip__cell-column {
  padding: 5px !important;
  border-left: 0 !important;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.3);
}

.tui-tooltip__cell:last-child {
  border-bottom: 0 !important;
}

.tui-tooltip__top {
  left: 50%;
  top: 0;
  transform: translate(-50%, -100%);
  margin-top: -10px;
}

.tui-tooltip__top::after {
  content: ' ';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 0);
  border-width: 5px;
  border-style: solid;
  border-color: #060607 transparent transparent transparent;
}

.tui-tooltip__bottom {
  left: 50%;
  top: 100%;
  transform: translate(-50%, 0);
  margin-top: 10px;
}

.tui-tooltip__bottom::after {
  content: ' ';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -100%);
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent #060607 transparent;
}

.tui-tooltip__left {
  left: 0;
  top: 50%;
  transform: translate(-100%, -50%);
  margin-left: -10px;
}

.tui-tooltip__left::after {
  content: ' ';
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translate(0, -50%);
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent transparent #060607;
}

.tui-tooltip__right {
  left: 100%;
  top: 50%;
  transform: translate(0, -50%);
  margin-left: 10px;
}

.tui-tooltip__right::after {
  content: ' ';
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(-100%, -50%);
  border-width: 5px;
  border-style: solid;
  border-color: transparent #060607 transparent transparent;
}
</style>
