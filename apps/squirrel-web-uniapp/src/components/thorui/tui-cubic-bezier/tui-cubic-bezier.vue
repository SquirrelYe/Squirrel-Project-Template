<template>
  <view class="tui-cubic__bezier" :class="{ 'tui-animate__bezier': animate }" :style="{ left: left, top: top, transform: transform_x }" @tap.stop="handleClick">
    <view class="tui-badge__bezier" :class="{ 'tui-animate__bezier_y': animate }" :style="{ width: width, height: height, borderRadius: height, backgroundColor: getBgColor, transform: transform_y }">
      <text v-if="!custom">1</text>
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'tuiCubicBezier',
  emits: ['click'],
  props: {
    //屏幕宽度[总宽度] px
    windowWidth: {
      type: Number,
      default: 375
    },
    //屏幕高度[总高度] px
    windowHeight: {
      type: Number,
      default: 667
    },
    //badge宽度
    width: {
      type: String,
      default: '40rpx'
    },
    //badge高度
    height: {
      type: String,
      default: '40rpx'
    },
    //动画badge背景颜色
    backgroundColor: {
      type: String,
      default: ''
    },
    //badge left
    left: {
      type: String,
      default: '0'
    },
    //badge top
    top: {
      type: String,
      default: '0'
    },
    //是否自定义动画显示内容
    custom: {
      type: Boolean,
      default: false
    },
    //动画方向: up-右上(top，right)，down-右下(right,bottom), bottom-左下(left,bottom)，top-左上(left,top)
    //括号中为position必传值
    direction: {
      type: String,
      default: 'down'
    },
    //根据方向传值，终点的坐标点，一般为元素中心位置
    position: {
      type: Object,
      default() {
        return {
          top: 50,
          bottom: 80,
          left: 30,
          right: 40
        };
      }
    },
    //列表中索引 index
    index: {
      type: Number,
      default: 0
    },
    //自定义参数
    params: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    getBgColor() {
      return this.backgroundColor || (uni && uni.$tui && uni.$tui.color.danger) || '#EB0909';
    }
  },
  data() {
    return {
      time: 0,
      animate: false,
      transform_x: '',
      transform_y: '',
      sys: null
    };
  },
  methods: {
    handleClick(e) {
      //550ms内防止重复点击
      if (new Date().getTime() - this.time <= 550) return;
      this.time = new Date().getTime();
      setTimeout(() => {
        this.time = 0;
      }, 550);
      this.bezierEffect(e);
      this.$emit('click', {
        index: this.index,
        params: this.params
      });
    },
    bezierEffect(e) {
      let touch = null;
      // #ifdef MP-ALIPAY
      touch = e.detail;
      // #endif

      // #ifdef MP-BAIDU
      touch = e.changedTouches[0];
      // #endif

      // #ifndef MP-ALIPAY || MP-BAIDU
      touch = e.touches[0];
      // #endif
      let diff = {
        x: 0,
        y: 0
      };
      //up-右上，down-右下, bottom-左下，top-左上
      switch (this.direction) {
        case 'up':
          diff.x = this.windowWidth - touch.clientX - this.position.right;
          diff.y = this.position.top - touch.clientY;
          break;
        case 'down':
          diff.x = this.windowWidth - touch.clientX - this.position.right;
          diff.y = this.windowHeight - touch.clientY - this.position.bottom;
          break;
        case 'bottom':
          diff.x = this.position.left - touch.clientX;
          diff.y = this.windowHeight - touch.clientY - this.position.bottom;
          break;
        case 'top':
          diff.x = this.position.left - touch.clientX;
          diff.y = this.position.top - touch.clientY;
          break;
        default:
          break;
      }

      //移动距离
      this.animate = true;
      this.transform_x = `translate3d(${diff.x}px,0,0)`;
      this.transform_y = `translate3d(0,${diff.y}px,0) rotate(350deg) scale(0.8)`;
      setTimeout(() => {
        this.animate = false;
        //恢复到最初状态
        this.transform_x = 'none';
        this.transform_y = 'none';
      }, 550);
    }
  }
};
</script>

<style scoped>
.tui-cubic__bezier {
  position: absolute;
  opacity: 0;
  z-index: 20;
}

.tui-animate__bezier {
  opacity: 1;
  z-index: 990;
  transition: opacity 0.1s, transform cubic-bezier(0, 0, 0, 0) 0.5s;
}

.tui-animate__bezier_y {
  opacity: 1;
  z-index: 990;
  transition: opacity 0.1s, transform cubic-bezier(0.3, -0.2, 1, 0) 0.5s;
}

.tui-badge__bezier {
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
}
</style>
