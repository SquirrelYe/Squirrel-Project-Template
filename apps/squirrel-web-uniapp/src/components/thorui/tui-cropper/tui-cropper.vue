<template>
  <view class="tui-cropper__box" @touchmove.stop.prevent="stop">
    <image
      @load="imageLoad"
      @error="imageLoad"
      @touchstart="parse.touchstart"
      @touchmove="parse.touchmove"
      @touchend="parse.touchend"
      :data-minScale="minScale"
      :data-maxScale="maxScale"
      :style="{
        width: (imgWidth ? imgWidth : width) + 'px',
        height: imgHeight ? imgHeight + 'px' : 'auto',
        transitionDuration: (animation ? 0.3 : 0) + 's'
      }"
      class="tui-cropper__image"
      :class="{ 'tui-cropper__image-hidden': !imageUrl }"
      :src="imageUrl"
      mode="widthFix"
    >
    </image>
    <view class="tui-backdrop__cropper" :style="{ width: width + 'px', height: height + 'px', borderRadius: isRound ? '50%' : '0' }">
      <view
        class="tui-cropper__border"
        :change:prop="parse.propsChange"
        :prop="props"
        :data-width="width"
        :data-height="height"
        :data-windowHeight="sysInfo.windowHeight || 600"
        :data-windowWidth="sysInfo.windowWidth || 400"
        :data-imgTop="imgTop"
        :data-imgLeft="imgLeft"
        :data-imgWidth="imgWidth"
        :data-imgHeight="imgHeight"
        :data-angle="angle"
        :style="{ borderRadius: isRound ? '50%' : '0', border: border }"
      ></view>
    </view>
    <canvas
      canvas-id="tui-image__cropper"
      id="tui-image__cropper"
      :disable-scroll="true"
      :style="{ width: width * scaleRatio + 'px', height: height * scaleRatio + 'px' }"
      class="tui-cropper__canvas"
    ></canvas>
    <view class="tui-cropper__tabbar" v-if="!custom">
      <view class="tui-op__btn" @tap.stop="back">取消</view>
      <image :src="rotateImg" class="tui-rotate__img" @tap="setAngle"></image>
      <view class="tui-op__btn" @tap.stop="getImage">完成</view>
    </view>
  </view>
</template>
<script src="./tui-cropper.wxs" module="parse" lang="wxs"></script>
<script>
export default {
  name: 'tuiCropper',
  emits: ['ready', 'cropper', 'imageLoad', 'initAngle'],
  props: {
    //图片路径
    imageUrl: {
      type: String,
      default: ''
    },
    //裁剪框高度 px
    height: {
      type: Number,
      default: 280
    },
    //裁剪框宽度 px
    width: {
      type: Number,
      default: 280
    },
    //是否为圆形裁剪框
    isRound: {
      type: Boolean,
      default: true
    },
    //裁剪框边框
    border: {
      type: String,
      default: '1px solid #fff'
    },
    //生成的图片尺寸相对剪裁框的比例
    scaleRatio: {
      type: Number,
      default: 2
    },
    //图片的质量，取值范围为 (0, 1]，不在范围内时当作1.0处理
    quality: {
      type: Number,
      default: 0.8
    },
    //图片旋转角度
    rotateAngle: {
      type: Number,
      default: 0
    },
    //图片最小缩放比
    minScale: {
      type: Number,
      default: 0.5
    },
    //图片最大缩放比
    maxScale: {
      type: Number,
      default: 2
    },
    //自定义操作栏（为true时隐藏底部操作栏）
    custom: {
      type: Boolean,
      default: false
    },
    //值发生改变开始裁剪（custom为true时生效）
    startCutting: {
      type: [Number, Boolean],
      default: 0
    },
    /**
     * 是否返回base64(H5端默认base64)
     * 支持平台：App，微信小程序，支付宝小程序,H5(默认url就是base64)
     **/
    isBase64: {
      type: Boolean,
      default: false
    },
    //裁剪时是否显示loadding
    loadding: {
      type: Boolean,
      default: true
    },
    //旋转icon
    rotateImg: {
      type: String,
      default: '/static/components/cropper/img_rotate.png'
    }
  },
  data() {
    return {
      TIME_CUT_CENTER: null,
      cutX: 0, //画布x轴起点
      cutY: 0, //画布y轴起点0
      imgWidth: 0,
      imgHeight: 0,
      scale: 1, //图片缩放比
      angle: 0, //图片旋转角度
      animation: false, //是否开启图片过渡效果
      animationTime: null,
      imgTop: 0,
      imgLeft: 0,
      ctx: null,
      sysInfo: {},
      props: '',
      sizeChange: 0, //2
      angleChange: 0, //3
      resetChange: 0, //4
      centerChange: 0 //5
    };
  },
  watch: {
    //定义变量然后利用change触发
    imageUrl(val, oldVal) {
      this.imageReset();
      this.showLoading();
      uni.getImageInfo({
        src: val,
        success: res => {
          //计算图片尺寸
          this.imgComputeSize(res.width, res.height);
          this.angleChange++;
          this.props = `3,${this.angleChange}`;
        },
        fail: err => {
          this.imgComputeSize();
          this.angleChange++;
          this.props = `3,${this.angleChange}`;
        }
      });
    },
    rotateAngle(val) {
      this.animation = true;
      this.angle = val;
      this.angleChanged(val);
    },
    animation(val) {
      //开启过渡220毫秒之后自动关闭
      clearTimeout(this.animationTime);
      if (val) {
        this.animationTime = setTimeout(() => {
          this.animation = false;
        }, 220);
      }
    },
    startCutting(val) {
      if (this.custom && val) {
        this.getImage();
      }
    }
  },
  mounted() {
    this.sysInfo = uni.getSystemInfoSync();
    this.imgTop = this.sysInfo.windowHeight / 2;
    this.imgLeft = this.sysInfo.windowWidth / 2;
    this.ctx = uni.createCanvasContext('tui-image__cropper', this);
    //初始化
    setTimeout(() => {
      this.props = '1,1';
    }, 0);
    setTimeout(() => {
      this.$emit('ready', {});
    }, 200);
  },
  methods: {
    //网络图片转成本地文件[同步执行]
    async getLocalImage(url) {
      return await new Promise((resolve, reject) => {
        uni.downloadFile({
          url: url,
          success: res => {
            resolve(res.tempFilePath);
          },
          fail: res => {
            reject(false);
          }
        });
      });
    },
    //返回裁剪后图片信息
    getImage() {
      if (!this.imageUrl) {
        uni.showToast({
          title: '请选择图片',
          icon: 'none'
        });
        return;
      }
      this.loadding && this.showLoading();
      let draw = async () => {
        //图片实际大小
        let imgWidth = this.imgWidth * this.scale * this.scaleRatio;
        let imgHeight = this.imgHeight * this.scale * this.scaleRatio;
        //canvas和图片的相对距离
        let xpos = this.imgLeft - this.cutX;
        let ypos = this.imgTop - this.cutY;
        //旋转画布
        this.ctx.translate(xpos * this.scaleRatio, ypos * this.scaleRatio);
        this.ctx.rotate((this.angle * Math.PI) / 180);
        let imgUrl = this.imageUrl;
        // #ifdef APP-PLUS || MP-WEIXIN
        if (~this.imageUrl.indexOf('https:')) {
          imgUrl = await this.getLocalImage(this.imageUrl);
        }
        // #endif
        this.ctx.drawImage(imgUrl, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
        this.ctx.draw(false, () => {
          let params = {
            width: this.width * this.scaleRatio,
            height: Math.round(this.height * this.scaleRatio),
            destWidth: this.width * this.scaleRatio,
            destHeight: Math.round(this.height) * this.scaleRatio,
            fileType: 'png',
            quality: this.quality
          };
          let data = {
            url: '',
            base64: '',
            width: this.width * this.scaleRatio,
            height: this.height * this.scaleRatio
          };
          // #ifdef MP-ALIPAY

          if (this.isBase64) {
            this.ctx.toDataURL(params).then(dataURL => {
              data.base64 = dataURL;
              this.loadding && uni.hideLoading();
              this.$emit('cropper', data);
            });
          } else {
            this.ctx.toTempFilePath({
              ...params,
              success: res => {
                data.url = res.apFilePath;
                this.loadding && uni.hideLoading();
                this.$emit('cropper', data);
              }
            });
          }
          // #endif

          // #ifndef MP-ALIPAY
          let isBase64 = this.isBase64;
          // #ifdef MP-BAIDU || MP-TOUTIAO || H5
          isBase64 = false;
          // #endif
          if (isBase64) {
            uni.canvasGetImageData(
              {
                canvasId: 'tui-image__cropper',
                x: 0,
                y: 0,
                width: this.width * this.scaleRatio,
                height: Math.round(this.height * this.scaleRatio),
                success: res => {
                  const arrayBuffer = new Uint8Array(res.data);
                  const base64 = uni.arrayBufferToBase64(arrayBuffer);
                  data.base64 = base64;
                  this.loadding && uni.hideLoading();
                  this.$emit('cropper', data);
                }
              },
              this
            );
          } else {
            uni.canvasToTempFilePath(
              {
                ...params,
                canvasId: 'tui-image__cropper',
                success: res => {
                  data.url = res.tempFilePath;
                  // #ifdef H5
                  data.base64 = res.tempFilePath;
                  // #endif
                  this.loadding && uni.hideLoading();
                  this.$emit('cropper', data);
                },
                fail(res) {
                  console.log(res);
                }
              },
              this
            );
          }
          // #endif
        });
      };
      draw();
    },
    change(e) {
      this.cutX = e.cutX || 0;
      this.cutY = e.cutY || 0;
      this.imgWidth = e.imgWidth || this.imgWidth;
      this.imgHeight = e.imgHeight || this.imgHeight;
      this.scale = e.scale || 1;
      this.angle = e.angle || 0;
      this.imgTop = e.imgTop || 0;
      this.imgLeft = e.imgLeft || 0;
    },
    imageReset() {
      this.scale = 1;
      this.angle = 0;
      let sys = this.sysInfo.windowHeight ? this.sysInfo : uni.getSystemInfoSync();
      this.imgTop = sys.windowHeight / 2;
      this.imgLeft = sys.windowWidth / 2;
      this.resetChange++;
      this.props = `4,${this.resetChange}`;
      //初始化旋转角度 0deg
      this.$emit('initAngle', {});
    },
    imgComputeSize(width, height) {
      //默认按图片最小边 = 对应裁剪框尺寸
      let imgWidth = width,
        imgHeight = height;
      if (imgWidth && imgHeight) {
        if (imgWidth / imgHeight > this.width / this.height) {
          imgHeight = this.height;
          imgWidth = (width / height) * imgHeight;
        } else {
          imgWidth = this.width;
          imgHeight = (height / width) * imgWidth;
        }
      } else {
        let sys = this.sysInfo.windowHeight ? this.sysInfo : uni.getSystemInfoSync();
        imgWidth = sys.windowWidth;
        imgHeight = 0;
      }
      this.imgWidth = imgWidth;
      this.imgHeight = imgHeight;
      this.sizeChange++;
      this.props = `2,${this.sizeChange}`;
    },
    imageLoad(e) {
      this.imageReset();
      uni.hideLoading();
      this.$emit('imageLoad', {});
    },
    moveStop() {
      clearTimeout(this.TIME_CUT_CENTER);
      this.TIME_CUT_CENTER = setTimeout(() => {
        this.centerChange++;
        this.props = `5,${this.centerChange}`;
      }, 666);
    },
    moveDuring() {
      clearTimeout(this.TIME_CUT_CENTER);
    },
    showLoading() {
      uni.showLoading({
        title: '请稍候...',
        mask: true
      });
    },
    stop() {},
    back() {
      uni.navigateBack();
    },
    angleChanged(val) {
      this.moveStop();
      if (val % 90) {
        this.angle = Math.round(val / 90) * 90;
      }
      this.angleChange++;
      this.props = `3,${this.angleChange}`;
    },
    setAngle() {
      this.animation = true;
      this.angle = this.angle + 90;
      this.angleChanged(this.angle);
    }
  }
};
</script>

<style scoped>
.tui-cropper__box {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
}

.tui-cropper__image {
  width: 100%;
  border-style: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform-origin: center;
}
.tui-cropper__image-hidden {
  visibility: hidden;
  opacity: 0;
}

.tui-cropper__canvas {
  position: fixed;
  z-index: 10;
  left: -2000px;
  top: -2000px;
  pointer-events: none;
}

.tui-backdrop__cropper {
  position: fixed;
  z-index: 4;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 3000px solid rgba(0, 0, 0, 0.55);
  pointer-events: none;
}

.tui-cropper__border {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  pointer-events: none;
}

.tui-cropper__tabbar {
  width: 100%;
  height: 120rpx;
  padding: 0 40rpx;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  font-size: 32rpx;
}

.tui-cropper__tabbar::after {
  content: ' ';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  border-top: 1rpx solid rgba(255, 255, 255, 0.2);
  -webkit-transform: scaleY(0.5) translateZ(0);
  transform: scaleY(0.5) translateZ(0);
  transform-origin: 0 100%;
}

.tui-op__btn {
  height: 80rpx;
  display: flex;
  align-items: center;
}

.tui-rotate__img {
  width: 44rpx;
  height: 44rpx;
}
</style>
