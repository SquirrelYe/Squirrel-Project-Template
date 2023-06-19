<template>
  <view class="tui-charts__line-wrap" :style="{ width: width + 'rpx' }">
    <view class="tui-line__legend" v-if="legend.show">
      <view class="tui-line__legend-item" v-for="(item, index) in dataset" :key="index">
        <view class="tui-line__legend-circle" :style="{ backgroundColor: item.color }"></view>
        <text :style="{ fontSize: (legend.size || 24) + 'rpx', lineHeight: (legend.size || 24) + 'rpx', color: legend.color || '#333' }">{{ item.name }}</text>
      </view>
    </view>
    <view class="tui-charts__line-box" v-if="xAxis.length > 0 && dataset.length > 0" :style="{ width: width + 'rpx' }">
      <scroll-view :scroll-x="scrollable" class="tui-line__scroll-view" :style="{ height: scrollViewH + 'rpx' }">
        <view :style="{ height: (xAxisVal.height || 48) + 'rpx' }"></view>
        <view class="tui-charts__line" :style="{ height: height + 'rpx' }">
          <view class="tui-line__item" :class="{ 'tui-line__flex-1': !scrollable }" :style="{ width: (xAxisLine.itemGap || 120) + 'rpx' }" v-for="(item, index) in xAxis" :key="index">
            <view class="tui-line__xAxis-text" :style="{ color: xAxisLabel.color || '#333', fontSize: (xAxisLabel.size || 24) + 'rpx' }">
              {{ item }}
            </view>
            <view
              class="tui-yAxis__split-line"
              :style="{ borderRightStyle: yAxisSplitLine.type || 'dashed', borderRightColor: yAxisSplitLine.color || '#e3e3e3' }"
              v-if="tooltipShow && index == activeIdx"
            >
            </view>
            <view class="tui-xAxis__tickmarks" :style="{ height: xAxisTick.height || '12rpx', backgroundColor: xAxisTick.color || '#e3e3e3' }"> </view>
          </view>
          <view v-for="(dot, i) in dots" :key="dot.id">
            <view
              class="tui-charts__line-dot"
              :class="{ 'tui-charts__dot-enlarge': tooltipShow && j == activeIdx }"
              @tap.stop="dotClick(i, j)"
              v-for="(d, j) in dot.source"
              :key="d.id"
              :style="{
                bottom: d.y + 'rpx',
                left: d.x + 'rpx',
                width: (brokenDot.width || 12) + 'rpx',
                height: (brokenDot.width || 12) + 'rpx',
                borderColor: dot.color || brokenDot.color,
                background: brokenDot.color || dot.color
              }"
            >
              <text class="tui-line__val" :style="{ fontSize: (xAxisVal.size || 24) + 'rpx', color: xAxisVal.color }" v-if="xAxisVal.show">
                {{ getYAxisVal(i, j) }}
              </text>
            </view>
          </view>

          <view v-for="(line, idx) in lines" :key="line.id">
            <view
              class="tui-charts__broken-line"
              v-for="(l, k) in line.source"
              :key="l.id"
              :style="{
                height: brokenLineHeight + 'px',
                background: line.color,
                bottom: l.y + 'rpx',
                left: l.x + 'rpx',
                width: l.width + 'rpx',
                '-webkit-transform': `rotate(${l.angle}deg)`,
                transform: `rotate(${l.angle}deg)`
              }"
            >
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="tui-line__border-left" :style="{ height: height + (xAxisVal.height || 48) + 'rpx', backgroundColor: yAxisLine.color || '#e3e3e3' }"> </view>
      <view
        class="tui-xAxis__line"
        :class="{ 'tui-line__first': index === 0 }"
        :style="{
          bottom: index * (yAxisLine.itemGap || 60) + (xAxisLabel.height || 60) + 'rpx',
          borderTopStyle: index === 0 ? 'solid' : splitLine.type,
          borderTopColor: index === 0 ? xAxisLine.color : splitLine.color
        }"
        v-for="(item, index) in yAxisData"
        :key="index"
      >
        <text class="tui-yAxis__val" :style="{ color: item.color || yAxisLabel.color, fontSize: (yAxisLabel.size || 24) + 'rpx' }" v-if="yAxisLabel.show">{{ item.value }}</text>
      </view>
    </view>

    <view class="tui-line__tooltip" v-if="tooltip" :class="{ 'tui-line__tooltip-show': tooltipShow }">
      <view class="tui-tooltip__title">{{ xAxis[activeIdx] || '' }}</view>
      <view class="tui-line__tooltip-item" v-for="(item, index) in tooltips" :key="index">
        <view class="tui-line__legend-circle" :style="{ backgroundColor: item.color }"></view>
        <text class="tui-tooltip__val">{{ item.name }}</text>
        <text class="tui-tooltip__val tui-tooltip__val-ml">{{ item.val }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'tui-charts-line',
  emits: ['click'],
  props: {
    //图表宽度
    width: {
      type: [Number, String],
      default: 620
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
    xAxis: {
      type: Array,
      default() {
        return [];
      }
    },
    //默认选中x轴索引
    currentIndex: {
      type: Number,
      default: -1
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
          //x轴item间距 rpx
          itemGap: 120
        };
      }
    },
    xAxisLabel: {
      type: Object,
      default() {
        return {
          color: '#333',
          size: 24,
          height: 60
        };
      }
    },
    xAxisVal: {
      type: Object,
      default() {
        return {
          show: true,
          color: '#333',
          size: 24,
          //如果show为true且val显示的时候，height需要设置一定的值保证val能显示完整 rpx
          height: 48
        };
      }
    },
    //点击坐标点所显示的分割线
    yAxisSplitLine: {
      type: Object,
      default() {
        return {
          //分割线颜色,不显示则将颜色设置为transparent
          color: 'transparent',
          type: 'dashed'
        };
      }
    },
    //折线坐标点宽度 rpx
    brokenDot: {
      type: Object,
      default() {
        return {
          width: 12,
          //点的背景色
          color: '#F8F8F8'
        };
      }
    },
    //折线高度/粗细 px
    brokenLineHeight: {
      type: [Number, String],
      default: 1
    },
    //y轴数据，如果不传则默认使用min,max值计算
    // {
    // 	value: 0,
    // 	color: "#333"
    // }
    yAxis: {
      type: Array,
      default() {
        return [];
      }
    },
    //y轴最小值
    min: {
      type: Number,
      default: 0
    },
    //y轴最大值
    max: {
      type: Number,
      default: 100
    },
    //y轴分段递增数值
    splitNumber: {
      type: Number,
      default: 20
    },
    yAxisLine: {
      type: Object,
      default() {
        return {
          //不显示则将颜色设置为transparent
          color: '#e3e3e3',
          //y轴item间距 rpx
          itemGap: 60
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
    //是否可滚动
    scrollable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      height: 0,
      scrollViewH: 0,
      sections: 0,
      yAxisData: [],
      activeIndex: -1,
      activeIdx: -1,
      tooltips: [],
      tooltipShow: false,
      timer: null,
      dots: [],
      lines: [],
      /*========options============*/
      /*
					name: '', 
					color: '',
					source: []
					colorFormatter:Function
				*/
      dataset: [],
      xAxisValFormatter: null,
      maxValue: 1
    };
  },
  created() {
    this.init();
    this.activeIdx = this.currentIndex;
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
    getYAxisVal(idx, index) {
      let showVal = this.dataset[idx].source[index];
      if (this.xAxisVal.formatter && typeof this.xAxisVal.formatter === 'function') {
        showVal = this.xAxisVal.formatter(showVal);
      } else if (this.xAxisValFormatter && typeof this.xAxisValFormatter === 'function') {
        showVal = this.xAxisValFormatter(showVal);
      }
      return showVal;
    },
    generateArray(start, end) {
      return Array.from(new Array(end + 1).keys()).slice(start);
    },
    getValue(val) {
      return val < 0 ? 0 : val;
    },
    getCoordinatePoint() {
      const xAxis = [...this.xAxis];
      const xSections = xAxis.length;
      const ySections = this.yAxisData.length - 1;
      const itemGap = this.scrollable ? this.xAxisLine.itemGap || 120 : this.width / xSections;
      let dots = [];
      let radius = (this.brokenDot.width || 12) / 2;

      this.dataset.map((item, index) => {
        let source = item.source || [];
        let dotArr = [];
        source.map((val, idx) => {
          dotArr.push({
            id: 'd' + idx,
            x: this.getValue((0.5 + idx) * itemGap - radius),
            y: this.getValue(((val - this.min) / (this.maxValue - this.min)) * (this.yAxisLine.itemGap || 60) * ySections - radius)
          });
        });
        dots.push({
          id: 'dd' + index,
          color: item.color,
          source: dotArr
        });
      });
      this.dots = dots;
      this.drawLines(dots);
    },
    drawLines(dots) {
      let lines = [];
      // dots是点的集合 : Array<{ x: number; y: number; }>
      let radius = (this.brokenDot.width || 12) / 2;
      dots.map((item, idx) => {
        let dotArr = item.source;
        let lineArr = [];
        dotArr.map((dot, index) => {
          // 最后一个点没有连线
          if (!dotArr[index + 1]) return;
          const AB = {
            x: dotArr[index + 1].x - dot.x,
            y: dotArr[index + 1].y - dot.y,
            y1: dot.y - dotArr[index + 1].y
          };
          // 向量的模
          const v = Math.sqrt(Math.pow(AB.x, 2) + Math.pow(AB.y, 2));
          // 求出偏转角度
          const angle = Math.atan2(AB.y1, AB.x) * (180 / Math.PI);
          lineArr.push({
            id: 'l' + index,
            x: dot.x + radius,
            y: dot.y + radius - 1,
            width: v,
            angle: AB.y1 > 0 ? Math.sqrt(Math.pow(angle, 2)) : -Math.sqrt(Math.pow(angle, 2))
          });
        });
        lines.push({
          id: 'll' + idx,
          color: item.color,
          source: lineArr
        });
      });
      this.lines = lines;
    },
    init() {
      this.maxValue = this.max;
      let itemGap = this.yAxisLine.itemGap || 60;
      let sections = this.yAxis.length - 1;
      let yAxis = this.yAxis;
      if (sections <= 0) {
        sections = Math.ceil((this.max - this.min) / this.splitNumber);
        let sectionsArr = this.generateArray(0, sections);

        yAxis = sectionsArr.map(item => {
          return {
            value: item * this.splitNumber + this.min
          };
        });
        this.maxValue = yAxis[yAxis.length - 1].value;
      }
      this.yAxisData = yAxis;
      this.sections = sections + 1;
      this.height = itemGap * sections;
      const valH = this.xAxisVal.height || 48;
      this.scrollViewH = this.height + (this.xAxisLabel.height || 60) + valH;
      this.getCoordinatePoint();
    },
    /*
			dataset：折线图表数据
			xAxisValFormatter :格式化折线拐点value值（此处传值是为了做兼容处理）
			*/
    draw(dataset, xAxisValFormatter) {
      this.xAxisValFormatter = xAxisValFormatter || null;
      this.dataset = dataset || [];
      this.init();
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
    dotClick(index, idx) {
      this.activeIndex = index;
      this.activeIdx = idx;
      this.tooltipHandle(idx);
      this.$emit('click', {
        datasetIndex: index,
        sourceIndex: idx,
        ...this.dataset[index]
      });
    }
  }
};
</script>

<style scoped>
.tui-charts__line-wrap {
  position: relative;
  transform: rotate(0deg) scale(1);
  /* margin: 0 auto; */
}

.tui-line__legend {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.tui-line__legend-item {
  display: flex;
  align-items: center;
  margin-left: 24rpx;
  margin-bottom: 30rpx;
}

.tui-line__legend-circle {
  height: 20rpx;
  width: 20rpx;
  border-radius: 50%;
  margin-right: 8rpx;
  flex-shrink: 0;
}

.tui-charts__line-box {
  position: relative;
  padding-left: 1px;
  box-sizing: border-box;
  transform-origin: 0 0;
  overflow: visible;
  transform: scale(1);
}

.tui-line__scroll-view {
  position: relative;
  z-index: 10;
  box-sizing: border-box;
}

.tui-charts__line {
  min-width: 100%;
  position: relative;
  display: flex;
  align-items: flex-end;
  /* overflow: hidden; */
  transform: rotate(0deg) scale(1);
}

.tui-line__between {
  justify-content: space-between;
}

.tui-line__item {
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  text-align: center;
  box-sizing: border-box;
  z-index: 10;
  transition: all 0.3s;
  flex-shrink: 0;
}

.tui-line__flex-1 {
  flex: 1;
}

.tui-xAxis__tickmarks {
  position: absolute;
  right: 0;
  width: 1px;
  transform: translateY(100%);
  bottom: 0;
}

.tui-yAxis__split-line {
  position: absolute;
  height: 100%;
  width: 0;
  border-right-width: 1px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.tui-line__xAxis-text {
  width: 100%;
  position: absolute;
  left: 50%;
  bottom: 0;
  flex: 1;
  transform: translate(-50%, 100%);
  padding-top: 8rpx;
  word-break: break-all;
}

.tui-line__border-left {
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  z-index: 11;
}

.tui-xAxis__line {
  width: 100%;
  height: 0;
  border-top-width: 1px;
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
}

.tui-line__first {
  z-index: 12;
}

.tui-yAxis__val {
  transform: translateX(-100%);
  padding-right: 12rpx;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
}

.tui-charts__line-dot {
  position: absolute;
  border-radius: 50%;
  transition: all 0.3s;
  z-index: 12;
  border-width: 1px;
  border-style: solid;
  box-sizing: border-box;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
}

.tui-line__val {
  width: 100%;
  position: absolute;
  top: 0;
  left: 50%;
  padding-bottom: 12rpx;
  transform: translate(-50%, -100%);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  white-space: nowrap;
  z-index: 20;
}

.tui-charts__dot-enlarge {
  transform: scale(1.4);
}

.tui-charts__broken-line {
  position: absolute;
  transform-origin: 0 0;
  transition: all 0.3s;
  z-index: 10;
  border-color: transparent;
  box-sizing: border-box;
  /* transform: translateZ(0); */
  /* -webkit-backface-visibility:hidden; */
}

.tui-line__tooltip {
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

.tui-line__tooltip-show {
  visibility: visible;
  opacity: 1;
}

.tui-tooltip__title {
  font-size: 30rpx;
  color: #fff;
  line-height: 30rpx;
}

.tui-line__tooltip-item {
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
