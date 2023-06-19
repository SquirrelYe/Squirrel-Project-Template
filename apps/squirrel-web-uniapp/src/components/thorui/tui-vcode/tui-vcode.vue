<template>
  <canvas class="tui-vcode--box" :canvas-id="canvasId" :id="canvasId" :style="{ width: width + 'px', height: height + 'px' }" @tap="draw" v-if="canvasId"></canvas>
</template>

<script>
/**
 * 获取范围内的随机数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 */
const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};
/**
 * 获取范围内的随机颜色值
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 */
const randomColor = (min, max) => {
  const _r = randomNum(min, max);
  const _g = randomNum(min, max);
  const _b = randomNum(min, max);
  return `rgb(${_r}, ${_g}, ${_b})`;
};
const canvasId = `tui_${Math.ceil(Math.random() * 10e5).toString(36)}`;
export default {
  name: 'tui-vcode',
  emits: ['change'],
  props: {
    //验证码范围字符串
    vcodeStr: {
      type: String,
      default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    },
    //验证码长度
    length: {
      type: [Number, String],
      default: 4
    },
    //画布宽度
    width: {
      type: [Number, String],
      default: 100
    },
    //画布高度
    height: {
      type: [Number, String],
      default: 36
    },
    //画布背景色
    bgColor: {
      type: String,
      default: ''
    },
    //画布字体颜色
    fontColor: {
      type: String,
      default: ''
    },
    //是否显示干扰点
    hasPoint: {
      type: Boolean,
      default: true
    },
    //是否显示干扰线
    hasLine: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      canvasId
    };
  },
  created() {
    this.ctx = null;
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.draw();
      }, 50);
    });
  },
  // #ifndef VUE3
  beforeDestroy() {
    this.ctx = null;
  },
  // #endif
  // #ifdef VUE3
  beforeUnmount() {
    this.ctx = null;
  },
  // #endif
  methods: {
    render(ctx) {
      let vcode = '';
      if (typeof ctx.setTextBaseline === 'function') {
        ctx.setTextBaseline('bottom');
      }
      let width = Number(this.width);
      let height = Number(this.height);
      // 绘制矩形，并设置填充色
      ctx.setFillStyle(this.bgColor ? this.bgColor : randomColor(180, 240));
      ctx.fillRect(0, 0, width, height);

      let num = Number(this.length) || 4;
      // 绘制随机生成 n 位的验证码
      for (let i = 0; i < num; i++) {
        const x = ((width - 10) / num) * i + 10;
        const y = randomNum(height / 2, height);
        const deg = randomNum(-45, 45);
        const txt = this.vcodeStr[randomNum(0, this.vcodeStr.length)];
        const fontSize = randomNum(16, 40);
        const halfHeight = parseInt(height / 2);

        vcode += txt;
        ctx.setFillStyle(this.fontColor ? this.fontColor : randomColor(10, 100));
        ctx.setFontSize(fontSize > halfHeight ? halfHeight : fontSize);
        ctx.translate(x, y);
        ctx.rotate((deg * Math.PI) / 180);
        ctx.fillText(txt, 0, 0);
        ctx.rotate((-deg * Math.PI) / 180);
        ctx.translate(-x, -y);
      }
      // 绘制干扰线
      if (!!this.hasLine) {
        for (let i = 0; i < num; i++) {
          ctx.setStrokeStyle(randomColor(90, 180));
          ctx.beginPath();
          ctx.moveTo(randomNum(0, width), randomNum(0, height));
          ctx.lineTo(randomNum(0, width), randomNum(0, height));
          ctx.stroke();
        }
      }
      // 绘制干扰点
      if (!!this.hasPoint) {
        for (let i = 0; i < num * 10; i++) {
          ctx.setFillStyle(randomColor(0, 255));
          ctx.beginPath();
          ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
      return vcode;
    },
    draw() {
      if (!this.ctx) {
        this.ctx = uni.createCanvasContext(this.canvasId, this);
      }
      this.ctx.clearRect(0, 0, this.width, this.height);
      const value = this.render(this.ctx);
      this.ctx.draw(false, () =>
        this.$emit('change', {
          value
        })
      );
    }
  }
};
</script>

<style scoped></style>
