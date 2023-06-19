<template>
  <view
    class="tui-table__row"
    :class="{ 'tui-flex-wrap': flexWrap, 'tui-table__fixed': fixed }"
    :style="{
      backgroundColor: backgroundColor,
      borderBottom: `${borderWidth} solid ${borderColor}`,
      borderLeft: borderLeft ? `${borderWidth} solid ${borderColor}` : '0',
      borderTop: borderTop ? `${borderWidth} solid ${borderColor}` : '0',
      left: fixed ? left : 'auto',
      right: fixed ? right : 'auto',
      top: fixed ? top : 'auto',
      marginTop: marginTop
    }"
    @tap="handleClick"
  >
    <slot></slot>
  </view>
</template>

<script>
//table tr
export default {
  name: 'tuiTr',
  emits: ['click'],
  options: {
    // 在微信小程序中将组件节点渲染为虚拟节点，更加接近Vue组件的表现
    virtualHost: true
  },
  props: {
    backgroundColor: {
      type: String,
      default: '#fff'
    },
    //border-bottom width
    borderWidth: {
      type: String,
      default: '1rpx'
    },
    //border-bottom color
    borderColor: {
      type: String,
      default: '#EAEEF5'
    },
    borderLeft: {
      type: Boolean,
      default: false
    },
    borderTop: {
      type: Boolean,
      default: false
    },
    flexWrap: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: false
    },
    left: {
      type: String,
      default: '0'
    },
    right: {
      type: String,
      default: '0'
    },
    top: {
      type: String,
      // #ifdef H5
      default: '44px',
      // #endif
      // #ifndef H5
      default: '0'
      // #endif
    },
    marginTop: {
      type: String,
      default: '0'
    },
    //行数索引
    index: {
      type: Number,
      default: 0
    },
    //参数
    params: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  methods: {
    handleClick() {
      this.$emit('click', {
        index: this.index,
        params: this.params
      });
    }
  }
};
</script>

<style scoped>
.tui-table__row {
  width: 100%;
  display: flex;
  box-sizing: border-box;
}

.tui-flex-wrap {
  flex-wrap: wrap;
}

.tui-table__fixed {
  position: fixed;
  z-index: 99;
}
</style>
