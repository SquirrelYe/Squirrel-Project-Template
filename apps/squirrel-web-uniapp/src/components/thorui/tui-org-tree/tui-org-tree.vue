<template>
  <view class="tui-org__tree">
    <tui-org-node v-for="(item, index) in treeData" :key="index" :node="item" :fields="fields" :collapsible="collapsible" @click="handleClick"> </tui-org-node>
  </view>
</template>

<script>
//如果未开启easycom模式，请自行引入tui-org-node组件
export default {
  name: 'tui-org-tree',
  emits: ['click'],
  props: {
    treeData: {
      type: Array,
      default() {
        return [];
      }
    },
    //是否可折叠（收起展开）
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
  methods: {
    handleClick: function (e) {
      this.$emit('click', e);
    }
  }
};
</script>

<style scoped>
.tui-org__tree {
  width: 100%;
}
</style>
