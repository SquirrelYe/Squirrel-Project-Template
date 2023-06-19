<template>
  <view class="tui-charts__scatter-wrap" :style="{ width: width + 'rpx' }">
    <view class="tui-scatter__legend" v-if="legend.show">
      <view class="tui-scatter__legend-item" v-for="(item, index) in dataset" :key="index">
        <view class="tui-legend__circle" :style="{ background: item.color }"></view>
        <text :style="{ fontSize: (legend.size || 24) + 'rpx', lineHeight: (legend.size || 24) + 'rpx', color: legend.color || '#333' }">{{ item.name }}</text>
      </view>
    </view>
    <view class="tui-charts__scatter-box" :style="{ width: width + 'rpx', height: height + 'rpx' }">
      <view
        class="tui-xAxis__line"
        v-for="(item, index) in xAxisData"
        :key="item.id"
        :style="{ left: index * (xAxisLine.itemGap || 100) + 'rpx', borderLeftStyle: index === 0 ? 'solid' : splitLine.type, borderLeftColor: index === 0 ? yAxisLine.color : splitLine.color }"
      >
        <view class="tui-xAxis__tickmarks" :style="{ height: xAxisTick.height || '12rpx', background: xAxisTick.color || '#e3e3e3' }"></view>
        <view class="tui-xAxis__val" :style="{ color: xAxisLabel.color, fontSize: xAxisLabel.size + 'rpx' }">
          {{ item.value }}
        </view>
      </view>
      <view
        class="tui-yAxis__line"
        v-for="(item, index) in yAxisData"
        :key="item.id"
        :style="{ bottom: index * (yAxisLine.itemGap || 80) + 'rpx', borderBottomStyle: index === 0 ? 'solid' : splitLine.type, borderBottomColor: index === 0 ? xAxisLine.color : splitLine.color }"
      >
        <view class="tui-yAxis__tickmarks" :style="{ width: yAxisTick.width || '12rpx', background: yAxisTick.color || '#e3e3e3' }"></view>
        <view class="tui-yAxis__val" :style="{ color: yAxisLabel.color, fontSize: yAxisLabel.size + 'rpx' }">
          {{ item.value }}
        </view>
      </view>
      <view v-for="(item, index) in dataset" :key="item.id">
        <view
          @tap.stop="onDotTap(index, idx)"
          class="tui-scatter__item"
          :class="{ 'tui-scatter__item-active': activeIdx === idx && activeIndex === index && tooltipShow }"
          v-for="(model, idx) in item.source"
          :key="idx"
          :style="{ width: (item.width || 12) + 'rpx', height: (item.width || 12) + 'rpx', background: item.color || '#5677fc', left: model.x + 'rpx', bottom: model.y + 'rpx' }"
        >
        </view>
      </view>
    </view>
    <view class="tui-scatter__tooltip" v-if="tooltip" :class="{ 'tui-scatter__tooltip-show': tooltipShow }">
      <view class="tui-tooltip__title"></view>
      <view class="tui-scatter__tooltip-item">
        <view class="tui-legend__circle" :style="{ background: tooltips.color }"></view>
        <text class="tui-tooltip__val">{{ tooltips.val }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'tui-charts-scatter',
  emits: ['click'],
  props: {
    //图例，说明
    legend: {
      type: Object,
      default() {
        return {
          show: false,
          size: 24,
          color: '#333'
        };
      }
    },
    tooltip: {
      type: Boolean,
      default: true
    },
    xAxis: {
      type: Object,
      default() {
        return {
          min: 0,
          max: 100,
          splitNumber: 20
        };
      }
    },
    //x轴刻度线
    xAxisTick: {
      type: Object,
      default() {
        return {
          height: '12rpx',
          //不显示则将颜色设置为transparent
          color: '#e3e3e3'
        };
      }
    },
    //x轴线条
    xAxisLine: {
      type: Object,
      default() {
        return {
          color: '#e3e3e3',
          itemGap: 100
        };
      }
    },
    xAxisLabel: {
      type: Object,
      default() {
        return {
          color: '#333',
          size: 24
        };
      }
    },
    yAxis: {
      type: Object,
      default() {
        return {
          min: 0,
          max: 100,
          splitNumber: 20
        };
      }
    },
    yAxisLine: {
      type: Object,
      default() {
        return {
          //不显示则将颜色设置为transparent
          color: '#e3e3e3',
          //y轴item间距 rpx
          itemGap: 80
        };
      }
    },
    //y轴刻度线
    yAxisTick: {
      type: Object,
      default() {
        return {
          width: '12rpx',
          //不显示则将颜色设置为transparent
          color: '#e3e3e3'
        };
      }
    },
    yAxisLabel: {
      type: Object,
      default() {
        return {
          color: '#333',
          size: 24
        };
      }
    },
    //分割线
    splitLine: {
      type: Object,
      default() {
        return {
          //分割线颜色,不显示则将颜色设置为transparent
          color: '#e3e3e3',
          type: 'dashed'
        };
      }
    }
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
  data() {
    return {
      width: 0,
      height: 0,
      xAxisData: [],
      yAxisData: [],
      activeIndex: -1,
      activeIdx: -1,
      dataset: [],
      tooltips: {},
      tooltipShow: false,
      timer: null
    };
  },
  methods: {
    generateArray(start, end) {
      return Array.from(new Array(end + 1).keys()).slice(start);
    },
    init(dataset, xAxisValFormatter) {
      let xTotal = this.xAxis.max - this.xAxis.min;
      let yTotal = this.yAxis.max - this.yAxis.min;
      let xSections = Math.ceil(xTotal / this.xAxis.splitNumber);
      let ySections = Math.ceil(yTotal / this.yAxis.splitNumber);
      let xSectionsArr = this.generateArray(0, xSections);
      let ySectionsArr = this.generateArray(0, ySections);
      this.xAxisData = xSectionsArr.map((item, index) => {
        let val = item * this.xAxis.splitNumber + this.xAxis.min;
        val = xAxisValFormatter ? xAxisValFormatter(val) : val;
        return {
          id: 'x_' + index,
          value: val
        };
      });
      this.yAxisData = ySectionsArr.map((item, idx) => {
        return {
          id: 'y_' + idx,
          value: item * this.yAxis.splitNumber + this.yAxis.min
        };
      });
      this.width = (this.xAxisLine.itemGap || 100) * xSections;
      this.height = (this.yAxisLine.itemGap || 80) * ySections;
      dataset.map((item, i) => {
        item.id = 'd_' + i;
        item.source = item.source.map(model => {
          return {
            x: ((Number(model[0]) - this.xAxis.min) / xTotal) * this.width,
            y: ((Number(model[1]) - this.yAxis.min) / yTotal) * this.height,
            name: model[2],
            x1: model[0],
            y1: model[1]
          };
        });
      });
      this.dataset = dataset;
    },
    draw(dataset, xAxisValFormatter) {
      dataset = dataset || [];
      this.init(dataset, xAxisValFormatter);
    },
    clearTimer() {
      clearTimeout(this.timer);
      this.timer = null;
    },
    tooltipHandle(index, idx) {
      let data = this.dataset[index];
      let item = data.source[idx];
      let tooltips = {
        color: data.color,
        val: item.name || `${item.x1}，${item.y1}`
      };
      this.tooltips = tooltips;
      this.clearTimer();
      this.tooltipShow = true;
      this.timer = setTimeout(() => {
        this.tooltipShow = false;
      }, 5000);
    },
    onDotTap(index, idx) {
      this.activeIndex = index;
      this.activeIdx = idx;
      this.tooltipHandle(index, idx);
      this.$emit('click', {
        datasetIndex: index,
        sourceIndex: idx
      });
    }
  }
};
</script>

<style scoped>
.tui-charts__scatter-wrap {
  position: relative;
  font-weight: normal;
  margin-bottom: 60rpx;
}

.tui-charts__scatter-box {
  position: relative;
}

.tui-xAxis__line {
  position: absolute;
  left: 0;
  border-left-width: 1px;
  top: 0;
  bottom: 0;
  overflow: visible;
}

.tui-xAxis__tickmarks {
  width: 1px;
  position: absolute;
  left: -1px;
  bottom: 0;
  transform: translateY(100%);
}

.tui-yAxis__line {
  position: absolute;
  left: 0;
  border-bottom-width: 1px;
  bottom: 0;
  right: 0;
  overflow: visible;
}

.tui-yAxis__tickmarks {
  width: 12rpx;
  height: 1px;
  position: absolute;
  left: 0;
  top: 0;
  transform: translateX(-100%);
  z-index: 10;
}

.tui-xAxis__val {
  position: absolute;
  left: 0;
  bottom: -16rpx;
  transform: translate(-50%, 100%);
}

.tui-yAxis__val {
  position: absolute;
  left: -16rpx;
  top: 0;
  transform: translate(-100%, -50%);
  z-index: 11;
}

.tui-scatter__item {
  border-radius: 50%;
  position: absolute;
  z-index: 12;
  left: 0;
  bottom: 0;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
  transform: translate(-50%, 50%) scale(1);
  transition: transform 0.3s;
}

.tui-scatter__item-active {
  transform: translate(-50%, 50%) scale(1.2);
}

.tui-scatter__legend {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.tui-scatter__legend-item {
  display: flex;
  align-items: center;
  margin-left: 24rpx;
  margin-bottom: 30rpx;
}

.tui-legend__circle {
  height: 20rpx;
  width: 20rpx;
  border-radius: 50%;
  margin-right: 8rpx;
  flex-shrink: 0;
}

.tui-scatter__tooltip {
  padding: 30rpx;
  border-radius: 12rpx;
  background-color: rgba(0, 0, 0, 0.6);
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  z-index: 20;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;
}

.tui-scatter__tooltip-show {
  visibility: visible;
  opacity: 1;
}

.tui-scatter__tooltip-item {
  display: flex;
  align-items: center;
  white-space: nowrap;
  transform: scale(1);
}

.tui-tooltip__val {
  font-size: 24rpx;
  line-height: 24rpx;
  color: #fff;
  margin-left: 6rpx;
}
</style>
