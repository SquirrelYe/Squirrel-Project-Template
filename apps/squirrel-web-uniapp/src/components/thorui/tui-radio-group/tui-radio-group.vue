<template>
  <!-- #ifdef APP-PLUS || H5 || MP-ALIPAY || MP-TOUTIAO -->
  <radio-group :name="name">
    <slot></slot>
  </radio-group>
  <!-- #endif -->

  <!-- #ifdef MP-WEIXIN ||  MP-BAIDU || MP-QQ -->
  <tui-form-field :name="name" v-model="val">
    <slot></slot>
  </tui-form-field>
  <!-- #endif -->
</template>

<script>
export default {
  name: 'tui-radio-group',
  emits: ['change', 'input', 'update:modelValue'],
  // #ifdef MP-WEIXIN
  behaviors: ['wx://form-field-group'],
  // #endif
  // #ifdef MP-BAIDU || MP-QQ
  //如果在这些平台不需要也能识别，则删除
  behaviors: ['uni://form-field'],
  // #endif
  // #ifdef MP-WEIXIN
  options: {
    virtualHost: true
  },
  // #endif
  props: {
    name: {
      type: String,
      default: ''
    },
    // #ifdef VUE3
    modelValue: {
      type: String,
      default: ''
    },
    // #endif
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      val: ''
    };
  },
  watch: {
    // #ifdef VUE3
    modelValue(val) {
      this.modelChange(val);
    },
    // #endif
    value(val) {
      this.modelChange(val);
    }
  },
  created() {
    this.childrens = [];
  },
  methods: {
    radioChange(e) {
      this.$emit('change', e);
      this.$emit('input', e.detail.value);
      // #ifdef VUE3
      this.$emit('update:modelValue', e.detail.value);
      // #endif
    },
    changeValue(value, target) {
      this.val = value;
      this.childrens.forEach(item => {
        if (item !== target) {
          item.val = false;
        }
      });
      let e = {
        detail: {
          value: value
        }
      };
      this.radioChange(e);
    },
    modelChange(value) {
      this.childrens.forEach(item => {
        if (item.value === value) {
          item.val = true;
        } else {
          item.val = false;
        }
      });
    }
  }
};
</script>
<style></style>
