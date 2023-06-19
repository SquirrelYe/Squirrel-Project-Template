<template>
  <view class="tui-charts__funnel-wrap" :class="{ 'tui-charts__funnel-vertical': legend.direction !== 'vertical' }">
    <view class="tui-funnel__legend" :class="{ 'tui-legend__flex-column': legend.direction === 'vertical' }" v-if="legend.show">
      <view class="tui-funnel__legend-item" :style="{ marginLeft: legend.direction === 'vertical' ? '0' : '24rpx' }" v-for="(item, index) in dataset" :key="index">
        <view class="tui-legend__circle" :style="{ backgroundColor: item.color }"></view>
        <text :style="{ fontSize: (legend.size || 24) + 'rpx', lineHeight: (legend.size || 24) + 'rpx', color: legend.color || '#333' }">{{ item.name }}</text>
      </view>
    </view>
    <view class="tui-charts-funnel" :style="{ width: w + 'px', height: h + 'px' }">
      <view
        class="tui-charts__funnel-item"
        :class="['tui-funnel__' + sort]"
        :style="{
          width: item.width + 'px',
          height: itemHeight + 'px',
          borderTopWidth: sort === 'desc' ? itemHeight + 'px' : 0,
          borderTopColor: sort === 'desc' ? item.color : 'transparent',
          borderBottomWidth: sort === 'asc' ? itemHeight + 'px' : 0,
          borderBottomColor: sort === 'asc' ? item.color : 'transparent',
          borderLeftWidth: item.diff + 'px',
          borderRightWidth: item.diff + 'px'
        }"
        v-for="(item, index) in dataset"
        :key="index"
        @tap.stop="itemClick(index)"
      ></view>

      <view class="tui-funnel__tooltip" v-if="tooltip" :class="{ 'tui-funnel__tooltip-show': tooltipShow }">
        <view class="tui-tooltip__title" v-if="title">{{ title }}</view>
        <view class="tui-funnel__tooltip-item" :style="{ paddingTop: title ? '24rpx' : '0' }">
          <view class="tui-legend__circle" :style="{ backgroundColor: dataset[activeIndex] && dataset[activeIndex].color }"></view>
          <text class="tui-tooltip__val">{{ dataset[activeIndex] && dataset[activeIndex].name }}</text>
          <text class="tui-tooltip__val tui-tooltip__val-ml">{{ dataset[activeIndex] && dataset[activeIndex].value }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
function ascSort(a, b) {
  return a.value - b.value;
}

function descSort(a, b) {
  return b.value - a.value;
}
export default {
  name: 'tui-charts-funnel',
  emits: ['click'],
  props: {
    //统计名称
    title: {
      type: String,
      default: ''
    },
    //总宽度 rpx
    width: {
      type: [Number, String],
      default: 400
    },
    height: {
      type: [Number, String],
      default: 480
    },
    //间距 rpx
    gap: {
      type: [Number, String],
      default: 4
    },
    //图例，说明
    legend: {
      type: Object,
      default() {
        return {
          show: true,
          size: 24,
          color: '#333',
          //horizontal、vertical
          direction: 'horizontal'
        };
      }
    },
    tooltip: {
      type: Boolean,
      default: true
    },
    //asc，desc
    sort: {
      type: String,
      default: 'desc'
    }
  },
  data() {
    return {
      tooltips: [],
      tooltipShow: false,
      timer: null,
      activeIndex: -1,
      dataset: [],
      itemHeight: 60,
      w: 200,
      h: 240
    };
  },
  // #ifndef VUE3
  beforeDestroy() {
    this.clearTimer();
  },
  // #endif
  // #ifdef VUE3
  beforeUnmount() {
    this.clearTimer();
  },
  // #endif
  methods: {
    getPx(rpx) {
      let px = parseInt(uni.upx2px(Number(rpx)));
      return px % 2 === 0 ? px : px - 1;
    },
    getEvenNum(px) {
      px = parseInt(px);
      return px % 2 === 0 ? px : px - 1;
    },
    draw(data) {
      let dataList = JSON.parse(JSON.stringify(data));
      let dataset = dataList.sort(descSort);
      let w = this.getPx(this.width || 400);
      let h = this.getPx(this.height || 480);
      this.w = w;
      this.h = h;
      let len = dataset.length;
      let gap = Number(this.gap) * (len - 1);
      let max = Number(dataset[0].value);
      this.itemHeight = (h - this.getPx(gap)) / len;
      dataset.map((item, index) => {
        let width = index === 0 ? w : this.getEvenNum((Number(item.value) / max) * w);
        if (dataset[index + 1]) {
          let w1 = this.getEvenNum((Number(dataset[index + 1].value) / max) * w);
          item.diff = Math.abs(width - w1) / 2;
        } else {
          item.diff = width / 2;
        }
        item.width = width - (item.diff || 0) * 2;
      });
      if (this.sort === 'asc') {
        this.dataset = dataset.sort(ascSort);
      } else {
        this.dataset = dataset;
      }
    },
    clearTimer() {
      clearTimeout(this.timer);
      this.timer = null;
    },
    itemClick(index) {
      this.activeIndex = index;
      this.clearTimer();
      this.tooltipShow = true;
      this.timer = setTimeout(() => {
        this.tooltipShow = false;
      }, 5000);
      this.$emit('click', {
        index: index,
        ...this.dataset[index]
      });
    }
  }
};
</script>

<style scoped>
.tui-charts__funnel-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tui-charts__funnel-vertical {
  flex-direction: column;
}

.tui-funnel__legend {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.tui-legend__flex-column {
  flex-direction: column;
  align-items: flex-start;
  margin-right: 40rpx;
}

.tui-funnel__legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 32rpx;
}

.tui-legend__circle {
  height: 20rpx;
  width: 20rpx;
  border-radius: 50%;
  margin-right: 8rpx;
  flex-shrink: 0;
}

.tui-charts-funnel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.tui-charts__funnel-item {
  border-left-style: solid;
  border-left-color: transparent;
  border-right-style: solid;
  border-right-color: transparent;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
  position: relative;
}

.tui-funnel__asc {
  border-bottom-style: solid;
}

.tui-funnel__desc {
  border-top-style: solid;
}

.tui-funnel__tooltip {
  padding: 30rpx;
  border-radius: 12rpx;
  background-color: rgba(0, 0, 0, 0.6);
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;
}

.tui-funnel__tooltip-show {
  visibility: visible;
  opacity: 1;
}

.tui-tooltip__title {
  font-size: 30rpx;
  color: #fff;
  line-height: 30rpx;
  flex-shrink: 0;
}

.tui-funnel__tooltip-item {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.tui-tooltip__val {
  font-size: 24rpx;
  line-height: 24rpx;
  color: #fff;
  margin-left: 6rpx;
  white-space: nowrap;
}

.tui-tooltip__val-ml {
  margin-left: 20rpx;
}
</style>
