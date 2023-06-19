<template>
  <view
    class="tui-overflow__text"
    :class="[type == 1 ? 'tui-overflow__hidden' : '', type == 2 && !removeGradient ? 'tui-gradient__hidden' : '', lineClamp == 1 && type == 1 ? 'tui-text__nowrap' : '']"
    :style="{
      width: width,
      height: type == 1 ? 'auto' : removeGradient ? 'auto' : height,
      padding: type == 2 ? padding : '0',
      background: backgroundColor,
      fontSize: size + 'rpx',
      color: color,
      fontWeight: bold ? 'bold' : 'normal',
      '-webkit-line-clamp': type == 1 ? lineClamp : 'none',
      textOverflow: textOverflow
    }"
    @tap="handleClick"
  >
    <slot></slot>
    <view class="tui-gradient__box" :style="{ background: getBgColor }" v-if="type == 2 && !removeGradient"></view>
  </view>
</template>

<script>
export default {
  name: 'tui-overflow-hidden',
  emits: ['click'],
  props: {
    //内容区域宽度
    width: {
      type: String,
      default: '100%'
    },
    //内容区域高度，type=2时生效且需要传入具体值，高度值要低于实际内容高度
    height: {
      type: String,
      default: 'auto'
    },
    //padding值，type=2时生效
    padding: {
      type: String,
      default: '0'
    },
    //内容区域背景色
    backgroundColor: {
      type: String,
      default: 'transparent'
    },
    //文本字体大小 rpx
    size: {
      type: [Number, String],
      default: 32
    },
    //文本字体颜色
    color: {
      type: String,
      default: '#333'
    },
    //文本内容是否加粗
    bold: {
      type: Boolean,
      default: false
    },
    //隐藏类型：1-文本超出设定行数隐藏，2-渐变隐藏
    type: {
      type: [Number, String],
      default: 1
    },
    //超出多少行开始隐藏，type=1时生效
    lineClamp: {
      type: [Number, String],
      default: 2
    },
    //clip|ellipsis|string,参考CSS text-overflow 属性
    textOverflow: {
      type: String,
      default: 'ellipsis'
    },
    //渐变隐藏遮罩背景色,与页面或内容区域背景色保持一致
    gradientColor: {
      type: String,
      default: '#fff'
    },
    //移除渐变隐藏，显示全部内容，type=2时生效
    removeGradient: {
      type: Boolean,
      default: false
    },
    //索引值
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {
    getBgColor() {
      return `-webkit-linear-gradient(top, rgba(255,255,255,0), ${this.gradientColor})`;
    }
  },
  methods: {
    handleClick(e) {
      this.$emit('click', {
        index: this.index
      });
    }
  }
};
</script>

<style scoped>
.tui-overflow__text {
  position: relative;
  box-sizing: border-box;
  flex-shrink: 0;
}

.tui-overflow__hidden {
  display: -webkit-box;
  overflow: hidden;
  word-break: break-all;
  white-space: normal;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tui-gradient__hidden {
  display: block;
  overflow: hidden;
  word-break: break-all;
}

.tui-text__nowrap {
  display: inline-block !important;
  word-break: normal !important;
  white-space: nowrap !important;
}

.tui-gradient__box {
  width: 100%;
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
