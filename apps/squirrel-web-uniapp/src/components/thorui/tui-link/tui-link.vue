<template>
  <a v-if="isShowA" class="tui-link__text" :href="href" :class="{ 'tui-link__underline': underline }" :style="{ color: getColor, fontSize: size + 'rpx' }" :download="download">
    <slot>{{ text || href }}</slot>
  </a>
  <!-- #ifndef APP-NVUE -->
  <text v-else class="tui-link__text" :class="{ 'tui-link__underline': underline }" :style="{ color: getColor, fontSize: size + 'rpx' }" @tap="openURL">
    <slot>{{ text || href }}</slot>
  </text>
  <!-- #endif -->
  <!-- #ifdef APP-NVUE -->
  <text v-else class="tui-link__text" :class="{ 'tui-link__underline': underline }" :style="{ color: getColor, fontSize: size + 'rpx' }" @tap="openURL">{{ text || href }}</text>
  <!-- #endif -->
</template>

<script>
export default {
  name: 'tuiLink',
  options: {
    virtualHost: true
  },
  props: {
    href: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    download: {
      type: String,
      default: ''
    },
    underline: {
      type: [Boolean, String],
      default: false
    },
    copyTips: {
      type: String,
      default: '链接已复制'
    },
    color: {
      type: String,
      default: ''
    },
    size: {
      type: [Number, String],
      default: 28
    }
  },
  computed: {
    isShowA() {
      let h5 = false;
      // #ifdef H5
      h5 = true;
      // #endif
      if ((this.isMail() || this.isTel()) && h5) {
        return true;
      }
      return false;
    },
    getColor() {
      return this.color || (uni && uni.$tui && uni.$tui.color.link) || '#586c94';
    }
  },
  methods: {
    isMail() {
      return this.href.startsWith('mailto:');
    },
    isTel() {
      return this.href.startsWith('tel:');
    },
    openURL() {
      // #ifdef APP-PLUS
      if (this.isTel()) {
        this.makePhoneCall(this.href.replace('tel:', ''));
      } else {
        plus.runtime.openURL(this.href);
      }
      // #endif
      // #ifdef H5
      window.open(this.href);
      // #endif
      // #ifdef MP
      uni.setClipboardData({
        data: this.href,
        success: () => {
          uni.showToast({
            title: this.copyTips,
            icon: 'none'
          });
        }
      });

      // #endif
    },
    makePhoneCall(phoneNumber) {
      uni.makePhoneCall({
        phoneNumber
      });
    }
  }
};
</script>

<style scoped>
/* #ifdef H5 */
.tui-link__text {
  cursor: pointer;
}

/* #endif */
.tui-link__underline {
  text-decoration: underline;
}
</style>
