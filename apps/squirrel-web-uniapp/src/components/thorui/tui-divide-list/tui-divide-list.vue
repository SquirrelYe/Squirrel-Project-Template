<template>
  <view class="tui-divide-list" :style="{ background: background }">
    <view class="tui-divide--item" @tap="itemTap(index)" :style="{ paddingTop: padding + 'rpx', paddingBottom: padding + 'rpx' }" v-for="(item, index) in list" :key="index">
      <view class="tui-divide--value">
        <view
          class="tui-divide--val"
          v-if="item.value && !item.src"
          :style="{ color: item.valueColor || valueColor, fontSize: (item.valueSize || valueSize) + 'rpx', fontWeight: item.valueFontWeight || valueFontWeight }"
        >
          {{ item.value }}
        </view>
        <image :src="item.src" :style="{ width: (item.width || width) + 'rpx', height: (item.height || height) + 'rpx' }" v-if="item.src"> </image>
        <view :class="[item.isDot ? 'tui-badge-dot' : 'tui-badge']" :style="{ color: badgeColor, background: getBadgeBgColor }" v-if="item.num || item.isDot">
          {{ item.isDot ? '' : item.num }}
        </view>
      </view>
      <view class="tui-divide--text" v-if="item.text" :style="{ color: item.textColor || textColor, fontSize: (item.textSize || textSize) + 'rpx', fontWeight: item.textFontWeight || textFontWeight }">
        {{ item.text }}
      </view>
      <view class="tui-divide--line" :style="{ background: dividerColor, height: dividerHeight + '%', top: getTop }" v-if="divider && index !== list.length - 1"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'tui-divide-list',
  emits: ['click'],
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    background: {
      type: String,
      default: '#fff'
    },
    textSize: {
      type: [Number, String],
      default: 24
    },
    textColor: {
      type: String,
      default: '#999'
    },
    textFontWeight: {
      type: [Number, String],
      default: 400
    },
    valueSize: {
      type: [Number, String],
      default: 32
    },
    valueColor: {
      type: String,
      default: '#333'
    },
    valueFontWeight: {
      type: [Number, String],
      default: 400
    },
    width: {
      type: [Number, String],
      default: 80
    },
    height: {
      type: [Number, String],
      default: 80
    },
    divider: {
      type: Boolean,
      default: true
    },
    dividerColor: {
      type: String,
      default: '#eaeef1'
    },
    //百分比：1~100
    dividerHeight: {
      type: [Number, String],
      default: 60
    },
    padding: {
      type: [Number, String],
      default: 20
    },
    //角标字体颜色
    badgeColor: {
      type: String,
      default: '#fff'
    },
    //角标背景颜色
    badgeBgColor: {
      type: String,
      default: ''
    }
  },
  computed: {
    getTop() {
      let height = Number(this.dividerHeight) || 60;
      return (100 - height) / 2 + '%';
    },
    getBadgeBgColor() {
      return this.badgeBgColor || (uni && uni.$tui && uni.$tui.color.pink) || '#f74d54';
    }
  },
  methods: {
    itemTap(index) {
      this.$emit('click', {
        index
      });
    }
  }
};
</script>

<style scoped>
.tui-divide-list {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tui-divide--item {
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
}

.tui-divide--line {
  position: absolute;
  right: 0;
  width: 1px;
  transform: scaleX(0.5);
  transform-origin: 100% 0;
}

.tui-divide--text {
  padding-top: 8rpx;
}

.tui-divide--value {
  position: relative;
}

.tui-badge {
  position: absolute;
  font-size: 24rpx;
  line-height: 32rpx;
  height: 32rpx;
  min-width: 20rpx;
  padding: 0 6rpx;
  border-radius: 40rpx;
  right: 0;
  top: -8rpx;
  transform: translateX(88%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tui-badge-dot {
  position: absolute;
  height: 16rpx;
  width: 16rpx;
  border-radius: 50%;
  right: -8rpx;
  top: -4rpx;
  flex-shrink: 0;
}
</style>
