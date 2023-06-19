<template>
  <view class="tui-tree__node">
    <view class="tui-tree__label" @tap="handleClick">
      <view class="tui-treeview__triangle" :class="{ 'tui-triangle__90deg': !collapsed }" v-if="node.children && node.children.length > 0 && triangle"></view>
      <template v-if="node.src">
        <image class="tui-tree__icon" mode="widthFix" :src="node.src" :class="{ 'tui-treeview__icon-hidden': !collapsed }"> </image>
      </template>
      <template v-if="node.activeSrc">
        <image class="tui-tree__icon" mode="widthFix" :src="node.activeSrc" :class="{ 'tui-treeview__icon-hidden': collapsed }"> </image>
      </template>
      <text>{{ node.text }}</text>
    </view>
    <template v-if="node.children && node.children.length > 0">
      <view class="tui-tree__children" v-show="!collapsed">
        <tui-tree-node v-for="(item, index) in node.children" :key="index" :node="item" :collapsible="collapsible" :triangle="triangle" @click="nodeClick"></tui-tree-node>
      </view>
    </template>
  </view>
</template>

<script>
//如果未开启easycom模式，请自行引入tui-tree-node组件
export default {
  name: 'tui-tree-node',
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
      default: true
    },
    //是否显示三角箭头
    triangle: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    node(val) {
      if (val.collapsed !== this.collapsed && this.node.children && this.node.children.length > 0) {
        this.collapsed = val.collapsed;
      }
    }
  },
  created() {
    if (this.node.collapsed === false) {
      this.collapsed = false;
    }
  },
  data() {
    return {
      collapsed: true
    };
  },
  methods: {
    handleClick: function (e) {
      if (this.collapsible && this.node.children && this.node.children.length > 0) {
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
.tui-tree__node {
  box-sizing: border-box;
}

.tui-tree__label {
  display: inline-flex;
  align-items: center;
  padding: var(--tui-treeview-label-padding, 10px 15px);
  position: relative;
  border: var(--tui-treeview-label-border, 0);
  margin: var(--tui-treeview-label-margin, 0);
  border-radius: var(--tui-treeview-label-radius, 0);
  background-color: var(--tui-treeview-label-bgcolor, transparent);
  color: var(--tui-treeview-label-color, #000);
  font-size: var(--tui-treeview-label-size, 15px);
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
}

.tui-tree__icon {
  width: var(--tui-treeview-icon-width, 20px);
  height: var(--tui-treeview-icon-height, 20px);
  margin-right: var(--tui-treeview-icon-mr, 8px);
  flex-shrink: 0;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  /* transition: all 0.3s; */
  display: block;
}

.tui-tree__children {
  padding-left: var(--tui-treeview-children-pl, 30px);
  position: relative;
}

.tui-treeview__triangle {
  width: 0;
  height: 0;
  border-top: var(--tui-treeview-triangle-bt, 6px) solid transparent;
  border-bottom: var(--tui-treeview-triangle-bt, 6px) solid transparent;
  border-left: var(--tui-treeview-triangle-bl, 8px) solid #000000;
  margin-right: var(--tui-treeview-triangle-mr, 10px);
  transition: transform 0.3s;
  flex-shrink: 0;
}

.tui-triangle__90deg {
  transform: rotate(90deg) translate3d(0, 0, 0);
}

.tui-treeview__icon-hidden {
  opacity: 0;
  visibility: hidden;
  display: none;
}
</style>
