<template>
  <view class="tui-circular-container" :style="{ width: diam + 'px', height: (height || diam) + 'px' }">
    <!-- #ifndef MP-ALIPAY -->
    <canvas
      class="tui-circular-default"
      :canvas-id="defaultCanvasId"
      :id="defaultCanvasId"
      :style="{ width: diam + 'px', height: (height || diam) + 'px' }"
      v-if="defaultShow && defaultCanvasId"
    ></canvas>
    <canvas class="tui-circular-progress" :canvas-id="progressCanvasId" :id="progressCanvasId" :style="{ width: diam + 'px', height: (height || diam) + 'px' }" v-if="progressCanvasId"></canvas>
    <!-- #endif -->

    <!-- #ifdef MP-ALIPAY -->
    <canvas class="tui-circular-default" :canvas-id="defaultCanvasId" :id="defaultCanvasId" :style="{ width: diam * 4 + 'px', height: (height || diam) * 4 + 'px' }" v-if="defaultShow"></canvas>
    <canvas class="tui-circular-progress" :canvas-id="progressCanvasId" :id="progressCanvasId" :style="{ width: diam * 4 + 'px', height: (height || diam) * 4 + 'px' }"></canvas>
    <!-- #endif -->
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'tuiCircularProgress',
  emits: ['change', 'end'],
  props: {
    /*
				  传值需使用rpx进行转换保证各终端兼容
				  px = rpx / 750 * wx.getSystemInfoSync().windowWidth
				  圆形进度条(画布)宽度，直径 [px]
				*/
    diam: {
      type: Number,
      default: 60
    },
    //圆形进度条(画布)高度，默认取diam值[当画半弧时传值，height有值时则取height]
    height: {
      type: Number,
      default: 0
    },
    //进度条线条宽度[px]
    lineWidth: {
      type: Number,
      default: 4
    },
    /*
				 线条的端点样式
				 butt：向线条的每个末端添加平直的边缘
				 round	向线条的每个末端添加圆形线帽
				 square	向线条的每个末端添加正方形线帽
				*/
    lineCap: {
      type: String,
      default: 'round'
    },
    //圆环进度字体大小 [px]
    fontSize: {
      type: Number,
      default: 12
    },
    //圆环进度字体颜色
    fontColor: {
      type: String,
      default: ''
    },
    //是否显示进度文字
    fontShow: {
      type: Boolean,
      default: true
    },
    /*
				 自定义显示文字[默认为空，显示百分比，fontShow=true时生效]
				 可以使用 slot自定义显示内容
				*/
    percentText: {
      type: String,
      default: ''
    },
    //是否显示默认(背景)进度条
    defaultShow: {
      type: Boolean,
      default: true
    },
    //默认进度条颜色
    defaultColor: {
      type: String,
      default: '#CCCCCC'
    },
    //进度条颜色
    progressColor: {
      type: String,
      default: ''
    },
    //进度条渐变颜色[结合progressColor使用，默认为空]
    gradualColor: {
      type: String,
      default: ''
    },
    //起始弧度，单位弧度
    sAngle: {
      type: Number,
      default: -Math.PI / 2
    },
    //指定弧度的方向是逆时针还是顺时针。默认是false，即顺时针
    counterclockwise: {
      type: Boolean,
      default: false
    },
    //进度百分比 [10% 传值 10]
    percentage: {
      type: Number,
      default: 0
    },
    //进度百分比缩放倍数[使用半弧为100%时，则可传2]
    multiple: {
      type: Number,
      default: 1
    },
    //动画执行时间[单位毫秒，低于50无动画]
    duration: {
      type: Number,
      default: 800
    },
    //backwards: 动画从头播；forwards：动画从上次结束点接着播
    activeMode: {
      type: String,
      default: 'backwards'
    }
  },
  watch: {
    percentage(val) {
      this.initDraw();
    }
  },
  data() {
    // #ifndef MP-WEIXIN || MP-QQ
    let cid = `id01_${Math.ceil(Math.random() * 10e5).toString(36)}`;
    let did = `id02_${Math.ceil(Math.random() * 10e5).toString(36)}`;
    // #endif
    return {
      // #ifdef MP-WEIXIN || MP-QQ
      progressCanvasId: 'progressCanvasId',
      defaultCanvasId: 'defaultCanvasId',
      // #endif
      // #ifndef MP-WEIXIN || MP-QQ
      progressCanvasId: cid,
      defaultCanvasId: did,
      // #endif
      progressContext: null,
      linearGradient: null,
      //起始百分比
      startPercentage: 0
      // dpi
      //pixelRatio: uni.getSystemInfoSync().pixelRatio
    };
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.initDraw(true);
      }, 50);
    });
  },
  methods: {
    //初始化绘制
    initDraw(init) {
      let start = this.activeMode === 'backwards' ? 0 : this.startPercentage;
      start = start > this.percentage ? 0 : start;
      if (this.defaultShow && init) {
        this.drawDefaultCircular();
      }
      this.drawProgressCircular(start);
    },
    //默认(背景)圆环
    drawDefaultCircular() {
      let ctx = uni.createCanvasContext(this.defaultCanvasId, this);
      let lineWidth = Number(this.lineWidth);
      // #ifdef MP-ALIPAY
      lineWidth = lineWidth * 4;
      // #endif
      ctx.setLineWidth(lineWidth);
      ctx.setStrokeStyle(this.defaultColor);
      //终止弧度
      let eAngle = Math.PI * (this.height ? 1 : 2) + this.sAngle;
      this.drawArc(ctx, eAngle);
    },
    //进度圆环
    drawProgressCircular(startPercentage) {
      let ctx = this.progressContext;
      let gradient = this.linearGradient;
      if (!ctx) {
        ctx = uni.createCanvasContext(this.progressCanvasId, this);
        //创建一个线性的渐变颜色 CanvasGradient对象
        let diam = Number(this.diam);
        // #ifdef MP-ALIPAY
        diam = diam * 4;
        // #endif
        const progressColor = this.progressColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
        gradient = ctx.createLinearGradient(0, 0, diam, 0);
        gradient.addColorStop('0', progressColor);
        if (this.gradualColor) {
          gradient.addColorStop('1', this.gradualColor);
        }
        // #ifdef APP-PLUS || MP
        const res = uni.getSystemInfoSync();
        if (!this.gradualColor && res.platform.toLocaleLowerCase() == 'android') {
          gradient.addColorStop('1', progressColor);
        }
        // #endif
        this.progressContext = ctx;
        this.linearGradient = gradient;
      }
      let lineWidth = Number(this.lineWidth);
      // #ifdef MP-ALIPAY
      lineWidth = lineWidth * 4;
      // #endif
      ctx.setLineWidth(lineWidth);
      ctx.setStrokeStyle(gradient);
      let time = this.percentage == 0 || this.duration < 50 ? 0 : this.duration / this.percentage;
      if (this.percentage > 0) {
        startPercentage = this.duration < 50 ? this.percentage - 1 : startPercentage;
        startPercentage++;
      }
      if (this.fontShow) {
        let fontSize = Number(this.fontSize);
        // #ifdef MP-ALIPAY
        fontSize = fontSize * 4;
        // #endif
        ctx.setFontSize(fontSize);
        const fontColor = this.fontColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
        ctx.setFillStyle(fontColor);
        ctx.setTextAlign('center');
        ctx.setTextBaseline('middle');
        let percentage = this.percentText;
        if (!percentage) {
          percentage = this.counterclockwise ? 100 - startPercentage * this.multiple : startPercentage * this.multiple;
          percentage = `${percentage}%`;
        }
        let radius = this.diam / 2;
        // #ifdef MP-ALIPAY
        radius = radius * 4;
        // #endif
        ctx.fillText(percentage, radius, radius);
      }
      if (this.percentage == 0 || (this.counterclockwise && startPercentage == 100)) {
        ctx.draw();
      } else {
        let eAngle = ((2 * Math.PI) / 100) * startPercentage + this.sAngle;
        this.drawArc(ctx, eAngle);
      }
      setTimeout(() => {
        this.startPercentage = startPercentage;
        if (startPercentage >= this.percentage) {
          this.$emit('end', {
            canvasId: this.progressCanvasId,
            percentage: startPercentage
          });
        } else {
          this.drawProgressCircular(startPercentage);
        }
        this.$emit('change', {
          percentage: startPercentage
        });
      }, time);
      // #ifdef H5
      // requestAnimationFrame(()=>{})
      // #endif
    },
    //创建弧线
    drawArc(ctx, eAngle) {
      ctx.setLineCap(this.lineCap);
      ctx.beginPath();
      let radius = this.diam / 2; //x=y
      let lineWidth = Number(this.lineWidth);
      // #ifdef MP-ALIPAY
      radius = radius * 4;
      lineWidth = lineWidth * 4;
      // #endif
      ctx.arc(radius, radius, radius - lineWidth, this.sAngle, eAngle, this.counterclockwise);
      ctx.stroke();
      ctx.draw();
    }
  }
};
</script>

<style scoped>
.tui-circular-container,
.tui-circular-default {
  position: relative;
}

/* #ifdef MP-ALIPAY */
.tui-circular-default,
.tui-circular-progress {
  zoom: 0.25;
}

/* #endif */

.tui-circular-progress {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
}
</style>
