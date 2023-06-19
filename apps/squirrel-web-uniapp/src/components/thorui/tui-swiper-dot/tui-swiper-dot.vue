<template>
  <view v-if="type == 1 || type == 2" class="tui-swiper__dot" :style="{ left: left, bottom: bottom }">
    <view
      class="tui-dot__item"
      :class="{ 'tui-text__center': type == 2 }"
      :style="{
        width: index == current ? width : height,
        height: height,
        borderRadius: radius,
        backgroundColor: index == current ? getActiveBgColor : backgroundColor,
        margin: margin,
        color: current == index ? color : activeColor,
        fontSize: size + 'rpx'
      }"
      v-for="(item, index) in countArr"
      :key="index"
      >{{ type == 2 ? index + 1 : '' }}</view
    >
  </view>
  <view class="tui-swiper__dot" :style="{ width: type == 4 ? width : '100%', right: right, bottom: bottom }" v-else>
    <view class="tui-dot__item" :style="{ width: width, height: height, padding: padding, color: color, backgroundColor: backgroundColor, fontSize: size + 'rpx' }" v-if="type == 3"
      ><text class="tui-nav__ellipsis">{{ currentTitle }}</text></view
    >
    <view
      class="tui-dot__item tui-text__center"
      :style="{ width: width, height: height, borderRadius: radius, backgroundColor: backgroundColor, color: color, fontSize: size + 'rpx' }"
      v-if="type == 4"
      >{{ current + 1 }}/{{ count }}</view
    >
  </view>
</template>

<script>
export default {
  name: 'tuiSwiperDot',
  props: {
    //显示类型：1-dot 2-index 3-title 4-右侧停靠index
    type: {
      type: Number,
      default: 1
    },
    //总数
    count: {
      type: Number,
      default: 0
    },
    //当前索引
    current: {
      type: Number,
      default: 0
    },
    //当前标题
    currentTitle: {
      type: String,
      default: ''
    },
    //left值
    left: {
      type: String,
      default: '0'
    },
    right: {
      type: String,
      default: 'auto'
    },
    bottom: {
      type: String,
      default: '30rpx'
    },
    //指示点[type in (1,2)]或外层盒子[type in (3,4)]宽度
    width: {
      type: String,
      default: '16rpx'
    },
    //指示点[type in (1,2)]或外层盒子[type in (3,4)]高度
    height: {
      type: String,
      default: '16rpx'
    },
    //指示点圆角
    radius: {
      type: String,
      default: '50%'
    },
    //背景色
    backgroundColor: {
      type: String,
      default: '#bfbfbf'
    },
    //当前展示item背景色
    activeBgColor: {
      type: String,
      default: ''
    },
    //字体颜色
    color: {
      type: String,
      default: '#333'
    },
    //当前展示item字体颜色，type=2时生效
    activeColor: {
      type: String,
      default: '#fff'
    },
    //字体大小
    size: {
      type: Number,
      default: 28
    },
    //指示点margin值
    margin: {
      type: String,
      default: '0 8rpx'
    },
    //type=3时生效
    padding: {
      type: String,
      default: '0 30rpx'
    }
  },
  watch: {
    count(val) {
      this.countArr = this.generateArray(1, val);
    }
  },
  computed: {
    getActiveBgColor() {
      return this.activeBgColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    }
  },
  data() {
    return {
      //百度小程序循环数字有问题
      countArr: []
    };
  },
  created() {
    this.countArr = this.generateArray(1, this.count);
  },
  methods: {
    generateArray: function (start, end) {
      return Array.from(new Array(end + 1).keys()).slice(start);
    }
  }
};
</script>

<style scoped>
.tui-swiper__dot {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 2;
}

.tui-dot__item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.tui-nav__ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tui-text__center {
  justify-content: center;
}
</style>
