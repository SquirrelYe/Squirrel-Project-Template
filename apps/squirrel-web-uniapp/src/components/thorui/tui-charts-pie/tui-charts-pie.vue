<template>
  <view class="tui-charts__pie-wrap" :class="{ 'tui-charts__pie-vertical': legend.direction !== 'vertical' }">
    <view class="tui-pie__legend" :class="{ 'tui-legend__flex-column': legend.direction === 'vertical' }" v-if="legend.show">
      <view class="tui-pie__legend-item" :style="{ marginLeft: legend.direction === 'vertical' ? '0' : '24rpx' }" v-for="(item, index) in dataset" :key="index">
        <view class="tui-legend__circle" :style="{ backgroundColor: item.color }"></view>
        <text :style="{ fontSize: (legend.size || 24) + 'rpx', lineHeight: (legend.size || 24) + 'rpx', color: legend.color || '#333' }">{{ item.name }}</text>
      </view>
    </view>
    <view class="tui-charts__pie-box" :style="{ width: diam + 'rpx', height: diam + 'rpx', backgroundColor: backgroundColor }">
      <view
        class="tui-charts__pie-itembox"
        :style="{
          width: diam / 2 + 2 + 'rpx',
          height: diam + 'rpx',
          backgroundColor: item.angle > 180 ? item.color : 'transparent',
          zIndex: item.angle > 180 ? 10 : 'auto',
          clip: item.transformAngle > 180 ? `rect(0, ${diam / 2}rpx, ${diam}rpx, 0)` : 'auto'
        }"
        v-for="(item, index) in dataset"
        :key="index"
        @tap.stop="itemClick(index)"
      >
        <view
          class="tui-charts__pie-item"
          :style="{
            width: diam / 2 + 'rpx',
            height: diam + 'rpx',
            marginLeft: diam / 2 + 'rpx',
            '-webkit-transform': `rotate(${item.transformAngle}deg)`,
            transform: `rotate(${item.transformAngle}deg)`,
            backgroundColor: item.color
          }"
        >
        </view>
      </view>
      <view class="tui-charts__pie-annular" v-if="type == 2" :style="{ width: annular.width + 'rpx', height: annular.width + 'rpx', backgroundColor: annular.backgroundColor }"> </view>
    </view>
    <view class="tui-pie__tooltip" v-if="tooltip" :class="{ 'tui-pie__tooltip-show': tooltipShow }">
      <view class="tui-tooltip__title" v-if="title">{{ title }}</view>
      <view class="tui-pie__tooltip-item" :style="{ paddingTop: title ? '24rpx' : '0' }">
        <view class="tui-legend__circle" :style="{ backgroundColor: dataset[activeIndex] && dataset[activeIndex].color }"></view>
        <text class="tui-tooltip__val">{{ dataset[activeIndex] && dataset[activeIndex].name }}</text>
        <text class="tui-tooltip__val tui-tooltip__val-ml">{{ dataset[activeIndex] && dataset[activeIndex].value }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'tui-charts-pie',
  emits: ['click'],
  props: {
    //统计名称
    title: {
      type: String,
      default: ''
    },
    //饼状图直径 rpx
    diam: {
      type: Number,
      default: 400
    },
    //饼状图背景色
    backgroundColor: {
      type: String,
      default: 'transparent'
    },
    //图例，说明
    legend: {
      type: Object,
      default() {
        return {
          show: true,
          size: 24,
          color: '#333',
          //horizontal，vertical
          direction: 'horizontal'
        };
      }
    },
    tooltip: {
      type: Boolean,
      default: true
    },
    //展示类型：1-饼状 2-环状
    type: {
      type: Number,
      default: 1
    },
    //环形中间圆圈样式
    annular: {
      type: Object,
      default() {
        return {
          width: 200,
          backgroundColor: '#f8f8f8'
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
      tooltips: [],
      tooltipShow: false,
      timer: null,
      activeIndex: -1,
      /*========options============*/
      /*
				    value:0, 
					name: '', 
					color: ''
				*/
      dataset: []
    };
  },
  methods: {
    getTotalVal(data) {
      let val = 0;
      data.forEach((item, index) => {
        val += item.value;
      });
      return val;
    },
    init(dataset) {
      let data = [...dataset];
      const total = this.getTotalVal(data);
      let totalAngle = 0;
      data.map((item, index) => {
        item.transformAngle = totalAngle;
        item.angle = Number(((item.value / total) * 360).toFixed(1));
        totalAngle += item.angle;
      });
      this.dataset = data;
    },
    draw(dataset) {
      this.init(dataset);
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
.tui-charts__pie-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.tui-charts__pie-vertical {
  flex-direction: column;
}

.tui-pie__legend {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.tui-legend__flex-column {
  flex-direction: column;
  margin-right: 40rpx;
}

.tui-pie__legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.tui-legend__circle {
  height: 20rpx;
  width: 20rpx;
  border-radius: 50%;
  margin-right: 8rpx;
  flex-shrink: 0;
}

.tui-charts__pie-box {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  transform: rotate(0deg) translateZ(0);
  flex-shrink: 0;
  font-size: 0;
}

.tui-charts__pie-itembox {
  position: absolute;
  left: 0;
  top: 0;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
}

.tui-charts__pie-item {
  transform-origin: 0 50%;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
  position: relative;
  z-index: 10;
  margin-top: 0;
  margin-bottom: 0;
  margin-right: 0;
  /* transform-style:preserve-3d; */
  /* transition: all 0.3s; */
}

.tui-charts__pie-annular {
  border-radius: 50%;
  left: 50%;
  top: 50%;
  position: absolute;
  z-index: 12;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tui-pie__tooltip {
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

.tui-pie__tooltip-show {
  visibility: visible;
  opacity: 1;
}

.tui-tooltip__title {
  font-size: 30rpx;
  color: #fff;
  line-height: 30rpx;
  flex-shrink: 0;
}

.tui-pie__tooltip-item {
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
