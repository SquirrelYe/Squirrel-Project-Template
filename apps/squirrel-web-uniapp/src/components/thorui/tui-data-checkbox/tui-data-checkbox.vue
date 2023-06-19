<template>
  <view class="tui-data-checkbox" :style="{ marginBottom: '-' + gap + 'rpx' }">
    <view
      class="tui-data__cb-item"
      :class="{ 'tui-data__cb-disabled': item.disable }"
      :style="{
        width: width ? width + 'rpx' : 'auto',
        padding: padding,
        borderRadius: radius,
        marginRight: gap + 'rpx',
        marginBottom: gap + 'rpx',
        background: item.checked ? activeBgColor : background,
        borderColor: item.checked ? getBorderColor : defaultBorderColor || background
      }"
      v-for="(item, index) in itemList"
      :key="index"
      @tap.stop="itemTap(index)"
    >
      <text class="tui-cb__text" :style="{ fontSize: size + 'rpx', lineHeight: size + 'rpx', color: item.checked ? getActiveColor : color }">{{ item.text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'tui-data-checkbox',
  emits: ['change', 'input', 'update:modelValue'],
  props: {
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    // #ifdef VUE3
    modelValue: {
      type: [Array, String, Number],
      default() {
        return [];
      }
    },
    // #endif
    value: {
      type: [Array, String, Number],
      default() {
        return [];
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    //最小选择数，仅单选时有效，可选值0、1
    min: {
      type: [Number, String],
      default: 1
    },
    //最大选择数
    max: {
      type: [Number, String],
      default: -1
    },
    width: {
      type: [Number, String],
      default: 0
    },
    padding: {
      type: String,
      default: '20rpx 32rpx'
    },
    gap: {
      type: [Number, String],
      default: 20
    },
    radius: {
      type: String,
      default: '8rpx'
    },
    size: {
      type: [Number, String],
      default: 24
    },
    color: {
      type: String,
      default: '#333'
    },
    activeColor: {
      type: String,
      default: ''
    },
    background: {
      type: String,
      default: '#fff'
    },
    activeBgColor: {
      type: String,
      default: 'rgba(86, 119, 252, 0.1)'
    },
    defaultBorderColor: {
      type: String,
      default: ''
    },
    borderColor: {
      type: String,
      default: ''
    }
  },
  computed: {
    getActiveColor() {
      return this.activeColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    },
    getBorderColor() {
      return this.borderColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    }
  },
  watch: {
    options(vals) {
      //value,text,disable
      this.initData(vals);
    },
    // #ifdef VUE3
    modelValue(vals) {
      this.modelChange(vals);
    },
    // #endif
    value(vals) {
      this.modelChange(vals);
    }
  },
  created() {
    this.initData(this.options);
  },
  data() {
    return {
      itemList: [],
      singleVal: '',
      vals: []
    };
  },
  methods: {
    initData(vals) {
      vals = JSON.parse(JSON.stringify(vals));
      if (vals && vals.length > 0) {
        if (typeof vals[0] !== 'object') {
          vals = vals.map((item, index) => {
            return {
              text: item,
              value: item,
              checked: false
            };
          });
        } else {
          vals.map((item, index) => {
            item.checked = false;
            if (item.value === undefined) {
              item.value = item.text;
            }
          });
        }
        this.itemList = vals;
        // #ifdef VUE3
        this.modelChange(this.modelValue);
        // #endif

        // #ifndef VUE3
        this.modelChange(this.value);
        // #endif
      }
    },
    emitsChange(e) {
      this.$emit('change', e);
      this.$emit('input', e.detail.value);
      // #ifdef VUE3
      this.$emit('update:modelValue', e.detail.value);
      // #endif
    },
    radioChange(index, model) {
      let min = Number(this.min);
      if (this.singleVal === model.value && min > 0) return;
      let val = '';
      let i = index;
      this.itemList.forEach((item, idx) => {
        if (idx === index) {
          const bool = this.singleVal === item.value && min <= 0;
          val = bool ? '' : item.value;
          i = bool ? -1 : index;
          item.checked = bool ? false : true;
        } else {
          item.checked = false;
        }
      });
      this.singleVal = val;
      let e = {
        detail: {
          index: i,
          value: val
        }
      };
      this.emitsChange(e);
    },
    checkboxChange(index, model) {
      let max = Number(this.max);
      let vals = this.vals;
      let i = vals.indexOf(model.value);
      if (vals.length >= max && max !== -1 && i === -1) {
        uni.showToast({
          title: '已超出最大选择数！',
          icon: 'none'
        });
        return;
      }
      this.itemList.forEach((item, idx) => {
        if (idx === index) {
          item.checked = i !== -1 ? false : true;
          if (item.checked) {
            vals.push(item.value);
          } else {
            vals.splice(i, 1);
          }
        }
      });
      this.vals = vals;
      let e = {
        detail: {
          value: vals
        }
      };
      this.emitsChange(e);
    },
    itemTap(index) {
      let item = this.itemList[index];
      if (item.disable) return;
      if (this.multiple) {
        this.checkboxChange(index, item);
      } else {
        this.radioChange(index, item);
      }
    },
    modelChange(vals) {
      if (this.multiple) {
        this.itemList.forEach(item => {
          if (vals.includes(item.value)) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
        this.vals = vals;
      } else {
        this.itemList.forEach(item => {
          if (vals == item.value) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
        this.singleVal = vals;
      }
    }
  }
};
</script>

<style scoped>
.tui-data-checkbox {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.tui-data__cb-item {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  border: 1px solid;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
  box-sizing: border-box;
}

.tui-cb__text {
  display: block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tui-data__cb-disabled {
  /* #ifdef H5 */
  cursor: not-allowed;
  /* #endif */
  opacity: 0.5;
}

.tui-cb-checkmark {
  width: 20rpx;
  height: 40rpx;
  border-bottom-style: solid;
  border-bottom-width: 3px;
  border-bottom-color: #ffffff;
  border-right-style: solid;
  border-right-width: 3px;
  border-right-color: #ffffff;
  transform: rotate(45deg) scale(0.5);
  transform-origin: 54% 48%;
  /* #ifndef APP-NVUE */
  box-sizing: border-box;
  /* #endif */
  margin-right: 12rpx;
}
</style>
