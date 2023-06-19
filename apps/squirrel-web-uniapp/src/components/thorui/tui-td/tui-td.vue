<template>
  <view
    class="tui-table__column"
    :class="[
      ellipsis ? 'tui-column__ellipsis' : 'tui-table__middle',
      'tui-table__' + alignItems,
      'tui-text__' + textAlign,
      flexGrow ? 'tui-flex-grow' : '',
      shrink ? '' : 'tui-td__shrink',
      top ? 'tui-td__upper' : '',
      hidden ? 'tui-td__hidden' : ''
    ]"
    :style="{
      width: getWidth(span, width),
      height: height,
      fontSize: size + 'rpx',
      color: color,
      fontWeight: bold ? 'bold' : 'normal',
      backgroundColor: backgroundColor,
      borderRight: borderRight ? `${borderWidth} solid ${borderColor}` : '0',
      borderBottom: borderBottom ? `${borderWidth} solid ${borderColor}` : '0',
      borderLeft: borderLeft ? `${borderWidth} solid ${borderColor}` : '0',
      padding: padding
    }"
    @tap="handleClick"
  >
    <slot></slot>
  </view>
</template>

<script>
//table td
export default {
  name: 'tuiTd',
  emits: ['click'],
  options: {
    // 在微信小程序中将组件节点渲染为虚拟节点，更加接近Vue组件的表现
    virtualHost: true
  },
  props: {
    //跨度
    span: {
      type: Number,
      default: 24
    },
    //具体值或者auto
    // #ifdef APP-PLUS || MP-WEIXIN || H5 || MP-ALIPAY
    width: {
      type: String,
      default: ''
    },
    // #endif
    // #ifndef APP-PLUS || MP-WEIXIN || H5 || MP-ALIPAY
    width: {
      type: String,
      default: '230rpx'
    },
    // #endif
    height: {
      type: String,
      default: 'auto'
    },
    size: {
      type: Number,
      default: 30
    },
    color: {
      type: String,
      default: '#333'
    },
    bold: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    },
    //border-right width
    borderWidth: {
      type: String,
      default: '1rpx'
    },
    //边框颜色
    borderColor: {
      type: String,
      default: '#EAEEF5'
    },
    //是否需要右边框
    borderRight: {
      type: Boolean,
      default: true
    },
    //是否需要下边框
    borderBottom: {
      type: Boolean,
      default: false
    },
    //是否需要左边框
    borderLeft: {
      type: Boolean,
      default: false
    },
    //文字超出隐藏
    ellipsis: {
      type: Boolean,
      default: false
    },
    padding: {
      type: String,
      default: '12rpx'
    },
    //排列：left,center,right
    alignItems: {
      type: String,
      default: 'left'
    },
    //文本对齐：left,center,right
    textAlign: {
      type: String,
      default: 'left'
    },
    //是否收缩
    shrink: {
      type: Boolean,
      default: true
    },
    //铺满剩余空间
    flexGrow: {
      type: Boolean,
      default: false
    },
    //顶部,上面;
    top: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    },
    //索引
    index: {
      type: Number,
      default: 0
    },
    //字段key
    keys: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  methods: {
    getWidth(span, width) {
      let w = width;
      if (!width) {
        w = [
          '4.16666667%',
          '8.33333333%',
          '12.5%',
          '16.66666667%',
          '20.83333333%',
          '25%',
          '29.16666667%',
          '33.33333333%',
          '37.5%',
          '41.66666667%',
          '45.83333333%',
          '50%',
          '54.16666667%',
          '58.33333333%',
          '62.5%',
          '66.66666667%',
          '70.83333333%',
          '75%',
          '79.16666667%',
          '83.33333333%',
          '87.5%',
          '91.66666667%',
          '95.83333333%',
          '100%'
        ][span - 1];
      }
      return w;
    },
    handleClick() {
      this.$emit('click', {
        index: this.index,
        key: this.keys
      });
    }
  }
};
</script>

<style>
/*栅格 24*/
.tui-table__column {
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  word-break: break-all;
}

.tui-td__shrink {
  flex-shrink: 0;
}

.tui-flex-grow {
  flex-grow: 1;
}

.tui-table__middle {
  display: inline-flex;
  align-items: center;
}

.tui-table__center {
  justify-content: center;
}

.tui-table__right {
  justify-content: flex-end;
}

.tui-text__center {
  text-align: center;
}

.tui-text__right {
  text-align: right;
}

.tui-column__ellipsis {
  overflow: hidden;
  white-space: nowrap !important;
  text-overflow: ellipsis;
}

.tui-td__upper {
  z-index: 10;
}

.tui-td__hidden {
  visibility: hidden;
}
</style>
