<template>
  <view
    class="tui-row__box"
    :class="[isFlex ? 'tui-row__flex' : '', justifyClass, alignClass]"
    :style="{ marginTop: marginTop, marginBottom: marginBottom, marginLeft: `${Number(marginValue)}rpx`, marginRight: `${Number(marginValue)}rpx` }"
  >
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'tuiRow',
  props: {
    //是否为flex布局
    isFlex: {
      type: Boolean,
      default: false
    },
    //flex 布局下的水平排列方式 start/end/center/space-around/space-between
    justify: {
      type: String,
      default: 'start'
    },
    //flex 布局下的垂直排列方式	top/middle/bottom
    align: {
      type: String,
      default: 'top'
    },
    marginTop: {
      type: String,
      default: '0'
    },
    marginBottom: {
      type: String,
      default: '0'
    },
    //栅格间间隔，单位rpx,非Nvue端有效
    gutter: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      flex: false
    };
  },
  watch: {
    isFlex(val) {
      // #ifndef APP-NVUE
      this.flex = val;
      // #endif
    }
  },
  created() {
    // #ifndef APP-NVUE
    this.flex = this.isFlex;
    // #endif
    // #ifdef APP-NVUE
    this.flex = true;
    // #endif
  },
  computed: {
    marginValue() {
      // #ifndef APP-NVUE
      if (this.gutter) {
        return -(this.gutter / 2);
      }
      // #endif
      return 0;
    },
    justifyClass() {
      return this.justify !== 'start' ? `tui-row__${this.justify}` : '';
    },
    alignClass() {
      return this.align !== 'top' ? `tui-row__${this.align}` : '';
    }
  }
};
</script>

<style scoped>
/* #ifdef MP-WEIXIN || MP-TOUTIAO || MP-QQ */
:host {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  display: block;
}

/* #endif */
.tui-row__box {
  /* #ifdef APP-NVUE */
  width: 750rpx;
  /* #endif */
  /* #ifndef APP-NVUE */
  width: 100%;
  box-sizing: border-box;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  /* #endif */
  position: relative;
  /* #ifdef MP-TOUTIAO || MP-QQ || MP-BAIDU */
  display: block;
  /* #endif */
}

.tui-row__box::before,
.tui-row__box::after {
  display: table;
  /* #ifndef APP-NVUE */
  content: ' ';
  /* #endif */
}

.tui-row__box::after {
  clear: both;
}

.tui-row__flex {
  /* #ifndef APP-NVUE*/
  display: flex !important;
  /* #endif */
  flex-direction: row;
}

.tui-row__middle {
  align-items: center;
}

.tui-row__bottom {
  align-items: flex-end;
}

.tui-row__before {
  display: table;
}

.tui-row__end {
  justify-content: flex-end;
}

.tui-row__center {
  justify-content: center;
}

.tui-row__space-around {
  justify-content: space-around;
}

.tui-row__space-between {
  justify-content: space-between;
}
</style>
