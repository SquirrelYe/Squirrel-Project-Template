<template>
  <view
    class="tui-notice__bar"
    :class="{ 'tui-notice__fixed': isFixed }"
    :style="{
      backgroundColor: backgroundColor,
      paddingTop: padding[0] || 0,
      paddingRight: padding[1] || 0,
      paddingBottom: padding[2] || padding[0] || 0,
      paddingLeft: padding[3] || padding[1] || 0,
      height: scrollable || single ? height + 'rpx' : 'auto',
      top: isFixed ? top : 'auto'
    }"
    @click="onClick"
  >
    <view class="tui-notice__shrink" @tap.stop="leftClick" v-if="isLeft">
      <slot name="left"></slot>
    </view>
    <view class="tui-notice__wrap" :class="{ 'tui-notice__wrap-scroll': scrollable }" :style="{ height: scrollable && !isNvue ? size + 'rpx' : 'auto' }" ref="tui_notice_box">
      <view :id="elId_box" :class="{ 'tui-notice__content': scrollable, 'tui-notice__content-single': !scrollable && single }">
        <text
          ref="animationEle"
          class="tui-notice__text"
          :id="elId"
          :style="{
            color: getColor,
            fontSize: size + 'rpx',
            lineHeight: scrollable && !isNvue ? size + 'rpx' : 'normal',
            fontWeight: bold ? 'bold' : '',
            width: wrapWidth + 'px',
            animationDuration: animationDuration,
            '-webkit-animationDuration': animationDuration,
            animationPlayState: webviewHide ? 'paused' : animationPlayState,
            '-webkit-animationPlayState': webviewHide ? 'paused' : animationPlayState,
            animationDelay: animationDelay,
            '-webkit-animationDelay': animationDelay
          }"
          :class="{ 'tui-notice__single': !scrollable && single, 'tui-notice__scrollable': scrollable }"
          >{{ content }}</text
        >
      </view>
    </view>
    <view class="tui-notice__shrink" @tap.stop="rightClick" v-if="isRight">
      <slot name="right"></slot>
    </view>
  </view>
</template>

<script>
// #ifdef APP-NVUE
const dom = weex.requireModule('dom');
const animation = weex.requireModule('animation');
// #endif
export default {
  name: 'tui-notice-bar',
  emits: ['click', 'leftClick', 'rightClick'],
  props: {
    //通告栏高度
    height: {
      type: [Number, String],
      default: 72
    },
    content: {
      type: String,
      default: ''
    },
    //字体大小 rpx
    size: {
      type: [Number, String],
      default: 28
    },
    color: {
      type: String,
      default: ''
    },
    bold: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: '#fff8d5'
    },
    //scrollable为false时使用,['20rpx','30rpx','20rpx','30rpx']=>[上，右，下，左],为了兼容nvue
    padding: {
      type: Array,
      default() {
        return [];
      }
    },
    //是否单行
    single: {
      type: Boolean,
      default: false
    },
    //是否滚动，添加后控制单行效果取消
    scrollable: {
      type: Boolean,
      default: false
    },
    //每秒滚动速度（距离） 默认 100px/s
    speed: {
      type: Number,
      default: 100
    },
    //backwards: 动画从头开始播；forwards：动画从结束点开始播
    activeMode: {
      type: String,
      default: 'backwards'
    },
    //是否需要左侧slot内容
    isLeft: {
      type: Boolean,
      default: false
    },
    //是否需要右侧slot内容
    isRight: {
      type: Boolean,
      default: false
    },
    //是否固定在顶部
    isFixed: {
      type: Boolean,
      default: false
    },
    //isFixed为true时top值
    top: {
      type: String,
      // #ifdef H5
      default: '44px',
      // #endif
      // #ifndef H5
      default: '0'
      // #endif
    },
    //自定义参数
    params: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    const elId = `tui_${Math.ceil(Math.random() * 10e5).toString(36)}`;
    const elId_box = `tui_${Math.ceil(Math.random() * 10e5).toString(36)}`;
    let isNvue = false;
    // #ifdef APP-NVUE
    isNvue = true;
    // #endif
    return {
      elId: elId,
      elId_box: elId_box,
      noticeWidth: 0,
      boxWidth: 0,
      wrapWidth: '',
      webviewHide: false,
      // #ifdef APP-NVUE
      stopAnimation: false,
      // #endif
      isNvue: isNvue,
      animationDuration: 'none',
      animationPlayState: 'paused',
      animationDelay: '0s'
    };
  },
  mounted() {
    // #ifdef APP-PLUS
    let pages = getCurrentPages();
    let page = pages[pages.length - 1];
    let currentWebview = page.$getAppWebview();
    currentWebview.addEventListener('hide', () => {
      this.webviewHide = true;
    });
    currentWebview.addEventListener('show', () => {
      this.webviewHide = false;
    });
    // #endif
    this.$nextTick(() => {
      setTimeout(() => {
        this.initAnimation();
      }, 50);
    });
  },
  computed: {
    getColor() {
      return this.color || (uni && uni.$tui && uni.$tui.color.warning) || '#ff7900';
    }
  },
  watch: {
    scrollable(val) {
      if (val) {
        this.$nextTick(() => {
          this.initAnimation();
        });
      }
    },
    content(val) {
      this.$nextTick(() => {
        setTimeout(() => {
          this.initAnimation();
        }, 50);
      });
    }
  },
  //APP-NVUE 暂不支持vue3
  // #ifdef APP-NVUE
  // #ifndef VUE3
  beforeDestroy() {
    this.stopAnimation = true;
  },
  // #endif
  // #ifdef VUE3
  beforeUnmount() {
    this.stopAnimation = true;
  },
  // #endif
  // #endif
  methods: {
    initAnimation() {
      if (!this.content || this.content == '') return;
      if (this.scrollable) {
        // #ifndef APP-NVUE
        let query = [],
          boxWidth = 0,
          noticeWidth = 0;
        let noticeQuery = new Promise((resolve, reject) => {
          uni
            .createSelectorQuery()
            // #ifndef MP-ALIPAY
            .in(this)
            // #endif
            .select(`#${this.elId}`)
            .boundingClientRect()
            .exec(ret => {
              this.noticeWidth = ret[0].width;
              resolve();
            });
        });
        if (this.activeMode === 'forwards') {
          let boxQuery = new Promise((resolve, reject) => {
            uni
              .createSelectorQuery()
              // #ifndef MP-ALIPAY
              .in(this)
              // #endif
              .select(`#${this.elId_box}`)
              .boundingClientRect()
              .exec(ret => {
                this.boxWidth = ret[0].width;
                resolve();
              });
          });
          query.push(boxQuery);
        }
        query.push(noticeQuery);
        Promise.all(query).then(() => {
          this.animationDuration = `${this.noticeWidth / this.speed}s`;
          if (this.activeMode === 'forwards') {
            this.animationDelay = `-${this.boxWidth / this.speed}s`;
          }
          setTimeout(() => {
            this.animationPlayState = 'running';
          }, 1000);
        });
        // #endif
        // #ifdef APP-NVUE
        dom.getComponentRect(this.$refs['animationEle'], res => {
          let winWidth = uni.getSystemInfoSync().windowWidth;
          this.noticeWidth = res.size.width;
          animation.transition(
            this.$refs['animationEle'],
            {
              styles: {
                transform: `translateX(-${winWidth}px)`
              },
              duration: 0,
              timingFunction: 'linear',
              delay: 0
            },
            () => {
              if (!this.stopAnimation) {
                animation.transition(
                  this.$refs['animationEle'],
                  {
                    styles: {
                      transform: `translateX(-${this.noticeWidth}px)`
                    },
                    timingFunction: 'linear',
                    duration: ((this.noticeWidth - winWidth) / this.speed) * 1000,
                    delay: 1000
                  },
                  () => {
                    if (!this.stopAnimation) {
                      this.loopAnimation();
                    }
                  }
                );
              }
            }
          );
        });
        // #endif
      }
      // #ifdef APP-NVUE
      if (!this.scrollable && this.single) {
        dom.getComponentRect(this.$refs['tui_notice_box'], res => {
          this.wrapWidth = res.size.width;
        });
      }
      // #endif
    },
    loopAnimation() {
      // #ifdef APP-NVUE
      animation.transition(
        this.$refs['animationEle'],
        {
          styles: {
            transform: `translateX(0)`
          },
          duration: 0
        },
        () => {
          if (!this.stopAnimation) {
            animation.transition(
              this.$refs['animationEle'],
              {
                styles: {
                  transform: `translateX(-${this.noticeWidth}px)`
                },
                duration: (this.noticeWidth / this.speed) * 1000,
                timingFunction: 'linear',
                delay: 0
              },
              () => {
                if (!this.stopAnimation) {
                  this.loopAnimation();
                }
              }
            );
          }
        }
      );
      // #endif
    },
    onClick() {
      this.$emit('click', {
        params: this.params
      });
    },
    leftClick() {
      this.$emit('leftClick', {
        params: this.params
      });
    },
    rightClick() {
      this.$emit('rightClick', {
        params: this.params
      });
    }
  }
};
</script>

<style scoped>
.tui-notice__bar {
  /* #ifndef APP-NVUE */
  display: flex;
  width: 100%;
  box-sizing: border-box;
  /* #endif */
  flex-direction: row;
  align-items: center;
}

.tui-notice__fixed {
  position: fixed;
  left: 0;
  z-index: 100;
}

.tui-notice__shrink {
  /* #ifndef APP-NVUE */
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* #endif */

  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
}

.tui-notice__wrap {
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.tui-notice__wrap-scroll {
  flex-direction: row;
}

/* #ifndef APP-NVUE */
.tui-notice__wrap-scroll {
  position: relative;
}

/* #endif */

.tui-notice__content {
  /* #ifdef APP-NVUE */
  flex: 0;
  /* #endif */
  /* #ifndef APP-NVUE */
  flex: 1;
  display: block;
  overflow: hidden;
  /* #endif */
}

.tui-notice__text {
  /* #ifndef APP-NVUE */
  word-break: break-all;
  /* #endif */
}

.tui-notice__content-single {
  /* #ifndef APP-NVUE */
  display: flex;
  flex: none;
  width: 100%;
  justify-content: center;
  /* #endif */
}

.tui-notice__single {
  /* #ifdef APP-NVUE */
  lines: 1;
  /* #endif */
  /* #ifndef APP-NVUE */
  display: block;
  width: 100%;
  white-space: nowrap;
  /* #endif */
  flex-direction: row;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tui-notice__scrollable {
  /* #ifdef APP-NVUE */
  lines: 1;
  padding-left: 750rpx;
  /* #endif */
  /* #ifndef APP-NVUE */
  position: absolute;
  display: block;
  white-space: nowrap;
  padding-left: 101%;
  animation: notice 10s 0s linear infinite both;
  animation-play-state: paused;
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
  /* #endif */
}

@keyframes notice {
  100% {
    transform: translate3d(-100%, 0, 0);
  }
}
</style>
