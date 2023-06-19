<template>
  <view class="tui-digital__roller">
    <view class="tui-digital__box" v-for="(item, index) in columns" :key="index" :style="{ width: cellWidth, height: height + 'px' }">
      <view class="tui-digital__column" :style="{ transform: `translate3d(0, -${keys[index] * height}px, 0)`, transitionDuration: `${duration}s`, transitionTimingFunction: animation }">
        <view
          class="tui-digital__item"
          v-for="(val, idx) in item"
          :key="idx"
          :style="{ color: getColor, fontSize: size + 'rpx', fontWeight: bold ? 'bold' : 'normal', height: height + 'px', lineHeight: size + 'rpx' }"
        >
          {{ val }}</view
        >
      </view>
    </view>
  </view>
</template>

<script>
var numArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
export default {
  name: 'tuiDigitalRoller',
  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    //rpx
    size: {
      type: Number,
      default: 32
    },
    bold: {
      type: Boolean,
      default: false
    },
    //滚动行高度 rpx
    cellHeight: {
      type: Number,
      default: 32
    },
    //单个数字宽度
    cellWidth: {
      type: String,
      default: 'auto'
    },
    // 动画过渡效果
    animation: {
      type: String,
      default: 'cubic-bezier(0, 1, 0, 1)'
    },
    //动画时间
    duration: {
      type: Number,
      default: 1.2
    }
  },
  watch: {
    value(val) {
      this.initColumn(this.value);
    },
    cellHeight(val) {
      this.handleHeight(val);
    }
  },
  computed: {
    getColor() {
      return this.color || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    }
  },
  data() {
    return {
      columns: [],
      keys: [],
      height: 0
    };
  },
  created() {
    this.handleHeight(this.cellHeight);
    this.initColumn(this.value);
  },
  methods: {
    handleHeight(h) {
      this.height = uni.upx2px(h || 0);
    },
    initColumn(val) {
      val = val + '';
      let vals = val.split('');
      let digit = vals.length,
        arr = [];
      for (let i = 0; i < digit; i++) {
        if (~numArr.indexOf(vals[i])) {
          arr.push(numArr);
        } else {
          arr.push([vals[i]]);
        }
      }
      this.columns = arr;
      this.roll(vals);
    },
    roll(vals) {
      let lengths = this.columns.length,
        indexs = [];

      while (vals.length) {
        let num = vals.pop();
        if (~numArr.indexOf(num)) {
          indexs.unshift(Number(num));
        } else {
          indexs.unshift(0);
        }
      }
      while (indexs.length < lengths) {
        indexs.unshift(0);
      }
      this.keys = indexs;
    }
  }
};
</script>

<style scoped>
.tui-digital__roller {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
}

.tui-digital__box {
  overflow: hidden;
}

.tui-digital__column {
  transform: translate3d(0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.tui-digital__item {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
