<template>
  <!--需要固定宽高滚动在页面层使用scroll-view即可-->
  <view
    class="tui-table__box"
    :style="{
      borderTop: borderTop ? `${borderWidth} solid ${borderColor}` : '0',
      borderLeft: borderLeft ? `${borderWidth} solid ${borderColor}` : '0',
      borderBottom: borderBottom ? `${borderWidth} solid ${borderColor}` : '0',
      borderRight: borderRight ? `${borderWidth} solid ${borderColor}` : '0'
    }"
  >
    <slot></slot>
  </view>
</template>

<script>
//字体/背景等配置
export default {
  name: 'tuiTable',
  props: {
    //border width 不需要border传0即可
    borderWidth: {
      type: String,
      default: '1rpx'
    },
    //border color
    borderColor: {
      type: String,
      default: '#EAEEF5'
    },
    //是否需要上边框
    borderTop: {
      type: Boolean,
      default: true
    },
    //是否需要左边框
    borderLeft: {
      type: Boolean,
      default: true
    },
    //是否需要下边框
    borderBottom: {
      type: Boolean,
      default: false
    },
    //是否需要右边框
    borderRight: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      width: 320
    };
  },
  methods: {}
};
</script>

<style scoped>
.tui-table__box {
  font-size: 0;
  box-sizing: border-box;
}
</style>
