<template>
  <view
    class="tui-alert__wrap"
    :style="{
      backgroundColor: backgroundColor ? backgroundColor : getColor(type),
      borderRadius: radius,
      paddingTop: padding[0] || 0,
      paddingRight: padding[1] || 0,
      paddingBottom: padding[2] || padding[0] || 0,
      paddingLeft: padding[3] || padding[1] || 0
    }"
  >
    <view class="tui-alert__shrink" @tap.stop="leftClick">
      <slot name="left"></slot>
      <icon :type="type" :size="iconSize" :color="iconColor" v-if="!isLeft"></icon>
    </view>
    <view class="tui-alert__content" :class="{ 'tui-text__p-left': !isLeft, 'tui-text__p-right': closable }" @tap.stop="onClick">
      <text class="tui-alert__text" :style="{ fontSize: size, color: color }" v-if="title">{{ title }}</text>
      <text class="tui-alert__text tui-desc__padding" :class="{ 'tui-alert__single': single }" :style="{ fontSize: descSize, color: descColor }" v-if="desc">{{ desc }}</text>
      <slot name="content"></slot>
    </view>
    <view class="tui-alert__shrink">
      <slot name="right"></slot>
    </view>
    <icon @tap.stop="close" type="cancel" :size="closeSize" :color="closeColor" v-if="closable" :class="{ 'tui-alert__icon-close': desc }"> </icon>
  </view>
</template>

<script>
export default {
  name: 'tui-alerts',
  emits: ['leftClick', 'click', 'close'],
  props: {
    //info, success, warn, waiting,clear
    type: {
      type: String,
      default: 'info'
    },
    //背景色，如果设置type对应颜色失效
    backgroundColor: {
      type: String,
      default: ''
    },
    //nvue不支持简写，['20rpx','30rpx','20rpx','30rpx']=>[上，右，下，左]
    padding: {
      type: Array,
      default() {
        return ['20rpx', '30rpx'];
      }
    },
    radius: {
      type: String,
      default: '6rpx'
    },
    iconColor: {
      type: String,
      default: '#fff'
    },
    //icon字体大小，px
    iconSize: {
      type: Number,
      default: 24
    },
    closable: {
      type: Boolean,
      default: false
    },
    closeColor: {
      type: String,
      default: '#fff'
    },
    //关闭icon字体大小，px
    closeSize: {
      type: Number,
      default: 24
    },
    //是否自定义左侧内容
    isLeft: {
      type: Boolean,
      default: false
    },
    isRight: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#fff'
    },
    size: {
      type: String,
      default: '14px'
    },
    desc: {
      type: String,
      default: ''
    },
    descColor: {
      type: String,
      default: '#fff'
    },
    descSize: {
      type: String,
      default: '12px'
    },
    //描述文字单行展示，超出隐藏
    single: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getColor(type) {
      const global = uni && uni.$tui && uni.$tui.color;
      const color = (global && global.primary) || '#5677fc';
      const colors = {
        success: (global && global.success) || '#07c160',
        warn: (global && global.warning) || '#ff7900',
        clear: (global && global.danger) || '#EB0909'
      };
      return colors[type] ? colors[type] : color;
    },
    leftClick() {
      this.$emit('leftClick', {});
    },
    onClick() {
      this.$emit('click', {});
    },
    close() {
      this.$emit('close', {});
    }
  }
};
</script>

<style scoped>
.tui-alert__wrap {
  flex: 1;
  /* #ifndef APP-NVUE */
  display: flex;
  width: 100%;
  box-sizing: border-box;
  /* #endif */
  flex-direction: row;
  align-items: center;
  position: relative;
}

.tui-alert__shrink {
  /* #ifndef APP-NVUE */
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* #endif */
}

.tui-alert__content {
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.tui-alert__text {
  /* #ifndef APP-NVUE */
  word-break: break-all;
  display: block;
  box-sizing: border-box;
  /* #endif */
}

.tui-desc__padding {
  padding-top: 3px;
}

.tui-text__p-left {
  padding-left: 20rpx;
}

.tui-text__p-right {
  padding-right: 60rpx;
}

.tui-alert__single {
  /* #ifdef APP-NVUE */
  lines: 1;
  /* #endif */
  /* #ifndef APP-NVUE */
  display: block;
  width: 100%;
  white-space: nowrap;
  /* #endif */
  flex-direction: row;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tui-alert__icon-close {
  position: absolute;
  right: 30rpx;
  top: 16rpx;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
}
</style>
