<template>
  <view class="tui-searchbar__box" :style="{ backgroundColor: backgroundColor, padding: padding }">
    <view class="tui-search-bar__form" :style="{ height: height }">
      <view class="tui-search-bar__box" :style="{ height: height, borderRadius: radius, backgroundColor: inputBgColor }" v-if="showInput">
        <icon class="tui-icon-search" type="search" :size="searchSize"></icon>
        <input
          type="text"
          class="tui-search-bar__input"
          :placeholder="placeholder"
          :value="valueTxt"
          :focus="isFocus"
          :disabled="disabled"
          confirm-type="search"
          @blur="inputBlur"
          @focus="inputFocus"
          @input="inputChange"
          @confirm="search"
        />
        <icon type="clear" :size="clearSize" class="tui-icon-clear" v-if="valueTxt.length > 0 && !disabled" @tap.stop="clearInput"></icon>
      </view>
      <view class="tui-search-bar__label" :style="{ height: height, borderRadius: radius, backgroundColor: inputBgColor }" v-if="!isFocus && !searchState && showLabel" @tap="tapShowInput">
        <icon class="tui-icon-search" type="search" :size="searchSize"></icon>
        <text class="tui-search-bar__text">{{ placeholder }}</text>
      </view>
    </view>
    <view v-if="cancel && searchState && !valueTxt" class="tui-search-bar__cancel-btn" :style="{ color: cancelColor }" @tap="hideInput">{{ cancelText }}</view>
    <view v-if="valueTxt && !disabled && searchState" class="tui-search-bar__cancel-btn" :style="{ color: getSearchColor }" @tap="search">{{ searchText }}</view>
  </view>
</template>

<script>
//默认高度52px
export default {
  name: 'tuiSearchbar',
  emits: ['clear', 'focus', 'blur', 'click', 'cancel', 'input', 'search'],
  props: {
    //搜索栏背景色
    backgroundColor: {
      type: String,
      default: '#ededed'
    },
    //搜索栏padding
    padding: {
      type: String,
      default: '16rpx 20rpx'
    },
    //input框高度
    height: {
      type: String,
      default: '72rpx'
    },
    radius: {
      type: String,
      default: '8rpx'
    },
    //input框背景色
    inputBgColor: {
      type: String,
      default: '#fff'
    },
    focus: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入搜索关键词'
    },
    value: {
      type: String,
      default: ''
    },
    //input是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    cancelColor: {
      type: String,
      default: '#888'
    },
    cancel: {
      type: Boolean,
      default: true
    },
    searchText: {
      type: String,
      default: '搜索'
    },
    searchColor: {
      type: String,
      default: ''
    },
    //是否显示占位标签
    showLabel: {
      type: Boolean,
      default: true
    },
    //是否显示输入框
    showInput: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    getSearchColor() {
      return this.searchColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    }
  },
  created() {
    this.valueTxt = this.value;
    this.isFocus = this.focus;
    if (this.focus || this.valueTxt.length > 0) {
      this.searchState = true;
    }
    this.clearSize = Math.ceil(uni.upx2px(30));
    this.searchSize = Math.ceil(uni.upx2px(26));
  },
  watch: {
    value(val) {
      this.valueTxt = val;
    }
  },
  data() {
    return {
      searchState: false,
      isFocus: false,
      valueTxt: '',
      clearSize: 15,
      searchSize: 13
    };
  },
  methods: {
    clearInput() {
      this.valueTxt = '';
      // #ifdef MP-TOUTIAO || MP-WEIXIN
      this.isFocus = false;
      uni.hideKeyboard();
      // #endif
      // #ifndef MP-TOUTIAO || MP-WEIXIN
      this.isFocus = true;
      // #endif
      this.$emit('clear');
    },
    inputFocus(e) {
      if (!this.showLabel) {
        this.searchState = true;
      }
      this.$emit('focus', e.detail);
    },
    inputBlur(e) {
      this.isFocus = false;
      this.$emit('blur', e.detail);
    },
    tapShowInput() {
      if (!this.disabled && this.showInput) {
        this.searchState = true;
        setTimeout(() => {
          this.isFocus = true;
        }, 20);
      }
      this.$emit('click', {});
    },

    hideInput() {
      this.searchState = false;
      this.isFocus = false;
      uni.hideKeyboard();
      this.$emit('cancel', {});
    },
    inputChange(e) {
      this.valueTxt = e.detail.value;
      this.$emit('input', e.detail);
    },
    search() {
      this.$emit('search', {
        value: this.valueTxt
      });
    },
    reset() {
      this.searchState = false;
      this.isFocus = false;
      this.valueTxt = '';
      uni.hideKeyboard();
    }
  }
};
</script>

<style scoped>
.tui-searchbar__box {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.tui-search-bar__form {
  position: relative;
  -webkit-box-flex: 1;
  -webkit-flex: auto;
  flex: auto;
}

.tui-search-bar__box {
  width: 100%;
  padding-left: 20rpx;
  padding-right: 16rpx;
  box-sizing: border-box;
  z-index: 1;
  display: flex;
  align-items: center;
}

.tui-search-bar__box .tui-search-bar__input {
  padding: 0 16rpx;
  width: 100%;
  border: 0;
  font-size: 28rpx;
  box-sizing: content-box;
  background: transparent;
}

.tui-search-bar__box .tui-search-bar__input:focus {
  outline: none;
}

.tui-search-bar__box .tui-icon-search {
  flex-shrink: 0;
}

.tui-search-bar__box .tui-icon-clear {
  margin-left: 4rpx;
  flex-shrink: 0;
}

.tui-search-bar__label {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  font-size: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tui-search-bar__cancel-btn {
  font-size: 30rpx;
  margin-left: 16rpx;
  line-height: 56rpx;
  white-space: nowrap;
  flex-shrink: 0;
}

.tui-search-bar__text {
  display: inline-block;
  font-size: 28rpx;
  vertical-align: middle;
  padding-left: 12rpx;
  color: rgba(0, 0, 0, 0.5);
}
</style>
