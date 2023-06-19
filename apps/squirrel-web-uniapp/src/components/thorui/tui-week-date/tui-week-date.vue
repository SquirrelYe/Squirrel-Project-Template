<template>
  <view class="tui-week-date" :style="{ background: background }">
    <view class="tui-arrow--box" @tap.stop="prevWeek">
      <slot name="left"></slot>
      <view v-if="arrow" class="tui-left--arrow" :style="{ 'border-right-color': getArrowColor }"></view>
    </view>
    <view class="tui-week--item" @tap.stop="dateClick(index)" v-for="(item, index) in weeksArr" :key="index">
      <view class="tui-week--label" :style="{ fontSize: weekSize + 'rpx', color: weekColor }">{{ item.week }}</view>
      <view
        class="tui-week--value"
        :style="{ fontSize: dateSize + 'rpx', color: activeDate == item.date ? activeColor : dateColor, background: activeDate == item.date ? getActiveBackground : 'transparent' }"
      >
        {{ formatNum(item.day) }}
      </view>
    </view>
    <view class="tui-arrow--box" @tap.stop="nextWeek">
      <slot name="right"></slot>
      <view v-if="arrow" class="tui-right--arrow" :style="{ 'border-left-color': getArrowColor }"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'tui-week-date',
  emits: ['click'],
  props: {
    //显示指定日期：2022-10-01 或 2022/10/01
    value: {
      type: String,
      default: ''
    },
    background: {
      type: String,
      default: '#fff'
    },
    weekSize: {
      type: [Number, String],
      default: 26
    },
    weekColor: {
      type: String,
      default: '#888'
    },
    dateSize: {
      type: [Number, String],
      default: 34
    },
    dateColor: {
      type: String,
      default: '#333'
    },
    activeColor: {
      type: String,
      default: '#fff'
    },
    activeBackground: {
      type: String,
      default: ''
    },
    arrow: {
      type: Boolean,
      default: true
    },
    arrowColor: {
      type: String,
      default: ''
    }
  },
  computed: {
    getActiveBackground() {
      return this.activeBackground || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    },
    getArrowColor() {
      return this.arrowColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    }
  },
  data() {
    return {
      weeksArr: [],
      activeDate: ''
    };
  },
  watch: {
    value(val) {
      if (val) {
        this.initDate(val);
      }
    }
  },
  created() {
    this.initDate(this.value);
  },
  methods: {
    //初始化显示日期
    initDate(date) {
      let d = [];
      if (date) {
        d = date.replace(/\-/g, '/').split('/');
      } else {
        let now = new Date();
        d = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
      }
      let year = Number(d[0]);
      let month = Number(d[1]);
      let day = Number(d[2]);
      this.activeDate = `${year}-${this.formatNum(month)}-${this.formatNum(day)}`;
      this.getWeekArr(year, month, day);
    },
    formatNum: function (num) {
      return num < 10 ? '0' + num : num + '';
    },
    //返回星期0-6 星期日-星期六
    getWeekday(year, month, day) {
      let date = new Date(`${year}/${month}/${day} 00:00:00`);
      return date.getDay();
    },
    getDate(date, d) {
      let dd = new Date(date);
      let timestamp = new Date(dd).setDate(dd.getDate() + d);
      let nd = new Date(timestamp);
      return [nd.getFullYear(), nd.getMonth() + 1, nd.getDate()];
    },
    getWeeksArr(date, arr) {
      let weeksArr = [];
      let weeks = ['一', '二', '三', '四', '五', '六', '日'];
      arr.forEach((item, index) => {
        let d = this.getDate(date, item);
        weeksArr.push({
          year: d[0],
          month: d[1],
          day: d[2],
          week: weeks[index],
          date: `${d[0]}-${this.formatNum(d[1])}-${this.formatNum(d[2])}`
        });
      });
      return weeksArr;
    },
    getWeekArr(year, month, day) {
      let weekday = this.getWeekday(year, month, day);
      let arr = [
        [-6, -5, -4, -3, -2, -1, 0],
        [0, 1, 2, 3, 4, 5, 6],
        [-1, 0, 1, 2, 3, 4, 5],
        [-2, -1, 0, 1, 2, 3, 4],
        [-3, -2, -1, 0, 1, 2, 3],
        [-4, -3, -2, -1, 0, 1, 2],
        [-5, -4, -3, -2, -1, 0, 1]
      ][weekday];
      let date = `${year}/${month}/${day} 00:00:00`;
      this.weeksArr = this.getWeeksArr(date, arr);
    },
    nextWeek() {
      let item = this.weeksArr[this.weeksArr.length - 1];
      let date = `${item.year}/${item.month}/${item.day} 00:00:00`;
      let d = this.getDate(date, 1);
      this.weeksArr = this.getWeeksArr(`${d[0]}/${d[1]}/${d[2]} 00:00:00`, [0, 1, 2, 3, 4, 5, 6]);
    },
    prevWeek() {
      let item = this.weeksArr[0];
      let date = `${item.year}/${item.month}/${item.day} 00:00:00`;
      let d = this.getDate(date, -1);
      this.weeksArr = this.getWeeksArr(`${d[0]}/${d[1]}/${d[2]} 00:00:00`, [-6, -5, -4, -3, -2, -1, 0]);
    },
    dateClick(index) {
      let item = this.weeksArr[index];
      this.activeDate = item.date;
      this.$emit('click', item);
    }
  }
};
</script>

<style scoped>
.tui-week-date {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 14rpx;
  box-sizing: border-box;
}

.tui-week--item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
}

.tui-week--label {
  text-align: center;
  padding-bottom: 8rpx;
}

.tui-week--value {
  text-align: center;
  width: 64rpx;
  height: 64rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.tui-arrow--box {
  padding: 16rpx 4rpx;
  flex-shrink: 0;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
}

.tui-left--arrow {
  border: 16rpx solid;
  width: 0;
  height: 0;
  border-color: transparent #5677fc transparent transparent;
}

.tui-right--arrow {
  border: 16rpx solid;
  width: 0;
  height: 0;
  border-color: transparent transparent transparent #5677fc;
}
</style>
