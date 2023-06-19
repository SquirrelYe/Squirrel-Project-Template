<template>
  <view class="tui-landscape__box">
    <view class="tui-landscape__inner" :style="{ zIndex: zIndex }" v-if="show">
      <slot></slot>
      <view
        class="tui-icon__close"
        :style="{
          top: position != 1 ? iconTop : 'auto',
          bottom: position == 1 ? iconBottom : 'auto',
          left: position == 3 ? iconLeft : position == 1 ? '50%' : 'auto',
          right: position == 2 ? iconRight : 'auto'
        }"
        :class="{ 'tui-icon__bottom': position == 1 }"
        v-if="closeIcon"
        @tap.stop="close"
      >
        <icon type="clear" :color="iconColor" :size="iconSize"></icon>
      </view>
    </view>
    <view :style="{ backgroundColor: maskBgColor, zIndex: maskZIndex }" @tap.stop="close(1)" class="tui-landscape__mask" :class="{ 'tui-mask_hidden': !show }" v-if="mask"></view>
  </view>
</template>

<script>
export default {
  name: 'tui-landscape',
  emits: ['close'],
  props: {
    //是否显示
    show: {
      type: Boolean,
      default: false
    },
    //显示内容区z-index
    zIndex: {
      type: Number,
      default: 1001
    },
    //是否需要关闭图标
    closeIcon: {
      type: Boolean,
      default: true
    },
    //关闭图标颜色
    iconColor: {
      type: String,
      default: '#fff'
    },
    //关闭图标大小 px
    iconSize: {
      type: Number,
      default: 25
    },
    //icon位置：1-底部 2-右上角 3-左上角
    position: {
      type: [Number, String],
      default: 1
    },
    //关闭图标top值，position为2或3的时候生效
    iconTop: {
      type: String,
      default: '-120rpx'
    },
    //关闭图标bottom值，position为1的时候生效
    iconBottom: {
      type: String,
      default: '-120rpx'
    },
    //关闭图标left值，position为3的时候生效
    iconLeft: {
      type: String,
      default: '0'
    },
    //关闭图标right值，position为2的时候生效
    iconRight: {
      type: String,
      default: '0'
    },
    //点击遮罩是否可以关闭
    maskClosable: {
      type: Boolean,
      default: true
    },
    //是否需要遮罩
    mask: {
      type: Boolean,
      default: true
    },
    //遮罩背景色
    maskBgColor: {
      type: String,
      default: 'rgba(0,0,0,.6)'
    },
    //遮罩z-index值
    maskZIndex: {
      type: Number,
      default: 1000
    },
    //自定义参数
    params: {
      type: [Number, String],
      default: 0
    }
  },
  methods: {
    close(isMask) {
      if (isMask == 1 && !this.maskClosable) return;
      this.$emit('close', {
        params: this.params
      });
    }
  }
};
</script>

<style scoped>
.tui-landscape__box {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.tui-landscape__inner {
  max-width: 100%;
  position: fixed;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.tui-icon__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: absolute;
  z-index: 10;
}

.tui-icon__bottom {
  left: 50% !important;
  transform: translateX(-50%);
}

.tui-landscape__mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  opacity: 1;
  transform: scale3d(1, 1, 1);
  transition: all 0.2s ease-in;
}

.tui-mask_hidden {
  opacity: 0 !important;
  transform: scale3d(1, 1, 0) !important;
}
</style>
