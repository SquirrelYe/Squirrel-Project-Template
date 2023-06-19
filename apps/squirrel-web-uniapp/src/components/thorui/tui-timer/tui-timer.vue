<template>
  <view class="tui-timer__box">
    <view
      class="tui-timer__item"
      :style="{
        background: backgroundColor,
        border: borderWidth > 0 ? `${borderWidth}rpx solid ${borderColor}` : 0,
        width: backgroundColor == 'transparent' && borderColor == 'transparent' ? 'auto' : getWidth(d, width) + 'rpx',
        height: height + 'rpx',
        fontSize: size + 'rpx',
        color: color
      }"
      v-if="isDays"
    >
      {{ d }}
    </view>
    <view class="tui-timer__colon" :style="{ lineHeight: colonSize + 'rpx', fontSize: colonSize + 'rpx', color: colonColor }" v-if="isDays">天</view>
    <view
      class="tui-timer__item"
      :style="{
        background: backgroundColor,
        border: borderWidth > 0 ? `${borderWidth}rpx solid ${borderColor}` : 0,
        width: getWidth(d, width) + 'rpx',
        height: height + 'rpx',
        fontSize: size + 'rpx',
        color: color
      }"
      v-if="isHours"
    >
      {{ h }}
    </view>
    <view class="tui-timer__colon" :style="{ lineHeight: colonSize + 'rpx', fontSize: colonSize + 'rpx', color: colonColor }" v-if="isHours">{{ isColon ? ':' : '时' }}</view>
    <view
      class="tui-timer__item"
      :style="{
        background: backgroundColor,
        border: borderWidth > 0 ? `${borderWidth}rpx solid ${borderColor}` : 0,
        width: getWidth(d, width) + 'rpx',
        height: height + 'rpx',
        fontSize: size + 'rpx',
        color: color
      }"
      v-if="isMinutes"
    >
      {{ m }}
    </view>
    <view class="tui-timer__colon" :style="{ lineHeight: colonSize + 'rpx', fontSize: colonSize + 'rpx', color: colonColor }" v-if="isMinutes">{{ isColon ? ':' : '分' }}</view>
    <view
      class="tui-timer__item"
      :style="{
        background: backgroundColor,
        border: borderWidth > 0 ? `${borderWidth}rpx solid ${borderColor}` : 0,
        width: getWidth(d, width) + 'rpx',
        height: height + 'rpx',
        fontSize: size + 'rpx',
        color: color
      }"
      v-if="isSeconds"
    >
      {{ s }}
    </view>
    <view class="tui-timer__colon" :style="{ lineHeight: colonSize + 'rpx', fontSize: colonSize + 'rpx', color: colonColor }" v-if="isSeconds">{{ isColon ? '' : '秒' }}</view>
    <view class="tui-timer__colon" :style="{ lineHeight: colonSize + 'rpx', fontSize: colonSize + 'rpx', color: colonColor }" v-if="isSeconds && isMs">.</view>
    <view
      class="tui-timer__ms"
      :style="{
        background: backgroundColor,
        border: borderWidth > 0 ? `${borderWidth}rpx solid ${borderColor}` : 0,
        fontSize: msSize + 'rpx',
        color: msColor,
        height: height + 'rpx',
        width: msWidth > 0 ? msWidth + 'rpx' : 'auto'
      }"
      v-if="isSeconds && isMs"
    >
      <view :class="{ 'tui-ms__list': ani }">
        <view class="tui-ms__item" :style="{ height: height + 'rpx' }" v-for="(item, index) in ms" :key="index">{{ item }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'tuiTimer',
  emits: ['end'],
  props: {
    //数字框宽度
    width: {
      type: Number,
      default: 36
    },
    //数字框高度
    height: {
      type: Number,
      default: 36
    },
    borderWidth: {
      type: Number,
      default: 0
    },
    //数字框border颜色
    borderColor: {
      type: String,
      default: 'transparent'
    },
    //数字框背景颜色
    backgroundColor: {
      type: String,
      default: 'transparent'
    },
    //数字框字体大小
    size: {
      type: Number,
      default: 32
    },
    //数字框字体颜色
    color: {
      type: String,
      default: '#333'
    },
    //冒号或文字大小
    colonSize: {
      type: Number,
      default: 32
    },
    //冒号或文字颜色
    colonColor: {
      type: String,
      default: '#333'
    },
    //初始时间，单位s
    value: {
      type: [Number, String],
      default: 0
    },
    //最大时间，大于等于最大时间则计时结束，为0则需要手动结束 (单位：秒)
    maxTime: {
      type: Number,
      default: 0
    },
    //是否显示天
    isDays: {
      type: Boolean,
      default: false
    },
    //是否显示小时
    isHours: {
      type: Boolean,
      default: true
    },
    //是否显示分钟
    isMinutes: {
      type: Boolean,
      default: true
    },
    //是否显示秒数
    isSeconds: {
      type: Boolean,
      default: true
    },
    //是否显示毫秒
    isMs: {
      type: Boolean,
      default: false
    },
    msWidth: {
      type: Number,
      default: 0
    },
    msSize: {
      type: Number,
      default: 28
    },
    msColor: {
      type: String,
      default: '#333'
    },
    //时分秒是否展示为冒号,false为文字
    isColon: {
      type: Boolean,
      default: true
    },
    //是否自动开始(传值false，则需要手动调用方法)
    start: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      d: '0',
      h: '00',
      m: '00',
      s: '00',
      ms: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      seconds: 0,
      loop: null,
      ani: false
    };
  },
  created() {
    this.seconds = Number(this.value);
    this.timer(this.seconds);
    if (this.start) {
      this.startTiming();
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
  watch: {
    value(val) {
      this.clearTimer();
      this.seconds = Number(val);
      this.timer(this.seconds);
      setTimeout(() => {
        if (this.start) {
          this.startTiming();
        }
      }, 0);
    }
  },
  methods: {
    getWidth(num, width) {
      return num > 99 ? (width / 2) * num.toString().length : width;
    },
    clearTimer() {
      this.ani = false;
      clearInterval(this.loop);
      this.loop = null;
    },
    //开始
    startTiming() {
      if (this.seconds >= this.maxTime && this.maxTime != 0) {
        this.endTimer();
        return;
      }
      this.clearTimer();
      this.ani = true;
      this.loop = setInterval(() => {
        this.seconds++;
        this.timer(this.seconds);
        if (this.seconds >= this.maxTime && this.maxTime != 0) {
          this.endTimer();
        }
      }, 1000);
    },
    //重置
    resetTimer() {
      this.d = '0';
      this.h = '00';
      this.m = '00';
      this.s = '00';
      this.seconds = 0;
      this.clearTimer();
      setTimeout(() => {
        this.startTiming();
      }, 0);
    },
    //结束 | 暂停
    endTimer() {
      this.clearTimer();
      this.$emit('end', {
        day: this.d,
        hour: this.h,
        minute: this.m,
        second: this.s,
        totalSeconds: this.seconds
      });
    },
    timer(seconds) {
      let [day, hour, minute, second] = [0, 0, 0, 0];
      if (seconds > 0) {
        day = this.isDays ? Math.floor(seconds / (60 * 60 * 24)) : 0;
        hour = this.isHours ? Math.floor(seconds / (60 * 60)) - day * 24 : 0;
        minute = this.isMinutes ? Math.floor(seconds / 60) - hour * 60 - day * 24 * 60 : 0;
        second = this.isSeconds ? Math.floor(seconds) - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60 : 0;
      }
      hour = hour < 10 ? '0' + hour : hour;
      minute = minute < 10 ? '0' + minute : minute;
      second = second < 10 ? '0' + second : second;
      this.d = day;
      this.h = hour;
      this.m = minute;
      this.s = second;
    }
  }
};
</script>

<style scoped>
.tui-timer__box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tui-timer__item,
.tui-timer__colon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6rpx;
}

.tui-timer__ms {
  overflow: hidden;
  border-radius: 6rpx;
}

/*ms使用css3代替js频繁更新操作，性能优化*/
.tui-ms__list {
  animation: loop 1s steps(10) infinite;
}

@keyframes loop {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-100%);
  }
}

.tui-ms__item {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
