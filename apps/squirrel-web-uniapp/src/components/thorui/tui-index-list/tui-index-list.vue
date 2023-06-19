<template>
  <view class="tui-index-list">
    <scroll-view class="tui-scroll__view" :style="{ height: getHeight }" scroll-y :scroll-top="scrollTop" @scroll="scroll">
      <slot name="header"></slot>
      <view class="tui-content__box">
        <view class="tui-item__select" v-for="(item, index) in listData" :key="index">
          <view v-if="index == listItemCur" class="tui-content__title" :class="{ 'tui-line__top': topLine, 'tui-line__bottom': bottomLine }">
            <view class="tui-title__item" :style="{ background: background_cur, color: color_cur, fontSize: size, height: height, padding: padding }">
              {{ item.letter }}
            </view>
          </view>
          <view v-else-if="index == listItemCur + 1" class="tui-content__title" :class="{ 'tui-line__top': topLine, 'tui-line__bottom': bottomLine }">
            <view class="tui-title__item" :style="{ background: background_next, color: color_next, fontSize: size, height: height, padding: padding }">
              {{ item.letter }}
            </view>
          </view>
          <view v-else class="tui-content__title" :class="{ 'tui-line__top': topLine, 'tui-line__bottom': bottomLine }">
            <view class="tui-title__item" :style="{ background: background, color: color, fontSize: size, height: height, padding: padding }">
              {{ item.letter }}
            </view>
          </view>
          <slot name="item" :entity="item.data" :index="index"></slot>
        </view>
      </view>
      <slot name="footer"></slot>
    </scroll-view>
    <view class="tui-index__indicator" :class="[touching && indicatorTop != -1 ? 'tui-indicator__show' : '', treeKeyTran ? 'tui-indicator__tran' : '']" :style="{ top: indicatorTop + 'px' }">
      {{ listData[treeItemCur] && listData[treeItemCur].letter }}
    </view>
    <view id="tui_index__letter" class="tui-index__letter" @touchstart.stop="touchStart" @touchmove.stop.prevent="touchMove" @touchend.stop="touchEnd" @touchcancel.stop="touchEnd">
      <view class="tui-letter__item" :class="[index === treeItemCur ? 'tui-letter__cur' : '']" v-for="(item, index) in listData" :key="index" @tap="letterClick(index, item.letter)">
        <view class="tui-letter__key" :style="{ background: index === treeItemCur ? getActiveKeyBgColor : '', color: index === treeItemCur ? activeKeyColor : keyColor }">
          {{ item.letter }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
let ColorUtil = {
  rgbToHex(r, g, b) {
    let hex = ((r << 16) | (g << 8) | b).toString(16);
    return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex;
  },
  hexToRgb(hex) {
    let rgb = [];
    if (hex.length === 4) {
      let text = hex.substring(1, 4);
      hex = '#' + text + text;
    }
    for (let i = 1; i < 7; i += 2) {
      rgb.push(parseInt('0x' + hex.slice(i, i + 2)));
    }
    return rgb;
  },
  /**
   * 生成渐变过渡色数组 {startColor: 开始颜色值, endColor: 结束颜色值, step: 生成色值数组长度}
   */
  gradient(startColor, endColor, step) {
    // 将hex转换为rgb
    let sColor = this.hexToRgb(startColor),
      eColor = this.hexToRgb(endColor);

    // 计算R\G\B每一步的差值
    let rStep = (eColor[0] - sColor[0]) / step,
      gStep = (eColor[1] - sColor[1]) / step,
      bStep = (eColor[2] - sColor[2]) / step;

    let gradientColorArr = [];
    for (let i = 0; i < step; i++) {
      // 计算每一步的hex值
      gradientColorArr.push(this.rgbToHex(parseInt(rStep * i + sColor[0]), parseInt(gStep * i + sColor[1]), parseInt(bStep * i + sColor[2])));
    }
    return gradientColorArr;
  },
  /**
   * 生成随机颜色值
   */
  generateColor() {
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += ((Math.random() * 16) | 0).toString(16);
    }
    return color;
  }
};
export default {
  name: 'tuiIndexList',
  emits: ['letterClick'],
  props: {
    // 数据源
    listData: {
      type: Array,
      default() {
        return [];
      }
    },
    // 顶部高度
    top: {
      type: Number,
      default: 0
    },
    // 底部高度
    bottom: {
      type: Number,
      default: 0
    },
    //top和bottom单位，可传rpx 或 px
    unit: {
      type: String,
      default: 'px'
    },
    //sticky letter 是否显示上边线条
    topLine: {
      type: Boolean,
      default: true
    },
    //sticky letter 是否显示下边线条
    bottomLine: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      default: '60rpx'
    },
    color: {
      type: String,
      default: '#666'
    },
    activeColor: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: '26rpx'
    },
    background: {
      type: String,
      default: '#ededed'
    },
    activeBackground: {
      type: String,
      default: '#FFFFFF'
    },
    padding: {
      type: String,
      default: '0 20rpx'
    },
    keyColor: {
      type: String,
      default: '#666'
    },
    activeKeyColor: {
      type: String,
      default: '#FFFFFF'
    },
    activeKeyBackground: {
      type: String,
      default: ''
    },
    //重新初始化[可异步加载时使用,设置大于0的数]
    reinit: {
      type: Number,
      default: 0
    }
  },
  computed: {
    getHeight() {
      return `calc(100vh - ${this.top + this.bottom + this.unit})`;
    },
    getChange() {
      return `${this.top}-${this.bottom}-${this.reinit}`;
    },
    getActiveColor() {
      return this.activeColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    },
    getActiveKeyBgColor() {
      return this.activeKeyBackground || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    }
  },
  watch: {
    listData(val) {
      this.init();
    },
    getChange(val) {
      this.init();
    }
  },
  data() {
    return {
      remScale: 1, // 缩放比例
      realTop: 0, // 计算后顶部高度实际值
      realBottom: 0, // 计算后底部高度实际值
      treeInfo: {
        // 索引树节点信息
        treeTop: 0,
        treeBottom: 0,
        itemHeight: 0,
        itemMount: 0
      },
      indicatorTopList: [], // 指示器节点信息列表
      maxScrollTop: 0, // 最大滚动高度
      blocks: [], // 节点组信息

      /* 渲染数据 */
      treeItemCur: -1, // 索引树的聚焦项
      listItemCur: -1, // 节点树的聚焦项
      touching: false, // 是否在触摸索引树中
      scrollTop: 0, // 节点树滚动高度
      indicatorTop: -1, // 指示器顶部距离
      treeKeyTran: false,
      background_cur: '',
      color_cur: '',
      background_next: '',
      color_next: '',
      colors: [],
      backgroundColors: []
    };
  },
  methods: {
    scroll(e) {
      if (this.touching) return;

      let scrollTop = e.detail.scrollTop;
      if (scrollTop > this.maxScrollTop) return;

      let blocks = this.blocks,
        stickyTitleHeight = this.remScale * 30;
      let len = blocks.length - 1;
      this.background_cur = this.background;
      this.color_cur = this.color;
      for (let i = len; i >= 0; i--) {
        let block = blocks[i];
        // 判断当前滚动值 scrollTop 所在区间, 以得到当前聚焦项
        if (scrollTop >= block.itemTop && scrollTop < block.itemBottom) {
          // 判断当前滚动值 scrollTop 是否在当前聚焦项底一个 .block__title 高度范围内, 如果是则开启过度色值计算
          if (scrollTop > block.itemBottom - stickyTitleHeight) {
            let percent = Math.floor(((scrollTop - (block.itemBottom - stickyTitleHeight)) / stickyTitleHeight) * 100);
            this.background_cur = this.backgroundColors[percent];
            this.color_cur = this.colors[percent];
            this.background_next = this.backgroundColors[100 - percent];
            this.color_next = this.colors[100 - percent];
            this.treeItemCur = i;
            this.listItemCur = i;
          } else if (scrollTop <= block.itemBottom - stickyTitleHeight) {
            this.background_cur = this.activeBackground;
            this.color_cur = this.getActiveColor;
            this.background_next = this.background;
            this.color_next = this.color;
            this.treeItemCur = i;
            this.listItemCur = i;
          }
          break;
        }
      }
    },
    /**
     * tree 触摸开始
     */
    touchStart(e) {
      // 获取触摸点信息
      let startTouch = e.changedTouches[0];
      if (!startTouch) return;
      this.touching = true;
      let treeItemCur = this.getCurrentTreeItem(startTouch.pageY);
      this.setValue(treeItemCur);
    },
    /**
     * tree 触摸移动
     */
    touchMove(e) {
      // 获取触摸点信息
      let currentTouch = e.changedTouches[0];
      if (!currentTouch) return;

      // 滑动结束后迅速开始第二次滑动时候 touching 为 false 造成不显示 indicator 问题
      if (!this.touching) {
        this.touching = true;
      }

      let treeItemCur = this.getCurrentTreeItem(currentTouch.pageY);
      this.setValue(treeItemCur);
    },
    /**
     * tree 触摸结束
     */
    touchEnd(e) {
      let treeItemCur = this.treeItemCur;
      let listItemCur = this.listItemCur;
      if (treeItemCur !== listItemCur) {
        this.treeItemCur = listItemCur;
        this.indicatorTop = this.indicatorTopList[treeItemCur];
      }
      this.treeKeyTran = true;
      setTimeout(() => {
        this.touching = false;
        this.treeKeyTran = false;
      }, 300);
    },
    letterClick(index, letter) {
      // #ifdef H5
      this.setValue(index);
      this.touchEnd();
      // #endif
      this.$emit('letterClick', {
        index: index,
        letter: letter
      });
    },
    /**
     * 获取当前触摸的 tree-item
     * @param pageY: 当前触摸点pageY
     */
    getCurrentTreeItem(pageY) {
      let { treeTop, treeBottom, itemHeight, itemMount } = this.treeInfo;

      if (pageY < treeTop) {
        return 0;
      } else if (pageY >= treeBottom) {
        return itemMount - 1;
      } else {
        return Math.floor((pageY - treeTop) / itemHeight);
      }
    },
    /**
     * 触摸之后后设置对应value
     */
    setValue(treeItemCur) {
      if (treeItemCur === this.treeItemCur) return;

      let block = this.blocks[treeItemCur];
      if (!block) return;

      let { scrollTop, scrollIndex } = block,
        indicatorTop = this.indicatorTopList[treeItemCur];

      this.background_cur = this.activeBackground;
      this.color_cur = this.getActiveColor;
      this.background_next = this.background;
      this.color_next = this.color;
      this.treeItemCur = treeItemCur;
      this.scrollTop = scrollTop;
      this.listItemCur = scrollIndex;
      this.indicatorTop = indicatorTop;
    },
    /**
     * 清除参数
     */
    clearData() {
      this.treeItemCur = 0; // 索引树的聚焦项
      this.listItemCur = 0; // 节点树的聚焦项
      this.touching = false; // 是否在触摸索引树中
      this.scrollTop = 0; // 节点树滚动高度
      this.indicatorTop = -1; // 指示器顶部距离
      this.treeKeyTran = false;
      this.background_cur = this.background;
      this.color_cur = this.color;
      this.background_next = this.background;
      this.color_next = this.color;
    },
    /**
     *  初始化获取 dom 信息
     */
    initDom() {
      let { windowHeight, windowWidth } = uni.getSystemInfoSync();
      let remScale = (windowWidth || 375) / 375,
        realTop = (this.top * remScale) / 2,
        realBottom = (this.bottom * remScale) / 2,
        colors = ColorUtil.gradient(this.getActiveColor, this.color, 100),
        backgroundColors = ColorUtil.gradient(this.activeBackground, this.background, 100);

      this.remScale = remScale;
      this.realTop = realTop;
      this.realBottom = realBottom;
      this.colors = colors;
      this.backgroundColors = backgroundColors;

      uni
        .createSelectorQuery()
        .in(this)
        .select('#tui_index__letter')
        .boundingClientRect(res => {
          let treeTop = res.top,
            treeBottom = res.top + res.height,
            itemHeight = res.height / this.listData.length,
            itemMount = this.listData.length;

          let indicatorTopList = this.listData.map((item, index) => {
            return itemHeight / 2 + index * itemHeight + treeTop - remScale * 25;
          });
          this.treeInfo = {
            treeTop: treeTop,
            treeBottom: treeBottom,
            itemHeight: itemHeight,
            itemMount: itemMount
          };
          this.indicatorTopList = indicatorTopList;
        })
        .exec();

      uni
        .createSelectorQuery()
        .in(this)
        .select('.tui-content__box')
        .boundingClientRect(res => {
          let maxScrollTop = res.height - (windowHeight - realTop - realBottom);

          uni
            .createSelectorQuery()
            .in(this)
            .selectAll('.tui-item__select')
            .boundingClientRect(res => {
              let maxScrollIndex = -1;

              let blocks = res.map((item, index) => {
                // Math.ceil 向上取整, 防止索引树切换列表时候造成真机固定头部上边线显示过粗问题
                let itemTop = Math.ceil(item.top - realTop),
                  itemBottom = Math.ceil(itemTop + item.height);

                if (maxScrollTop >= itemTop && maxScrollTop < itemBottom) maxScrollIndex = index;

                return {
                  itemTop: itemTop,
                  itemBottom: itemBottom,
                  scrollTop: itemTop >= maxScrollTop ? maxScrollTop : itemTop,
                  scrollIndex: maxScrollIndex === -1 ? index : maxScrollIndex
                };
              });

              this.maxScrollTop = maxScrollTop;
              this.blocks = blocks;
            })
            .exec();
        })
        .exec();
    },
    /**
     *  初始化
     */
    init() {
      this.clearData();
      // 避免获取不到节点信息报错问题
      if (this.listData.length === 0) {
        return;
      }
      // 异步加载数据时候, 延迟执行 initDom 方法
      setTimeout(() => this.initDom(), 1200);
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped>
.tui-index-list {
  width: 100vw;
  overflow: hidden;
  position: relative;
}

.tui-scroll__view {
  width: 100vw;
}

.tui-content__box {
  position: relative;
  width: 100%;
}

.tui-content__title {
  position: sticky;
  top: 0;
  z-index: 10;
  font-weight: bold;
}

.tui-content__title .tui-title__item {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
}

.tui-line__top::before {
  content: ' ';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  border-top: 1px solid #ebedf0;
  -webkit-transform: scaleY(0.5) translateZ(0);
  transform: scaleY(0.5) translateZ(0);
  transform-origin: 0 0;
  z-index: 2;
  pointer-events: none;
}

.tui-line__bottom::after {
  content: ' ';
  position: absolute;
  border-bottom: 1px solid #ebedf0;
  -webkit-transform: scaleY(0.5) translateZ(0);
  transform: scaleY(0.5) translateZ(0);
  transform-origin: 0 100%;
  bottom: 0;
  right: 0;
  left: 0;
}

.tui-index__indicator {
  position: fixed;
  right: 100rpx;
  width: 100rpx;
  height: 100rpx;
  line-height: 100rpx;
  border-radius: 10rpx;
  text-align: center;
  color: #ffffff;
  font-size: 60rpx;
  font-weight: bold;
  display: none;
  z-index: 10;
}

.tui-index__indicator:after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  border-radius: 100% 0% 100% 100%;
  background: #c9c9c9;
  transform: rotate(45deg);
}

.tui-indicator__show {
  display: block;
  z-index: 10;
}

.tui-indicator__tran {
  display: block;
  opacity: 0;
  transition: opacity 0.3s linear;
}

.tui-index__letter {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  z-index: 10;
}

.tui-letter__item {
  padding: 0 8rpx;
  font-weight: bold;
}

.tui-letter__key {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  font-size: 26rpx;
  transform: scale(0.8);
  transform-origin: center center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tui-list__item {
  width: 100%;
  display: flex;
  align-items: center;
}

.tui-list__item .tui-avatar {
  width: 68rpx;
  height: 68rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
  background-color: #ccc;
}

.tui-list__item view {
  width: 90%;
  font-size: 32rpx;
  padding-left: 20rpx;
  padding-right: 40rpx;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
