<template>
  <view class="tui-org__horizontal">
    <view>
      <view class="tui-orgh__item" v-for="(item, index) in options" :key="index">
        <view class="tui-node__vertical-line" :style="[getStyles(item.height, index)]" v-if="!item.isOrgRoot"> </view>
        <view class="tui-node__horizontal-line" v-if="!item.isOrgRoot" :style="{ background: lineColor || borderColor, width: toPx(lineWidth) + 'px' }"></view>
        <view
          class="tui-orgh__node-item"
          :class="{ 'tui-org__item-border': borderColor && borderColor !== true && borderColor !== 'true' && borderColor !== 'transparent' }"
          :style="{
            width: width != 0 ? width + 'rpx' : 'auto',
            height: itemHeight + 'px',
            paddingLeft: (width != 0 ? 4 : toPx(padding)) + 'px',
            paddingRight: (width != 0 ? 4 : toPx(padding)) + 'px',
            borderRadius: radius + 'rpx',
            background: background,
            borderColor: borderColor
          }"
          @tap.stop="handleClick(item)"
        >
          <text class="tui-orgh__node-text" :class="{ 'tui-org__item-hidden': width != 0 }" :style="{ fontSize: size + 'rpx', color: color }">{{ item[fields[0] || 'text'] }}</text>
        </view>
        <view
          class="tui-node__horizontal-line"
          v-if="item[fields[1] || 'children'] && item[fields[1] || 'children'].length !== 0"
          :style="{ background: lineColor || borderColor, width: toPx(lineWidth) + 'px' }"
        ></view>
        <tui-org-horizontal
          :root="false"
          :width="width"
          :fields="fields"
          :height="height"
          :padding="padding"
          :radius="radius"
          :background="background"
          :size="size"
          :color="color"
          :borderColor="borderColor"
          :lineWidth="lineWidth"
          :lineColor="lineColor"
          :gap="gap"
          :treeData="item[fields[1] || 'children']"
          v-if="item[fields[1] || 'children'] && item[fields[1] || 'children'].length !== 0"
          @click="handleClick"
        ></tui-org-horizontal>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'tuiOrgHorizontal',
  emits: ['click'],
  options: {
    virtualHost: true
  },
  props: {
    treeData: {
      type: Array,
      default() {
        return [];
      }
    },
    fields: {
      type: Array,
      default() {
        return ['text', 'children'];
      }
    },
    width: {
      type: [Number, String],
      default: 0
    },
    height: {
      type: [Number, String],
      default: 80
    },
    padding: {
      type: [Number, String],
      default: 24
    },
    radius: {
      type: [Number, String],
      default: 0
    },
    background: {
      type: String,
      default: '#fff'
    },
    size: {
      type: [Number, String],
      default: 32
    },
    color: {
      type: String,
      default: '#000'
    },
    borderColor: {
      type: String,
      default: '#555'
    },
    lineWidth: {
      type: [Number, String],
      default: 88
    },
    lineColor: {
      type: String,
      default: '#555'
    },
    //调整内容上下间距
    gap: {
      type: [Number, String],
      default: 40
    },
    //组件内部使用属性，不可修改，主要用于区分组件递归样式问题
    root: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      options: [],
      itemHeight: 0
    };
  },
  created() {
    this.initData();
  },
  watch: {
    height(val) {
      this.initData();
    },
    treeData(val) {
      this.initData();
    }
  },
  methods: {
    initData() {
      this.itemHeight = this.toPx(this.height);
      this.options = this.treeData.map((item, index) => {
        return {
          isOrgRoot: index === 0 && this.root,
          ...this.adjustItem(item)
        };
      });
    },
    toPx(rpx) {
      let px = uni.upx2px(rpx);
      return px % 2 === 0 ? px : px + 1;
    },
    getStyles(treeHeight, index) {
      let length = this.treeData.length;
      if (length == 1 || length == 0) {
        return {
          height: '0',
          background: this.lineColor || this.borderColor,
          display: 'none'
        };
      } else {
        let height = 0;
        let marginTop = 0;
        let marginBtm = 0;
        if (index == 0) {
          height = treeHeight / 2;
          marginTop = height;
          return {
            height: `${height}px`,
            background: this.lineColor || this.borderColor,
            marginTop: `${marginTop}px`
          };
        }
        if (index == length - 1) {
          height = treeHeight / 2;
          marginBtm = height;
          return {
            background: this.lineColor || this.borderColor,
            height: `${height}px`,
            marginBottom: `${marginBtm}px`
          };
        } else {
          height = treeHeight;
          return {
            background: this.lineColor || this.borderColor,
            height: `${height}px`
          };
        }
      }
    },
    adjustItem(item) {
      let children = item[this.fields[1] || 'children'];
      if (!children || children.length == 0) {
        item.height = this.itemHeight + this.toPx(this.gap);
      } else {
        children.map(model => {
          this.adjustItem(model);
        });

        item.height = children.reduce((preV, n) => {
          return preV + n.height;
        }, 0);
      }
      return item;
    },
    handleClick(e) {
      this.$emit('click', e);
    }
  }
};
</script>

<style scoped>
.tui-org__horizontal {
  display: flex;
}

.tui-node__vertical-line {
  display: inline-block;
  width: 1px;
  flex-shrink: 0;
}

.tui-orgh__item {
  display: flex;
  align-items: center;
}

.tui-node__horizontal-line {
  display: inline-block;
  height: 1px;
  flex-shrink: 0;
}

.tui-orgh__node-item {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
  text-align: center;
  flex-shrink: 0;
}

.tui-orgh__node-text {
  width: 100%;
  text-align: center;
  display: block;
}

.tui-org__item-border {
  border: 1px solid;
}

.tui-org__item-hidden {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
