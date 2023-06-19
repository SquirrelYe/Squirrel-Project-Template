<template>
  <view class="tui-switch__input" :style="{ zoom: nvue ? 1 : scaleRatio, transform: `scale(${nvue ? scaleRatio : 1})` }">
    <switch v-if="type === 'switch'" :class="{ 'tui-pevents': isLabel }" @change="change" :name="name" :checked="val" :disabled="disabled" :color="getColor"> </switch>
    <view
      class="tui-checkbox__self"
      :class="{ 'tui-checkbox__disabled': disabled }"
      :style="{ backgroundColor: val ? getColor : '#fff', border: val ? `1px solid ${getColor}` : `1px solid ${borderColor}` }"
      v-else
    >
      <view class="tui-check__mark" :style="{ borderBottomColor: checkMarkColor, borderRightColor: checkMarkColor }" v-if="val"></view>
      <switch
        class="tui-switch__hidden"
        :class="{ 'tui-pevents': isLabel }"
        style="position: absolute; opacity: 0"
        @change="change"
        :name="name"
        type="checkbox"
        :checked="val"
        :disabled="disabled"
      ></switch>
    </view>
  </view>
</template>

<script>
export default {
  name: 'tui-switch',
  emits: ['change'],
  // #ifdef MP-WEIXIN
  behaviors: ['wx://form-field-group'],
  // #endif
  // #ifdef MP-BAIDU || MP-QQ
  behaviors: ['uni://form-field'],
  // #endif
  props: {
    //开关选择器名称
    name: {
      type: String,
      default: ''
    },
    checked: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    //样式，有效值：switch, checkbox
    type: {
      type: String,
      default: 'switch'
    },
    //switch选中颜色
    color: {
      type: String,
      default: ''
    },
    //边框颜色，type=checkbox时生效
    borderColor: {
      type: String,
      default: '#ccc'
    },
    //对号颜色，type=checkbox时生效
    checkMarkColor: {
      type: String,
      default: '#fff'
    },
    scaleRatio: {
      type: [Number, String],
      default: 1
    }
  },
  computed: {
    getColor() {
      return this.color || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    }
  },
  data() {
    let nvue = false;
    // #ifdef APP-NVUE
    nvue = true;
    // #endif
    return {
      val: false,
      nvue: nvue,
      isLabel: false
    };
  },
  watch: {
    checked(val) {
      this.val = val;
    }
  },
  created() {
    this.val = this.checked;
    this.label = this.getParent();
    if (this.label) {
      this.isLabel = true;
      this.label.childrens.push(this);
    }
  },
  methods: {
    change(e, label) {
      if (this.label && !label) return;
      this.val = e.detail.value;
      this.$emit('change', e);
    },
    labelClick() {
      if (this.disabled) return;
      let e = {
        detail: {
          value: !this.val
        }
      };
      this.change(e, true);
    },
    getParent(name = 'tui-label') {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== name) {
        parent = parent.$parent;
        if (!parent) return false;
        parentName = parent.$options.name;
      }
      return parent;
    }
  }
};
</script>

<style scoped>
/* #ifndef APP-NVUE */
.tui-switch__input {
  display: inline-block;
}

/* #endif */
.tui-checkbox__self {
  font-size: 0;
  width: 40rpx;
  height: 40rpx;
  /* #ifdef APP-NVUE */
  border-radius: 40rpx;
  /* #endif */
  /* #ifndef APP-NVUE */
  border-radius: 50%;
  display: inline-flex;
  box-sizing: border-box;
  vertical-align: top;
  /* #endif */
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

/* #ifdef H5 || APP-VUE */
::v-deep .uni-switch-input {
  margin-right: 0 !important;
}

/* #endif */

/* #ifdef APP-NVUE */
.uni-switch-input {
  margin-right: 0 !important;
}

/* #endif */

/* #ifdef MP-WEIXIN */
.wx-switch-input {
  margin-right: 0 !important;
}

/* #endif */

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

.tui-switch__hidden {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 2;
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
}

/* #ifdef H5 */
.tui-pevents {
  pointer-events: none;
}

/* #endif */

.tui-checkbox__disabled {
  opacity: 0.6;
}
</style>
