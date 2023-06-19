<template>
  <view class="tui-org__node">
    <view class="tui-node__label" :class="['tui-org__text-' + (node.align || ''), node.active || collapsed ? 'tui-node__label-active' : '']" @tap="handleClick">
      {{ node[fields[0] || 'text'] }}
      <view class="tui-org__collapsable" v-if="node[fields[1] || 'children'] && node[fields[1] || 'children'].length > 0 && collapsed"></view>
    </view>
    <template v-if="node[fields[1] || 'children'] && node[fields[1] || 'children'].length > 0">
      <view class="tui-node__children" :style="{ display: collapsed ? 'none' : 'flex' }" v-show="!collapsed">
        <tui-org-node v-for="(item, index) in node[fields[1] || 'children']" :key="index" :fields="fields" :node="item" :collapsible="collapsible" @click="nodeClick"> </tui-org-node>
      </view>
    </template>
  </view>
</template>

<script>
//如果未开启easycom模式，请自行引入tui-org-node组件
export default {
  name: 'tui-org-node',
  emits: ['click'],
  options: {
    // #ifdef MP-WEIXIN
    addGlobalClass: true,
    // #endif
    virtualHost: true
  },
  props: {
    node: {
      type: Object,
      default() {
        return {};
      }
    },
    //是否可折叠
    collapsible: {
      type: Boolean,
      default: false
    },
    fields: {
      type: Array,
      default() {
        return ['text', 'children'];
      }
    }
  },
  watch: {
    node(val) {
      if (val.collapsed !== this.collapsed && this.node[this.fields[1] || 'children'] && this.node[this.fields[1] || 'children'].length > 0) {
        this.collapsed = val.collapsed || false;
      }
    }
  },
  created() {
    this.collapsed = this.node.collapsed || false;
  },
  data() {
    return {
      collapsed: false
    };
  },
  methods: {
    handleClick: function (e) {
      if (this.collapsible && this.node[this.fields[1] || 'children'] && this.node[this.fields[1] || 'children'].length > 0) {
        this.collapsed = !this.collapsed;
      }
      this.$emit('click', this.node);
    },
    nodeClick: function (e) {
      this.$emit('click', e);
    }
  }
};
</script>

<style scoped>
.tui-org__node {
  float: left;
  text-align: center;
  position: relative;
  padding: 48rpx 12rpx 0 12rpx;
  transition: all 0.3s;
  box-sizing: border-box;
}

.tui-org__node::before {
  content: ' ';
  position: absolute;
  top: 0;
  right: 50%;
  border-top: 1px solid var(--tui-line-color, #555);
  width: 50%;
  height: 48rpx;
}

.tui-org__node::after {
  content: ' ';
  position: absolute;
  top: 0;
  right: 50%;
  border-top: 1px solid var(--tui-line-color, #555);
  width: 50%;
  height: 48rpx;
}

.tui-org__node::after {
  right: auto;
  left: 50%;
  border-left: 1px solid var(--tui-line-color, #555);
}

.tui-org__node:only-child::before {
  display: none;
}

.tui-org__node:only-child::after {
  display: none;
}

/* #ifndef MP-BAIDU  || MP-QQ || MP-TOUTIAO */
.tui-org__node:only-child {
  padding-top: 0;
}

/* #endif */

.tui-org__node:first-child::before {
  border: 0;
}

.tui-org__node:last-child::after {
  border: 0;
}

.tui-org__node:last-child::before {
  border-right: 1px solid var(--tui-line-color, #555);
  border-radius: 0 12rpx 0 0;
}

.tui-org__node:first-child::after {
  border-radius: 12rpx 0 0 0;
}

.tui-node__children {
  display: flex;
  padding-top: 48rpx;
  position: relative;
  transition: all 0.3s;
}

.tui-node__children::before {
  content: ' ';
  position: absolute;
  top: 0;
  left: 50%;
  border-left: 1px solid var(--tui-line-color, #555);
  width: 0;
  height: 48rpx;
}

/* #ifdef MP-BAIDU || MP-QQ || MP-TOUTIAO */
.tui-node__children::after {
  content: ' ';
  position: absolute;
  top: 48rpx;
  left: 0%;
  border-top: 1px solid var(--tui-line-color, #555);
  border-left: 1px solid var(--tui-line-color, #555);
  border-right: 1px solid var(--tui-line-color, #555);
  height: 48rpx;
  width: 100%;
}

/* #endif */
.tui-node__label {
  display: inline-block;
  margin: 0;
  text-align: center;
  font-size: var(--tui-org-label-size, 14px);
  border-radius: var(--tui-org-label-radius, 2px);
  color: var(--tui-org-label-color, #000);
  padding: var(--tui-org-label-padding, 8px);
  border: var(--tui-org-label-border, 1px solid #555);
  background: var(--tui-org-label-bgcolor, #fff);
  font-weight: var(--tui-org-label-weight, 500);
  position: relative;
  transition: all 0.3s;
  flex-shrink: 0;
}

.tui-node__label-active {
  background: var(--tui-org-active-bgcolor, #5677fc) !important;
  color: var(--tui-org-active-color, #fff) !important;
  border: var(--tui-org-active-border, 1px solid #5677fc) !important;
}

.tui-org__text-vertical {
  /* writing-mode: vertical-lr; */
  width: var(--tui-org-label-width, 20px);
  word-break: break-all;
}

.tui-org__text-horizontal {
  white-space: nowrap;
}

.tui-org__collapsable {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--tui-collapsable-sign-bgcolor, #fff);
  /* color: var(--tui-collapsable-sign-color, #555); */
  border: var(--tui-collapsable-sign-border, 1px solid #555);
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 100%);
  z-index: 2;
}

.tui-org__collapsable::before {
  content: '';
  position: absolute;
  height: 10px;
  width: 1px;
  background-color: var(--tui-collapsable-sign-color, #555);
  left: 50%;
  top: 5px;
  transform: translateX(-50%);
}

.tui-org__collapsable::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 1px;
  background-color: var(--tui-collapsable-sign-color, #555);
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
}
</style>
