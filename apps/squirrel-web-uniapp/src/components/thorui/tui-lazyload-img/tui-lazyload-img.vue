<template>
  <view class="tui-lazyload__box" :style="{ backgroundColor: placeholder ? 'transparent' : backgroundColor, width: width, height: height ? height : 'auto', borderRadius: radius }" @tap="handleClick">
    <image
      class="tui-lazyload__img"
      :class="{ 'tui-img__hidden': !placeholder && fadeShow && !show, 'tui-img__appear': show && !placeholder && fadeShow }"
      :style="{ height: height, borderRadius: radius }"
      :src="show ? src : placeholder"
      :mode="height && height !== true ? mode : 'widthFix'"
      :webp="webp"
      :show-menu-by-longpress="showMenuByLongpress"
      :draggable="draggable"
      @load="load"
      @error="error"
      :id="elId"
    >
    </image>
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'tui-lazyload-img',
  emits: ['error', 'load', 'click'],
  options: {
    virtualHost: true
  },
  props: {
    //图片路径
    src: {
      type: String,
      default: ''
    },
    //占位图路径
    placeholder: {
      type: String,
      default: ''
    },
    //占位背景色，placeholder有值时失效
    backgroundColor: {
      type: String,
      default: '#E7E7E7'
    },
    //图片的裁剪模式，参考image组件mode属性
    mode: {
      type: String,
      default: 'widthFix'
    },
    //图片显示动画效果,无占位图时有效
    fadeShow: {
      type: Boolean,
      default: true
    },
    //默认不解析 webP 格式，只支持网络资源 微信小程序2.9.0
    webp: {
      type: Boolean,
      default: false
    },
    //开启长按图片显示识别小程序码菜单 微信小程序2.7.0
    showMenuByLongpress: {
      type: Boolean,
      default: false
    },
    //鼠标长按是否能拖动图片 仅H5平台 3.1.1+ 有效
    draggable: {
      type: Boolean,
      default: true
    },
    //图片宽度
    width: {
      type: String,
      default: '340rpx'
    },
    //图片高度，如果高度设置为auto，mode值需要设置为widthFix
    height: {
      type: String,
      default: '340rpx'
    },
    //图片圆角值，如：10rpx
    radius: {
      type: String,
      default: '0'
    },
    //节点布局区域的下边界,目标节点区域以下 bottom(px) 时，就会触发回调函数
    bottom: {
      type: [Number, String],
      default: 50
    },
    //是否停止监听，设置为true时回调函数将不再触发
    disconnect: {
      type: Boolean,
      default: false
    },
    //图片在列表中的索引值
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    let elId = this.unique() + this.index;
    return {
      show: false,
      elId: elId
    };
  },
  watch: {
    disconnect(val) {
      if (val) {
        this.removeObserver();
      }
    }
  },
  created() {
    this.observer = null;
    // this.elId = this.unique() + this.index;
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        // #ifndef H5
        if (!this.disconnect) {
          this.initObserver();
        } else {
          this.show = true;
        }
        // #endif

        // #ifdef H5
        if (!this.disconnect && window.self === window.top) {
          this.initObserver();
        } else {
          this.show = true;
        }
        // #endif
      }, 50);
    });
  },
  // #ifndef VUE3
  beforeDestroy() {
    this.removeObserver();
  },
  // #endif
  // #ifdef VUE3
  beforeUnmount() {
    this.removeObserver();
  },
  // #endif
  methods: {
    unique: function (n) {
      n = n || 6;
      let rnd = '';
      for (let i = 0; i < n; i++) rnd += Math.floor(Math.random() * 10);
      return 'tui_' + new Date().getTime() + rnd;
    },
    removeObserver() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    },
    initObserver() {
      if (this.observer || this.show) return;
      try {
        let element = this.elId ? `#${this.elId}` : '.tui-lazyload__img';
        const observer = uni.createIntersectionObserver(this);
        observer
          .relativeToViewport({
            bottom: Number(this.bottom) || 50
          })
          .observe(element, res => {
            if (res.intersectionRatio > 0 && !this.show) {
              this.show = true;
              this.removeObserver();
            }
          });
        this.observer = observer;
      } catch (e) {
        //TODO handle the exception
        this.show = true;
        this.removeObserver();
      }
    },
    error(e) {
      if (!this.show) return;
      this.$emit('error', {
        detail: e.detail,
        index: this.index
      });
    },
    load(e) {
      if (!this.show) return;
      this.$emit('load', {
        detail: e.detail,
        index: this.index
      });
    },
    handleClick(e) {
      this.$emit('click', {
        index: this.index
      });
    }
  }
};
</script>

<style scoped>
.tui-lazyload__box {
  display: inline-flex;
  position: relative;
  flex-shrink: 0;
}

.tui-lazyload__img {
  width: 100%;
  display: block;
  flex-shrink: 0;
  transition: opacity 0.3s linear;
}

.tui-img__hidden {
  opacity: 0;
  visibility: hidden;
}

.tui-img__appear {
  opacity: 1;
  visibility: visible;
}
</style>
