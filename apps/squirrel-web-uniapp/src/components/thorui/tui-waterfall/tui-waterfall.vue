<template>
  <view class="tui-waterfall__box" :style="{ paddingLeft: leftGap, paddingRight: rightGap, background: backgroundColor, borderRadius: radius }">
    <view class="tui-waterfall__list" id="tui-waterfall__left" :style="{ marginRight: columnGap }">
      <slot name="left" :list="leftList" :isList="columnCount == 1"></slot>
    </view>
    <view v-if="columnCount > 1" class="tui-waterfall__list" id="tui-waterfall__right">
      <slot name="right" :list="rightList" :isList="columnCount == 1"></slot>
    </view>
  </view>
</template>

<script>
/**
 * 列表中图片可以使用懒加载或者其他方式
 * 优先计算出图片高度,以达到最佳效果
 * App端建议使用weex的waterfall组件，使用案例详见：
 * [ThorUI组件库->pages->index->productNvue]
 */

export default {
  name: 'tuiWaterfall',
  // #ifdef MP-WEIXIN
  options: {
    multipleSlots: true
  },
  // #endif
  props: {
    //列表数据，不建议一次性加载过多数据
    listData: {
      type: Array,
      default() {
        return [];
      }
    },
    //每页数据条数(固定条数),当总数据长度小于等于该数时表示第一页数据，刷新重置
    pageSize: {
      type: Number,
      default: 10
    },
    //数据分组类型：1-简单左右分组，按顺序排列，伪瀑布流 2-计算左右容器高度进行分组
    type: {
      type: Number,
      default: 1
    },
    //瀑布流列数，目前支持最大值为2
    columnCount: {
      type: Number,
      default: 2
    },
    //列与列的间隙
    columnGap: {
      type: String,
      default: '10rpx'
    },
    //左侧和列表的间隙
    leftGap: {
      type: String,
      default: '0'
    },
    //右侧和列表的间隙
    rightGap: {
      type: String,
      default: '0'
    },
    //列表背景色，可使用渐变色
    backgroundColor: {
      type: String,
      default: 'transparent'
    },
    //列表外层容器圆角值
    radius: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      leftListConst: [],
      leftList: [],
      rightList: [],
      newVal: 0,
      oldVal: 0,
      isRender: false
    };
  },
  watch: {
    listData(val) {
      this.newVal += 1;
      if (this.isRender) {
        this.isRender = false;
        this.oldVal += 1;
        this.columnChange();
      }
    },
    columnCount(val) {
      this.isRender = false;
      this.columnChange(val);
    }
  },
  mounted() {
    this.columnChange();
  },
  methods: {
    columnChange(val) {
      if (this.columnCount < 2) {
        this.leftList = [...this.listData];
        this.isRender = true;
      } else {
        if (val && val == 2) {
          this.leftList = [...this.leftListConst];
        }
        this.initData();
      }
    },
    initData() {
      if (this.type == 1) {
        this.getSubGroup();
      } else {
        this.getArrayByHeight();
      }
    },
    getDiffList() {
      let diffList = [];
      let total = this.listData.length;
      if (total <= this.pageSize) {
        this.leftListConst = [];
        this.leftList = [];
        this.rightList = [];
      }
      let sum = this.leftListConst.length + this.rightList.length;
      let diff = total - sum;
      if (diff > 0) {
        diffList = [...this.listData].filter((item, index) => {
          return index >= sum;
        });
      }
      return diffList;
    },
    getSubGroup() {
      //type=1时执行简单数据分组
      if (!this.listData && this.listData.length === 0) return;
      let leftList = [];
      let rightList = [];
      let data = this.getDiffList();
      data.forEach((item, index) => {
        if (index % 2 === 0) {
          leftList.push(item);
        } else {
          rightList.push(item);
        }
      });
      this.leftList = this.leftList.concat(leftList);
      this.leftListConst = this.leftListConst.concat(leftList);
      this.rightList = this.rightList.concat(rightList);
      this.isRender = true;
    },
    async handleData(data) {
      const item = data.shift();
      await this.render(item);
      if (data.length > 0) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.handleData(data);
          }, 60);
        });
      } else {
        this.isRender = true;
        if (this.newVal !== this.oldVal && this.oldVal !== 0) {
          this.isRender = false;
          this.columnChange();
          this.oldVal = this.newVal;
        } else {
          this.oldVal = this.newVal;
        }
      }
    },
    getArrayByHeight() {
      if (!this.listData && this.listData.length === 0) return;
      let data = this.getDiffList();
      if (data.length > 0) {
        this.handleData(data);
      } else {
        this.isRender = true;
        if (this.newVal !== this.oldVal && this.oldVal !== 0) {
          this.isRender = false;
          this.columnChange();
          this.oldVal = this.newVal;
        } else {
          this.oldVal = this.newVal;
        }
      }
    },
    sleep(millisecond) {
      let now = new Date();
      let exitTime = now.getTime() + millisecond;
      while (true) {
        now = new Date();
        if (now.getTime() > exitTime) return;
      }
    },
    async render(item) {
      let obj = await this.getContainerHeight();
      return await new Promise((resolve, reject) => {
        if (obj && typeof obj.leftHeight === 'number') {
          if (obj.leftHeight <= obj.rightHeight) {
            this.leftList.push(item);
            this.leftListConst.push(item);
          } else {
            this.rightList.push(item);
          }
          resolve(true);
        } else {
          reject(false);
        }
      });
    },
    async getContainerHeight() {
      //type=2
      return await new Promise((resolve, reject) => {
        const query = uni.createSelectorQuery().in(this);
        let nodes = query.selectAll('#tui-waterfall__left, #tui-waterfall__right');
        nodes.boundingClientRect().exec(res => {
          if (res && res[0]) {
            const rects = res[0];
            const leftHeight = rects[0].height;
            const rightHeight = rects[1].height;
            resolve({
              leftHeight: leftHeight,
              rightHeight: rightHeight
            });
          } else {
            reject(res);
          }
        });
      });
    }
  }
};
</script>

<style scoped>
.tui-waterfall__box {
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  box-sizing: border-box;
  align-items: flex-start;
}

.tui-waterfall__list {
  flex: 1;
}
</style>
