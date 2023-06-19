<template>
  <view
    class="tui-checkbox__input"
    :class="{ 'tui-checkbox__disabled': disabled }"
    :style="{ backgroundColor: getBackgroundStyle(val, isCheckMark), border: getBorderStyle(val, isCheckMark), zoom: nvue ? 1 : scaleRatio, transform: `scale(${nvue ? scaleRatio : 1})` }"
    @tap.stop="checkboxChange"
  >
    <view class="tui-check__mark" :style="{ borderBottomColor: checkMarkColor, borderRightColor: checkMarkColor }" v-if="val"></view>
    <checkbox class="tui-checkbox__hidden" style="position: absolute; opacity: 0" hidden :color="color" :disabled="disabled" :value="value" :checked="val"> </checkbox>
  </view>
</template>

<script>
export default {
  name: 'tui-checkbox',
  emits: ['change'],
  options: {
    virtualHost: true
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    checked: {
      type: Boolean,
      default: false
    },
    //当设置checked 属性值时是否触发父级change方法
    triggerGroup: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    //checkbox选中背景颜色
    color: {
      type: String,
      default: ''
    },
    //checkbox未选中时边框颜色
    borderColor: {
      type: String,
      default: '#ccc'
    },
    //是否只展示对号，无边框背景
    isCheckMark: {
      type: Boolean,
      default: false
    },
    //对号颜色
    checkMarkColor: {
      type: String,
      default: '#fff'
    },
    scaleRatio: {
      type: [Number, String],
      default: 1
    }
  },
  created() {
    this.val = this.checked;
    this.group = this.getParent();
    if (this.group) {
      this.group.childrens.push(this);
      if (this.group.value && this.group.value.length > 0) {
        this.val = this.group.value.includes(this.value);
      }
      // #ifdef VUE3
      if (this.group.modelValue && this.group.modelValue.length > 0) {
        this.val = this.group.modelValue.includes(this.value);
      }
      // #endif
    }
    this.label = this.getParent('tui-label');
    if (this.label) {
      this.label.childrens.push(this);
    }
  },
  watch: {
    checked(newVal) {
      this.val = newVal;
    },
    val(newVal) {
      if (this.triggerGroup && this.group) {
        this.group.changeValue(this.val, this);
      }
    }
  },
  data() {
    let nvue = false;
    // #ifdef APP-NVUE
    nvue = true;
    // #endif
    return {
      val: false,
      nvue: nvue
    };
  },
  methods: {
    getBackgroundStyle(val, isCheckMark) {
      const primary = (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
      let color = val ? this.color || primary : '#fff';
      if (isCheckMark) {
        color = 'transparent';
      }
      return color;
    },
    getBorderStyle(val, isCheckMark) {
      const primary = (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
      let color = val ? this.color || primary : this.borderColor;
      if (isCheckMark) {
        color = 'transparent';
      }
      return `1px solid ${color}`;
    },
    checkboxChange(e) {
      if (this.disabled) return;
      this.val = !this.val;
      if (!this.triggerGroup && this.group) {
        this.group.changeValue(this.val, this);
      }
      this.$emit('change', {
        checked: this.val,
        value: this.value
      });
    },
    getParent(name = 'tui-checkbox-group') {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== name) {
        parent = parent.$parent;
        if (!parent) return false;
        parentName = parent.$options.name;
      }
      return parent;
    },
    labelClick() {
      this.checkboxChange();
    }
  }
};
</script>

<style scoped>
.tui-checkbox__input {
  font-size: 0;
  color: rgba(0, 0, 0, 0);
  width: 40rpx;
  height: 40rpx;
  border-width: 1px;
  border-style: solid;
  /* #ifdef APP-NVUE */
  border-radius: 40rpx;
  /* #endif */
  /* #ifndef APP-NVUE */
  display: inline-flex;
  box-sizing: border-box;
  border-radius: 50%;
  vertical-align: top;
  flex-shrink: 0;
  /* #endif */
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.tui-check__mark {
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
}

.tui-checkbox__hidden {
  /* #ifndef APP-NVUE */
  width: 100%;
  height: 100%;
  border: 0 none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  /* #endif */
  /* #ifdef APP-NVUE */
  width: 100wx;
  height: 100wx;
  border-width: 0;
  /* #endif */
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 2;
}

.tui-checkbox__disabled {
  opacity: 0.6;
}
</style>
