<template>
  <view class="tui-lottie__box">
    <!-- #ifdef MP -->
    <canvas :style="{ width: mpW + 'px', height: mpH + 'px' }" class="lottie_canvas" id="lottie_canvas" canvas-id="lottie_canvas" type="2d"></canvas>
    <!-- #endif -->

    <!-- #ifdef APP-VUE || H5 -->
    <view
      ref="lottieRef"
      id="lottieRef"
      :prop="options"
      :change:prop="animation.changeProp"
      :action="actionVal"
      :change:action="animation.changeAction"
      :style="{ width: width + 'rpx', height: height + 'rpx' }"
    ></view>
    <!-- #endif -->
  </view>
</template>

<!-- #ifdef APP-VUE || H5 -->
<script module="animation" lang="renderjs">
import lottie from './lottie.render.js'

export default {
	data() {
		return {
			ani: null,
			action_old: '',
			isInit: false
		}
	},
	methods: {
		changeProp(vals, old) {
			let isVue3App = false
			// #ifdef APP-VUE
			// #ifdef VUE3
			isVue3App = true;
			// #endif
			// #endif
			if (!this.isInit && !isVue3App) return;
			this.init(vals || old)
		},
		changeAction(newVal, oldVal) {
			const action = newVal || oldVal
			if (action === this.action_old) return;
			this.action_old = action;
			try {
				this.ani && this.ani[action]()
			} catch (e) {
				//TODO handle the exception
			}
		},
		init(vals) {
			if (!vals || (!vals.path && !vals.animationData)) return;
			this.ani && this.ani.destroy();
			this.$nextTick(() => {
				this.ani = lottie.loadAnimation({
					// #ifndef H5
					container: document.getElementById('lottieRef'),
					// #endif
					// #ifdef H5
					container: this.$refs.lottieRef.$el,
					// #endif
					renderer: 'svg',
					loop: vals.loop === undefined ? true : vals.loop,
					autoplay: vals.autoplay === undefined ? true : vals.autoplay,
					path: vals.path,
					// 只能加载本地json，优先级高于path
					animationData: vals.animationData
				});
			})
		}
	},
	mounted() {
		this.init(this.options)
		setTimeout(() => {
			this.isInit = true;
		}, 200)
	}
}
</script>
<!-- #endif -->

<script>
// #ifdef MP
import lottieMp from './lottie.mp.js';
// #endif
export default {
  name: 'tui-lottie',
  props: {
    width: {
      type: [Number, String],
      default: 600
    },
    height: {
      type: [Number, String],
      default: 400
    },
    options: {
      type: Object,
      default() {
        return {
          path: '',
          animationData: '',
          autoplay: true,
          loop: true
        };
      }
    },
    //动画操作，可取值 play、pause、stop、destroy
    action: {
      type: String,
      default: 'play'
    }
  },
  watch: {
    // #ifdef MP
    actionVal() {
      this.changeMpAction();
    },
    options() {
      if (!this.mpInitFlag) return;
      this.initMp();
    },
    // #endif
    action(val) {
      this.actionVal = this.getAction(this.action);
    }
  },
  data() {
    return {
      // #ifdef MP
      mpW: 300,
      mpH: 200,
      // #endif
      //可取值 play、pause、stop、destroy
      actionVal: ''
    };
  },
  // #ifdef VUE2
  beforeDestroy() {
    this.actionVal = 'destroy';
  },
  // #endif
  // #ifdef VUE3
  beforeUnmount() {
    this.actionVal = 'destroy';
  },
  // #endif
  // #ifdef MP
  created() {
    this.aniMp = null;
    this.mpInitFlag = false;
    this.mpW = uni.upx2px(Number(this.width));
    this.mpH = uni.upx2px(Number(this.height));
  },
  // #endif
  mounted() {
    this.actionVal = this.getAction(this.action);
    // #ifdef MP
    this.initMp();
    // #endif
  },
  methods: {
    // #ifdef MP
    changeMpAction() {
      try {
        this.aniMp && this.aniMp[this.actionVal]();
      } catch (e) {
        //TODO handle the exception
      }
    },
    initMp() {
      const options = {
        ...this.options
      };
      if (!options.path && !options.animationData) return;
      this.aniMp && this.aniMp.destroy();
      this.$nextTick(() => {
        const query = uni
          .createSelectorQuery()
          // #ifndef MP-ALIPAY
          .in(this);
        // #endif
        query
          .selectAll('.lottie_canvas')
          .node(res => {
            const canvas = res[0].node;
            const context = canvas.getContext('2d');
            const dpr = uni.getSystemInfoSync().pixelRatio;
            canvas.width = this.mpW * dpr;
            canvas.height = this.mpH * dpr;
            context.scale(dpr, dpr);
            lottieMp.setup(canvas);

            this.aniMp = lottieMp.loadAnimation({
              loop: options.loop === undefined ? true : options.loop,
              autoplay: options.autoplay === undefined ? true : options.autoplay,
              //只支持网络地址
              path: options.path,
              animationData: options.animationData,
              rendererSettings: {
                context
              }
            });
            this.mpInitFlag = true;
          })
          .exec();
      });
    },
    // #endif
    getAction(action) {
      const actions = ['play', 'pause', 'stop', 'destroy'];
      let val = 'play';
      if (~actions.indexOf(action)) {
        val = action;
      }
      return val;
    }
  }
};
</script>

<style scoped>
.tui-lottie__box {
  display: inline-flex;
}
</style>
