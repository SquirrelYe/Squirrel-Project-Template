<template>
  <!--判断是否是标签节点-->
  <block v-if="node.node == 'element'">
    <!--button类型-->
    <button v-if="node.tag == 'button'" type="default" size="mini" :class="node.classStr" :style="node.styleStr">
      <wx-parse-template :node="node"></wx-parse-template>
    </button>

    <!--a类型-->
    <view v-else-if="node.tag == 'a'" @click="wxParseATap(node.attr, $event)" :class="node.classStr" :data-href="node.attr.href" :style="node.styleStr">
      <block v-for="(node, index) of node.nodes" :key="index">
        <wx-parse-template :node="node"></wx-parse-template>
      </block>
    </view>

    <!--li类型-->
    <view v-else-if="node.tag == 'li'" :class="node.classStr" :style="node.styleStr">
      <block v-for="(node, index) of node.nodes" :key="index">
        <wx-parse-template :node="node"></wx-parse-template>
      </block>
    </view>

    <!--table类型-->
    <wx-parse-table v-else-if="node.tag == 'table'" :class="node.classStr" :style="node.styleStr" :node="node"></wx-parse-table>

    <!--br类型-->
    <!-- #ifndef H5 -->
    <text v-else-if="node.tag == 'br'">\n</text>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <br v-else-if="node.tag == 'br'" />
    <!-- #endif -->

    <!--video类型-->
    <wx-parse-video :node="node" v-else-if="node.tag == 'video'"></wx-parse-video>

    <!--audio类型-->
    <wx-parse-audio :node="node" v-else-if="node.tag == 'audio'"></wx-parse-audio>

    <!--img类型-->
    <wx-parse-img :node="node" v-else-if="node.tag == 'img'" :style="node.styleStr"></wx-parse-img>

    <!--其他标签-->
    <view v-else :class="node.classStr" :style="node.styleStr">
      <block v-for="(node, index) of node.nodes" :key="index">
        <wx-parse-template :node="node"></wx-parse-template>
      </block>
    </view>
  </block>

  <!--判断是否是文本节点-->
  <block v-else-if="node.node == 'text'">{{ node.text }}</block>
</template>

<script>
import wxParseTemplate from './wxParseTemplate11';
import wxParseImg from './wxParseImg';
import wxParseVideo from './wxParseVideo';
import wxParseAudio from './wxParseAudio';
import wxParseTable from './wxParseTable';

export default {
  name: 'wxParseTemplate10',
  props: {
    node: {}
  },
  components: {
    wxParseTemplate,
    wxParseImg,
    wxParseVideo,
    wxParseAudio,
    wxParseTable
  },
  methods: {
    wxParseATap(attr, e) {
      const { href } = e.currentTarget.dataset;
      if (!href) return;
      let parent = this.$parent;
      while (!parent.preview || typeof parent.preview !== 'function') {
        parent = parent.$parent;
      }
      parent.navigate(href, e, attr);
    }
  }
};
</script>
