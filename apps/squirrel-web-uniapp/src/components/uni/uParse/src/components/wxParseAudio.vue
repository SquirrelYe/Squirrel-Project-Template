<template>
  <!-- #ifndef VUE3 -->
  <audio
    :id="node.attr.id"
    :class="node.classStr"
    :style="node.styleStr"
    :src="node.attr.src"
    :loop="node.attr.loop"
    :poster="node.attr.poster"
    :name="node.attr.name"
    :author="node.attr.author"
    controls
  ></audio>
  <!-- #endif -->
  <!-- #ifdef VUE3 -->
  <view></view>
  <!-- #endif -->
</template>

<script>
export default {
  name: 'wxParseAudio',
  props: {
    node: {
      type: Object,
      default() {
        return {};
      }
    }
  }
};
</script>
