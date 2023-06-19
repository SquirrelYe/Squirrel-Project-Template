<template>
  <view class="tui-charts__radar-box" :style="{ width: radar_w + 'px' }">
    <view class="tui-radar__legend" v-if="legend.show">
      <view class="tui-radar__legend-item" v-for="(item, index) in dataset" :key="index">
        <view class="tui-legend__circle" :style="{ background: item.color }"></view>
        <text :style="{ fontSize: (legend.size || 24) + 'rpx', lineHeight: (legend.size || 24) + 'rpx', color: legend.color || '#333' }">{{ item.name }}</text>
      </view>
    </view>
    <view class="tui-charts-radar" :class="{ 'tui-radar__mrgin': label.show }" :style="{ width: radar_w + 'px', height: radar_w + 'px' }">
      <view
        class="tui-radar__radius"
        v-for="(item, index) in indicators"
        :key="index"
        :style="{ height: radar_w / 2 + 'px', transform: `rotate(${item.angle}deg)`, background: axisLineColor, width: lineBold ? '2px' : '1px' }"
      >
        <view class="tui-radar__name" v-if="label.show" :style="{ color: label.color || '#bbb', fontSize: (label.size || 24) + 'rpx' }">{{ item.name }}</view>
      </view>
      <view class="tui-radar__center" :style="{ width: lineBold ? '2px' : '1px', height: lineBold ? '2px' : '1px' }">
        <view
          class="tui-radar__hypotenuse"
          v-for="(l, idx) in hypotenuse"
          :key="l.id"
          :style="[{ bottom: l.y + 'px', left: l.x + 'px', width: l.width + 'px', transform: `rotate(${l.angle}deg)`, background: splitLineColor, height: lineBold ? '2px' : '1px' }]"
        >
        </view>
        <view v-for="(item, index) in dataset" :key="index" @tap.stop="onDotTap(index)">
          <view
            class="tui-radar__dataset"
            v-for="(d, i) in item.lines"
            :key="d.id"
            :style="{ bottom: d.y + 'px', left: d.x + 'px', width: d.width + 'px', transform: `rotate(${d.angle}deg)`, background: item.color, height: lineBold ? '2px' : '1px' }"
          >
            <view class="tui-radar__dot" :style="{ background: item.color }"></view>
          </view>
        </view>
      </view>
    </view>
    <view class="tui-radar__tooltip" v-if="tooltip" :class="{ 'tui-radar__tooltip-show': tooltipShow }">
      <view class="tui-tooltip__title">{{ name }}</view>
      <view class="tui-radar__tooltip-item" v-for="(item, index) in tooltips" :key="index">
        <view class="tui-legend__circle" :style="{ background: color }"></view>
        <text class="tui-tooltip__val">{{ item.name }}</text>
        <text class="tui-tooltip__val tui-tooltip__val-ml">{{ item.value }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'tui-charts-radar',
  emits: ['click'],
  props: {
    //图例，说明
    legend: {
      type: Object,
      default() {
        return {
          show: true,
          size: 24,
          color: '#333'
        };
      }
    },
    tooltip: {
      type: Boolean,
      default: true
    },
    width: {
      type: [Number, String],
      default: 480
    },
    splitNumber: {
      type: [Number, String],
      default: 5
    },
    indicator: {
      type: Array,
      default() {
        return [];
      }
    },
    label: {
      type: Object,
      default() {
        return {
          show: true,
          color: '#bbb',
          size: 24
        };
      }
    },
    axisLineColor: {
      type: String,
      default: '#ddd'
    },
    splitLineColor: {
      type: String,
      default: '#eee'
    },
    lineBold: {
      type: Boolean,
      default: false
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
      radar_w: 200,
      dataset: [],
      indicators: [],
      hypotenuse: [],
      name: '',
      color: '',
      tooltips: [],
      tooltipShow: false,
      timer: null
    };
  },
  created() {
    this.radar_w = this.getPx(this.width);
    this.draw(this.dataset);
  },
  methods: {
    getPx(rpx) {
      let px = parseInt(uni.upx2px(Number(rpx)));
      return px % 2 === 0 ? px : px + 1;
    },
    getDrawData(dots, idx, type = 'l') {
      let data = [];
      dots.map((dot, index) => {
        let obj = !dots[index + 1] ? dots[0] : dots[index + 1];
        const AB = {
          x: obj.x - dot.x,
          y: obj.y - dot.y,
          y1: dot.y - obj.y
        };
        const v = Math.sqrt(Math.pow(AB.x, 2) + Math.pow(AB.y, 2));
        const angle = Math.atan2(AB.y1, AB.x) * (180 / Math.PI);
        data.push({
          id: type + idx + '_' + index,
          x: dot.x + 1,
          y: dot.y,
          width: v,
          angle: AB.y1 > 0 ? Math.sqrt(Math.pow(angle, 2)) : -Math.sqrt(Math.pow(angle, 2))
        });
      });
      return data;
    },
    initData(dataset, r, indicator, angle) {
      let total = this.radar_w;
      dataset = JSON.parse(JSON.stringify(dataset));
      dataset.map((item, index) => {
        let lines = [];
        item.source.map((val, idx) => {
          let dsR = (val / indicator[idx].max) * r;
          lines.push({
            y: dsR * Math.cos((angle * idx * Math.PI) / 180),
            x: dsR * Math.sin((angle * idx * Math.PI) / 180)
          });
        });
        item.lines = this.getDrawData(lines, index, 'd');
      });
      this.dataset = dataset;
    },
    draw(dataset) {
      if (!dataset || !dataset[0] || !this.indicator) return;
      let len = this.indicator.length;
      let angle = 360 / len;
      let r = this.radar_w / 2;
      let indicator = JSON.parse(JSON.stringify(this.indicator));
      indicator.map((item, i) => {
        item.angle = angle * i;
      });
      this.indicators = indicator;

      let dots = [];
      let sn = Number(this.splitNumber);
      for (let i = 0; i < sn; i++) {
        let dotArr = [];
        let dsDot = [];
        let radius = r - i * (r / sn);
        for (let j = 0; j < len; j++) {
          dotArr.push({
            y: radius * Math.cos((angle * j * Math.PI) / 180),
            x: radius * Math.sin((angle * j * Math.PI) / 180)
          });
        }
        dots.push(dotArr);
      }

      let lineArr = [];
      dots.map((dotArr, idx) => {
        lineArr = lineArr.concat(this.getDrawData(dotArr, idx));
      });

      this.hypotenuse = lineArr;

      this.initData(dataset, r, indicator, angle);
    },
    clearTimer() {
      clearTimeout(this.timer);
      this.timer = null;
    },
    tooltipHandle(index) {
      let data = this.dataset[index];
      let tooltips = [];
      let indicator = JSON.parse(JSON.stringify(this.indicator));
      indicator.map((item, idx) => {
        item.value = data.source[idx];
      });
      this.name = data.name || '';
      this.color = data.color || '#333';
      this.tooltips = indicator;
      this.clearTimer();
      this.tooltipShow = true;
      this.timer = setTimeout(() => {
        this.tooltipShow = false;
      }, 5000);
    },
    onDotTap(index) {
      this.tooltipHandle(index);
      this.$emit('click', {
        datasetIndex: index
      });
    }
  }
};
</script>

<style scoped>
.tui-charts__radar-box {
  position: relative;
}

.tui-charts-radar {
  border-radius: 50%;
  position: relative;
  transform: rotate(0deg);
}

.tui-radar__mrgin {
  margin-top: 32rpx;
  margin-bottom: 32rpx;
}

.tui-radar__radius {
  /* width: 1px; */
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  transform-origin: 50% 100%;
}

.tui-radar__name {
  min-width: 120rpx;
  font-size: 24rpx;
  position: absolute;
  top: -20rpx;
  left: 50%;
  transform: translate(-50%, -100%);
  text-align: center;
}

.tui-radar__center {
  position: absolute;
  /* width: 2px;
		height: 2px; */
  left: 50%;
  top: 50%;
  transform: translate(0, -50%);
}

.tui-radar__hypotenuse,
.tui-radar__dataset {
  /* height: 1px; */
  position: absolute;
  transform-origin: 0 50%;
  z-index: 2;
}

.tui-radar__dataset {
  z-index: 3;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
}

.tui-radar__dot {
  height: 6px;
  width: 6px;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 5;
  transform: translate(-50%, -50%) rotate(0);
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
}

.tui-radar__legend {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-bottom: 24rpx;
}

.tui-radar__legend-item {
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

.tui-radar__tooltip {
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

.tui-tooltip__title {
  font-size: 30rpx;
  color: #fff;
  line-height: 30rpx;
}

.tui-radar__tooltip-show {
  visibility: visible;
  opacity: 1;
}

.tui-radar__tooltip-item {
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
