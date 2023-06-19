<template>
  <view class="tui-charts__bar-wrap" :style="{ width: width + 'rpx' }">
    <view class="tui-bar__legend" v-if="legend.show">
      <view class="tui-bar__legend-item" v-for="(item, index) in dataset" :key="index">
        <view class="tui-legend__circle" :style="{ backgroundColor: item.color }"></view>
        <text :style="{ fontSize: (legend.size || 24) + 'rpx', lineHeight: (legend.size || 24) + 'rpx', color: legend.color || '#333' }">{{ item.name }}</text>
      </view>
    </view>
    <view class="tui-charts__bar-box" :style="{ borderLeftColor: yAxisLine.color, borderBottomColor: xAxisLineColor }" v-if="yAxis.length > 0 && dataset.length > 0">
      <view
        class="tui-charts__bar-item"
        :class="{
          'tui-bar__item-stack': isStack,
          'tui-column__item-active': activeIndex === index && clickEffect == 1,
          'tui-column__bar-opacity': clickEffect == 2,
          'tui-column__bar-active': clickEffect == 2 && activeIndex == index
        }"
        v-for="(item, index) in yAxis"
        :key="index"
        :style="{ padding: yAxisLine.itemPadding || '30rpx 0' }"
      >
        <view
          class="tui-charts__bar"
          :class="{ 'tui-charts__bar-round': columnCap === 'round' }"
          v-for="(bar, idx) in dataset"
          :key="idx"
          :style="{
            height: columnBarHeight + 'rpx',
            borderRightColor: getBarColor(bar.source[index], bar.color, bar.colorFormatter),
            background: getBarColor(bar.source[index], bar.color, bar.colorFormatter),
            width: getBarWidth(bar.source[index], dataset),
            marginLeft: getMarginLeft(bar.source[index])
          }"
          @tap.stop="onBarTap(index, idx)"
        >
        </view>
        <view
          class="tui-bar__val"
          v-if="(yAxisVal.show && clickEffect != 2) || (yAxisVal.show && clickEffect == 2 && activeIndex === index)"
          :style="{ color: yAxisVal.color, fontSize: (yAxisVal.size || 24) + 'rpx', whiteSpace: yAxisVal.nowrap ? 'nowrap' : 'normal', left: getLeft(index) }"
        >
          {{ getXAxisVal(index) }}
        </view>
        <view class="tui-bar__yAxis-text" :style="{ color: yAxisLabel.color || '#333', fontSize: (yAxisLabel.size || 24) + 'rpx' }">
          {{ item }}
        </view>
        <view class="tui-yAxis__tickmarks" :style="{ width: yAxisTick.width || '12rpx', backgroundColor: yAxisTick.color || '#e3e3e3' }"></view>
      </view>
      <view class="tui-bar__yAxis-linebox">
        <view
          class="tui-bar__yAxis-line"
          :class="{ 'tui-yAxis__line-first': idx === 0 }"
          v-for="(item, idx) in xAxisData"
          :key="idx"
          :style="{ borderLeftStyle: splitLine.type, borderLeftColor: splitLine.color }"
        >
          <text class="tui-xAxis__val" :style="{ color: item.color || xAxisLabel.color, fontSize: (xAxisLabel.size || 24) + 'rpx' }" v-if="xAxisLabel.show">{{ item.value }}</text>
        </view>
      </view>
    </view>
    <view class="tui-column__tooltip" v-if="tooltip" :class="{ 'tui-column__tooltip-show': tooltipShow }">
      <view class="tui-tooltip__title">{{ yAxis[activeIndex] || '' }}</view>
      <view class="tui-column__tooltip-item" v-for="(item, index) in tooltips" :key="index">
        <view class="tui-legend__circle" :style="{ backgroundColor: item.color }"></view>
        <text class="tui-tooltip__val">{{ item.name }}</text>
        <text class="tui-tooltip__val tui-tooltip__val-ml">{{ item.val }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'tui-charts-bar',
  emits: ['click'],
  props: {
    //图表宽度 rpx
    width: {
      type: [Number, String],
      default: 600
    },
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
      default: false
    },
    //x轴数据，如果不传则默认使用min,max值计算
    // {
    // 	value: 0,
    // 	color: "#a0a0a0"
    // }
    xAxis: {
      type: Array,
      default() {
        return [];
      }
    },
    //x轴最小值
    min: {
      type: Number,
      default: 0
    },
    //x轴最大值
    max: {
      type: Number,
      default: 100
    },
    //x轴分段递增数值
    splitNumber: {
      type: Number,
      default: 20
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
    },
    xAxisLineColor: {
      type: String,
      //不显示则将颜色设置为transparent
      default: '#e3e3e3'
    },
    xAxisLabel: {
      type: Object,
      default() {
        return {
          show: true,
          color: '#333',
          size: 24
        };
      }
    },
    yAxis: {
      type: Array,
      default() {
        return [];
      }
    },
    //柱状条高度
    columnBarHeight: {
      type: [Number, String],
      default: 32
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
    //y轴线条
    yAxisLine: {
      type: Object,
      default() {
        return {
          color: '#e3e3e3',
          //y轴item的padding值
          itemPadding: '30rpx 0'
        };
      }
    },
    yAxisLabel: {
      type: Object,
      default() {
        return {
          show: true,
          color: '#333',
          size: 24
        };
      }
    },
    yAxisVal: {
      type: Object,
      default() {
        return {
          show: true,
          color: '#333',
          size: 24
        };
      }
    },
    //默认选中y轴索引
    currentIndex: {
      type: Number,
      default: -1
    },
    //是否堆叠展示
    isStack: {
      type: Boolean,
      default: false
    },
    //柱状条点击效果：1-出现背景，2-高亮显示，其他变暗 3-无效果
    clickEffect: {
      type: Number,
      default: 1
    },
    /*
				 柱状条的端点样式
				 round	向线条的每个末端添加圆形线帽
				 square	向线条的每个末端添加正方形线帽
				*/
    columnCap: {
      type: String,
      default: 'square'
    },
    isMinus: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      sections: 0,
      xAxisData: [],
      activeIndex: -1,
      activeIdx: -1,
      tooltips: [],
      tooltipShow: false,
      timer: null,
      /*========options============*/
      /*
					name: '', 
					color: '',
					source: []
					colorFormatter:Function
				*/
      dataset: [],
      yAxisValFormatter: null,
      maxValue: 1
    };
  },
  watch: {
    xAxis(newVal) {
      this.init();
    },
    currentIndex(newVal) {
      if (newVal != this.activeIndex) {
        this.activeIndex = newVal;
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
  created() {
    // this.maxValue = this.max;
    this.init();
    this.activeIndex = this.currentIndex;
  },
  methods: {
    getBarWidth(value, dataset) {
      // ((bar.source[index]-(isStack?(min/dataset.length):min))/(maxValue-min))*width +'rpx'
      let min = this.min;
      if (this.isMinus && !this.isStack) {
        value = Math.abs(value);
        min = 0;
      }
      return ((value - (this.isStack ? min / dataset.length : min)) / (this.maxValue - this.min)) * this.width + 'rpx';
    },
    getMarginLeft(value) {
      let ml = 0;
      if (this.isMinus && !this.isStack && Number(this.min) < 0) {
        const min = value > 0 ? Math.abs(this.min) : value - this.min;
        ml = (min / (this.maxValue - this.min)) * this.width;
      }
      return ml + 'rpx';
    },
    generateArray(start, end) {
      return Array.from(new Array(end + 1).keys()).slice(start);
    },
    getXAxisVal(index) {
      let showVal = '';
      let val = 0;
      if (this.dataset.length === 1) {
        val = this.dataset[0].source[index];
        showVal = val;
      } else if (this.dataset.length > 1) {
        let arr = [];
        this.dataset.forEach(item => {
          arr.push(item.source[index]);
        });
        val = arr;
      }
      if (this.yAxisVal.formatter && typeof this.yAxisVal.formatter === 'function') {
        showVal = this.yAxisVal.formatter(val);
      } else if (this.yAxisValFormatter && typeof this.yAxisValFormatter === 'function') {
        showVal = this.yAxisValFormatter(val);
      }
      return showVal;
    },
    getBarColor(val, color, colorFormatter) {
      let bgColor = color;
      if (colorFormatter && typeof colorFormatter === 'function') {
        let formatColor = colorFormatter(val);
        if (formatColor) {
          bgColor = formatColor;
        }
      }
      return bgColor;
    },
    getLeft(index) {
      let arr = [0];
      let total = 0;
      this.dataset.forEach(item => {
        arr.push(item.source[index]);
        total += item.source[index];
      });
      return (((this.isStack ? total : Math.max(...arr)) - this.min) / (this.maxValue - this.min)) * this.width + 'rpx';
    },
    init() {
      let sections = this.xAxis.length - 1;
      let xAxis = this.xAxis;
      this.maxValue = this.max;
      if (sections <= 0) {
        sections = Math.ceil((this.max - this.min) / this.splitNumber);
        let sectionsArr = this.generateArray(0, sections);

        xAxis = sectionsArr.map(item => {
          return {
            value: item * this.splitNumber + this.min
          };
        });
        this.maxValue = xAxis[xAxis.length - 1].value;
      }
      this.xAxisData = xAxis;
      this.sections = sections + 1;
    },
    clearTimer() {
      clearTimeout(this.timer);
      this.timer = null;
    },
    tooltipHandle(index) {
      let data = [...this.dataset];
      let tooltips = [];
      data.forEach(item => {
        let color = item.color;
        if (item.colorFormatter && typeof item.colorFormatter === 'function') {
          color = item.colorFormatter(item.source[index]);
        }
        tooltips.push({
          color: color,
          name: item.name,
          val: item.source[index]
        });
      });
      this.tooltips = tooltips;
      this.clearTimer();
      this.tooltipShow = true;
      this.timer = setTimeout(() => {
        this.tooltipShow = false;
      }, 5000);
    },
    onBarTap(index, idx) {
      this.activeIndex = index;
      this.activeIdx = idx;
      this.tooltipHandle(index);
      this.$emit('click', {
        datasetIndex: idx,
        sourceIndex: index,
        ...this.dataset[idx]
      });
    },
    /*
			dataset：柱状图表数据
			yAxisValFormatter :格式化柱状条顶部value值（此处传值是为了做兼容处理）
			*/
    draw(dataset, yAxisValFormatter) {
      this.yAxisValFormatter = yAxisValFormatter || null;
      this.dataset = dataset || [];
      this.init();
    }
  }
};
</script>

<style scoped>
.tui-charts__bar-wrap {
  position: relative;
  margin: 0 auto;
}

.tui-bar__legend {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.tui-bar__legend-item {
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

.tui-charts__bar-box {
  position: relative;
  width: 100%;
  border-left: 1px solid;
  border-bottom: 1px solid;
  display: inline-flex;
  justify-content: space-between;
  flex-direction: column;
  z-index: 8;
}

.tui-charts__bar-item {
  position: relative;
  flex: 1;
  flex-shrink: 0;
  padding: 30rpx 0;
  display: inline-flex;
  flex-direction: column;
  z-index: 10;
  transition: all 0.3s;
}

.tui-bar__item-stack {
  flex-direction: row !important;
}

.tui-yAxis__tickmarks {
  position: absolute;
  width: 16rpx;
  height: 1px;
  background-color: #e3e3e3;
  left: 0;
  top: 0;
  transform: translateX(-100%);
  z-index: 10;
}

.tui-charts__bar {
  position: relative;
  transition: all 0.3s;
  text-align: center;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
  /* border-right: 1px solid; */
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  /* position: relative; */
  flex-shrink: 0;
}

.tui-column__bar-opacity {
  opacity: 0.6;
}

.tui-column__bar-active {
  opacity: 0.9999;
}

.tui-column__item-active {
  background-color: rgba(0, 0, 0, 0.1);
}

.tui-charts__bar-round {
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;
}

.tui-bar__val {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  padding-left: 12rpx;
  word-break: break-all;
  flex-shrink: 0;
  transition: left 0.3s;
}

.tui-bar__yAxis-text {
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 0;
  flex: 1;
  transform: translate(-100%, -50%);
  padding-right: 20rpx;
  word-break: break-all;
}

.tui-bar__yAxis-linebox {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  z-index: 6;
}

.tui-bar__yAxis-line {
  height: 100%;
  width: 0;
  border-left: 1px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: visible;
}

.tui-yAxis__line-first {
  border-left: 0 !important;
}

.tui-xAxis__val {
  transform: translateY(100%);
  padding-top: 12rpx;
}

.tui-column__tooltip {
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

.tui-column__tooltip-show {
  visibility: visible;
  opacity: 1;
}

.tui-tooltip__title {
  font-size: 30rpx;
  color: #fff;
  line-height: 30rpx;
}

.tui-column__tooltip-item {
  display: flex;
  align-items: center;
  padding-top: 24rpx;
  white-space: nowrap;
}

.tui-tooltip__val {
  font-size: 24rpx;
  line-height: 24rpx;
  color: #fff;
  margin-left: 6rpx;
}

.tui-tooltip__val-ml {
  margin-left: 20rpx;
}
</style>
