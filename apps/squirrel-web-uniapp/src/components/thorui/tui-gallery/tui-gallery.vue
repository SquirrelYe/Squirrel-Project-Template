<template>
  <view class="tui-gallery" :class="{ 'tui-gallery_show': show }" @tap="hideGallery">
    <view class="tui-gallery__info">{{ currentIndex + 1 }}/{{ getLen }}</view>
    <swiper class="tui-gallery__img__wrap" :indicator-dots="false" @change="change" :current="defCurIndex" :autoplay="false" :duration="500">
      <swiper-item v-for="(item, index) in imgUrls" :key="index">
        <image mode="aspectFit" class="tui-gallery__img" :src="item.src"></image>
      </swiper-item>
    </swiper>
    <view class="tui-gallery__desc" v-if="!showDelete">
      {{ getDesc(currentIndex, imgUrls) }}
    </view>
    <view class="tui-gallery__operate" hover-class="tui-opacity__del" :hover-start-time="150" @tap.stop="deleteImg" v-if="showDelete"> 删除 </view>
  </view>
</template>

<script>
export default {
  name: 'tuiGallery',
  emits: ['change', 'delete', 'hide'],
  props: {
    urls: {
      type: Array,
      default() {
        return [];
      }
    },
    showDelete: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    current: {
      type: Number,
      default: 0
    },
    hideOnClick: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    getLen() {
      return this.imgUrls.length;
    }
  },
  watch: {
    urls(newVal, oldVal) {
      this.imgUrls = newVal;
    },
    current(newVal) {
      this.defCurIndex = this.currentIndex;
      let val = Number(newVal);
      setTimeout(() => {
        this.defCurIndex = val;
        this.currentIndex = val;
      }, 20);
    }
  },
  mounted() {
    this.defCurIndex = Number(this.current);
    this.currentIndex = this.defCurIndex;
    this.imgUrls = this.urls;
  },
  data() {
    return {
      imgUrls: [],
      currentIndex: 0,
      defCurIndex: 0
    };
  },
  methods: {
    getDesc(index, imgUrls) {
      let desc = '';
      let item = imgUrls[index];
      if (item) {
        desc = item.desc;
      }
      return desc;
    },
    change(e) {
      this.currentIndex = e.detail.current;
      this.$emit('change', {
        current: e.detail.current
      });
    },
    deleteImg() {
      const imgs = this.imgUrls;
      const url = imgs.splice(this.current, 1);
      this.$emit('delete', {
        url: url[0],
        index: this.current
      });

      if (imgs.length === 0) {
        this.hideGallery();
        return;
      }

      this.current = 0;
      this.imgUrls = imgs;
    },
    hideGallery() {
      if (this.hideOnClick) {
        this.$emit('hide', {});
      }
    }
  }
};
</script>

<style scoped>
.tui-gallery {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #000;
  z-index: 1000;
  display: none;
}

.tui-gallery__img,
.tui-gallery__operate,
.tui-gallery__desc {
  position: absolute;
  left: 0;
  left: constant(safe-area-inset-left);
  left: env(safe-area-inset-left);
  right: 0;
  right: constant(safe-area-inset-right);
  right: env(safe-area-inset-right);
}

.tui-gallery__img {
  width: 100%;
  height: 100%;
  top: 0;
  top: constant(safe-area-inset-top);
  top: env(safe-area-inset-top);
  bottom: 60px;
  bottom: calc(60px + constant(safe-area-inset-bottom));
  bottom: calc(60px + env(safe-area-inset-bottom));
  background: 50% no-repeat;
  background-size: contain;
}

.tui-gallery__operate,
.tui-gallery__desc {
  position: absolute;
  bottom: 0;
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  background-color: #0d0d0d;
  color: #fff;
  line-height: 60px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 30rpx;
  box-sizing: border-box;
  z-index: 10;
}

.tui-gallery__info {
  color: #fff;
  font-size: 17px;
  line-height: 60px;
  min-height: 60px;
  text-align: center;
}

.tui-gallery__img__wrap {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  position: relative;
  font-size: 0;
}

.tui-gallery__operate {
  position: static;
}

.tui-gallery_show {
  display: flex !important;
  flex-direction: column !important;
  flex-wrap: nowrap !important;
}

.tui-opacity__del {
  opacity: 0.5;
}
</style>
