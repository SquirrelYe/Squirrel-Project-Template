<template>
  <view class="tui-numberbox">
    <view class="tui-num__icon__box" :style="{ background: iconBgColor, borderRadius: radius }" @tap="reduce" :class="[disabled || min >= inputValue ? 'tui-disabled' : '']">
      <text class="tui-numbox-icon tui-num__icon-reduce" :style="{ color: iconColor, fontSize: iconSize + 'rpx', lineHeight: iconSize + 'rpx' }"></text>
    </view>
    <input
      type="number"
      v-model="inputValue"
      :disabled="disabled"
      @blur="blur"
      class="tui-num-input"
      :style="{ color: color, fontSize: size + 'rpx', background: backgroundColor, height: height + 'rpx', minHeight: height + 'rpx', width: width + 'rpx' }"
    />
    <view class="tui-num__icon__box" :style="{ background: iconBgColor, borderRadius: radius }" @tap="plus" :class="[disabled || inputValue >= max ? 'tui-disabled' : '']">
      <text class="tui-numbox-icon tui-num__icon-plus" :style="{ color: iconColor, fontSize: iconSize + 'rpx', lineHeight: iconSize + 'rpx' }"></text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'tuiNumberbox',
  emits: ['change'],
  props: {
    value: {
      type: [Number, String],
      default: 1
    },
    //最小值
    min: {
      type: Number,
      default: 1
    },
    //最大值
    max: {
      type: Number,
      default: 99
    },
    //迈步大小 1 1.1 10...
    step: {
      type: Number,
      default: 1
    },
    //是否禁用操作
    disabled: {
      type: Boolean,
      default: false
    },
    iconBgColor: {
      type: String,
      default: 'transparent'
    },
    radius: {
      type: String,
      default: '50%'
    },
    //加减图标大小 rpx
    iconSize: {
      type: Number,
      default: 22
    },
    iconColor: {
      type: String,
      default: '#666666'
    },
    //input 高度
    height: {
      type: Number,
      default: 42
    },
    //input 宽度
    width: {
      type: Number,
      default: 80
    },
    size: {
      type: Number,
      default: 28
    },
    //input 背景颜色
    backgroundColor: {
      type: String,
      default: '#F5F5F5'
    },
    //input 字体颜色
    color: {
      type: String,
      default: '#333'
    },
    //索引值，列表中使用
    index: {
      type: [Number, String],
      default: 0
    },
    //自定义参数
    custom: {
      type: [Number, String],
      default: 0
    }
  },
  created() {
    this.inputValue = +this.value;
  },
  data() {
    return {
      inputValue: 0
    };
  },
  watch: {
    value(val) {
      this.inputValue = +val;
    }
  },
  methods: {
    getScale(val, step) {
      let scale = 1;
      let scaleVal = 1;
      //浮点型
      if (!Number.isInteger(step)) {
        scale = Math.pow(10, (step + '').split('.')[1].length);
      }
      //浮点型
      if (!Number.isInteger(val)) {
        scaleVal = Math.pow(10, (val + '').split('.')[1].length);
      }
      return Math.max(scale, scaleVal);
    },
    calcNum: function (type) {
      if (this.disabled || (this.inputValue == this.min && type === 'reduce') || (this.inputValue == this.max && type === 'plus')) {
        return;
      }
      const scale = this.getScale(Number(this.inputValue), Number(this.step));
      let num = Number(this.inputValue) * scale;
      let step = this.step * scale;
      if (type === 'reduce') {
        num -= step;
      } else if (type === 'plus') {
        num += step;
      }
      let value = Number((num / scale).toFixed(String(scale).length - 1));
      if (value < this.min) {
        value = this.min;
      } else if (value > this.max) {
        value = this.max;
      }
      this.handleChange(value, type);
    },
    plus: function () {
      this.calcNum('plus');
    },
    reduce: function () {
      this.calcNum('reduce');
    },
    blur: function (e) {
      let value = e.detail.value;
      if (value) {
        if (~value.indexOf('.') && Number.isInteger(this.step) && Number.isInteger(Number(value))) {
          value = value.split('.')[0];
        }
        value = Number(value);
        if (value > this.max) {
          value = this.max;
        } else if (value < this.min) {
          value = this.min;
        }
      } else {
        value = this.min;
      }
      if ((value == this.value && value != this.inputValue) || !e.detail.value) {
        this.inputValue = value;
      }
      this.handleChange(value, 'blur');
    },
    handleChange(value, type) {
      if (this.disabled) return;
      this.$emit('change', {
        value: Number(value),
        type: type,
        index: this.index,
        custom: this.custom
      });
    }
  }
};
</script>

<style scoped>
@font-face {
  font-family: 'numberbox';
  src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAASQAA0AAAAABtwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAEdAAAABoAAAAciBpnRUdERUYAAARUAAAAHgAAAB4AKQALT1MvMgAAAZwAAABDAAAAVjxzSINjbWFwAAAB9AAAAEYAAAFK5zLpOGdhc3AAAARMAAAACAAAAAj//wADZ2x5ZgAAAkgAAACHAAAAnIfIEjxoZWFkAAABMAAAAC8AAAA2FZWEOWhoZWEAAAFgAAAAHAAAACQH3gOFaG10eAAAAeAAAAARAAAAEgwAAAFsb2NhAAACPAAAAAwAAAAMADAATm1heHAAAAF8AAAAHwAAACABEAAobmFtZQAAAtAAAAFJAAACiCnmEVVwb3N0AAAEHAAAAC0AAABV/+8iFXjaY2BkYGAA4gVmC5Tj+W2+MnCzMIDATWsFOQT9v5GFgbkeyOVgYAKJAgDrogf+AHjaY2BkYGBu+N/AEMPCAAJAkpEBFbAAAEcKAm142mNgZGBgYGWQYQDRDAxMQMwFhAwM/8F8BgALpAE5AHjaY2BkYWCcwMDKwMDUyXSGgYGhH0IzvmYwYuQAijKwMjNgBQFprikMDs9Yn01kbvjfwBDD3MDQABRmBMkBAOXpDHEAeNpjYYAAFghmZGAAAACdAA4AAAB42mNgYGBmgGAZBkYGEHAB8hjBfBYGDSDNBqQZGZiesT6b+P8/AwOElvwnWQxVDwSMbAxwDiMTkGBiQAWMDMMeAABRZwszAAAAAAAAAAAAAAAwAE542iWKQQrCMBBF5xNpd0pQ7EIoTEnahSCTUNqdWz2A9TrieXKeXCc1qcPn/zfzh0BYv2pVH7oQgbvqdG5Yt/DTrNlPYz+wHvuuqhFSME4sFshTgKUsKfhH5lg8BSul3i5bS3mQdd0RIh2IjnvUrkXDd8zuhuFt86tY9fonIsSYgsXpB+cCGosAeNp9kD1OAzEQhZ/zByQSQiCoXVEA2vyUKRMp9Ailo0g23pBo1155nUg5AS0VB6DlGByAGyDRcgpelkmTImvt6PObmeexAZzjGwr/3yXuhBWO8ShcwREy4Sr1F+Ea+V24jhY+hRvUf4SbuFUD4RYu1BsdVO2Eu5vSbcsKZxgIV3CKJ+Eq9ZVwjfwqXMcVPoQb1L+EmxjjV7iFa2WpDOFhMEFgnEFjig3jAjEcLJIyBtahOfRmEsxMTzd6ETubOBso71dilwMeaDnngCntPbdmvkon/mDLgdSYbh4FS7YpjS4idCgbXyyc1d2oc7D9nu22tNi/a4E1x+xRDWzU/D3bM9JIbAyvkJI18jK3pBJTj2hrrPG7ZynW814IiU68y/SIx5o0dTr3bmniwOLn8owcfbS5kj33qBw+Y1kIeb/dTsQgil2GP5PYcRkAAAB42mNgYoAALjDJyIAOWMGiTIxMjMwiWZmJQJRXVQoigTgjMd9QGIsgAFDsEBsAAAAAAAAB//8AAgABAAAADAAAABYAAAACAAEAAwAEAAEABAAAAAIAAAAAeNpjYGBgZACCq0vUOUD0TWsFORgNADPBBE4AAA==)
    format('woff');
  font-weight: normal;
  font-style: normal;
}

.tui-num__icon__box {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 12rpx;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
}

.tui-numbox-icon {
  font-family: 'numberbox' !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.tui-num__icon-reduce:before {
  content: '\e691';
}

.tui-num__icon-plus:before {
  content: '\e605';
}

.tui-numberbox {
  /* #ifndef APP-NVUE */
  display: inline-flex;
  /* #endif */
  align-items: center;
}

.tui-num-input {
  text-align: center;
  margin: 0 6rpx;
  font-weight: 400;
  padding: 0;
  border-width: 0;
}
/* #ifdef H5 */
::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* #endif */

.tui-disabled {
  opacity: 0.5;
  /* #ifdef H5 */
  cursor: not-allowed;
  /* #endif */
}
</style>
