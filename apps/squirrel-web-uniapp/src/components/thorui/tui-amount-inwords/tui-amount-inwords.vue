<template>
  <text v-if="show && money" class="tui-amount-inwords" :style="{ fontSize: size + 'rpx', color: color, fontWeight: fontWeight, padding: padding }">{{ money }}</text>
</template>

<script>
export default {
  name: 'tui-amount-inwords',
  emits: ['change'],
  props: {
    value: {
      type: [Number, String],
      default: 0
    },
    size: {
      type: [Number, String],
      default: 32
    },
    color: {
      type: String,
      default: '#333'
    },
    fontWeight: {
      type: [Number, String],
      default: 400
    },
    padding: {
      type: String,
      default: '0'
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      money: ''
    };
  },
  watch: {
    value(newValue, oldValue) {
      this.money = this.getAmountInWords(newValue);
      this.$emit('change', {
        moeny: this.money
      });
    }
  },
  created() {
    this.money = this.getAmountInWords(this.value);
    this.$emit('change', {
      moeny: this.money
    });
  },
  methods: {
    trimAll: function (value) {
      return value.toString().replace(/\s+/g, '').replace('￥', '');
    },
    getAmountInWords(money) {
      money = this.trimAll(money);
      //汉字的数字
      let cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
      //基本单位
      let cnIntRadice = new Array('', '拾', '佰', '仟');
      //对应整数部分扩展单位
      let cnIntUnits = new Array('', '万', '亿', '兆');
      //对应小数部分单位
      let cnDecUnits = new Array('角', '分', '毫', '厘');
      //整数金额时后面跟的字符
      let cnInteger = '整';
      //整型完以后的单位
      let cnIntLast = '元';
      //最大处理的数字
      let maxNum = 999999999999999.9999;
      //金额整数部分
      let integerNum;
      //金额小数部分
      let decimalNum;
      //输出的中文金额字符串
      let chineseStr = '';
      //分离金额后用的数组，预定义
      let parts;
      if (money == '') {
        return '';
      }
      money = parseFloat(money);
      if (money >= maxNum) {
        //超出最大处理数字
        return '';
      }
      if (money == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
      }
      //转换为字符串
      money = money.toString();
      if (money.indexOf('.') == -1) {
        integerNum = money;
        decimalNum = '';
      } else {
        parts = money.split('.');
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
      }
      //获取整型部分转换
      if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0;
        var IntLen = integerNum.length;
        for (var i = 0; i < IntLen; i++) {
          var n = integerNum.substr(i, 1);
          var p = IntLen - i - 1;
          var q = p / 4;
          var m = p % 4;
          if (n == '0') {
            zeroCount++;
          } else {
            if (zeroCount > 0) {
              chineseStr += cnNums[0];
            }
            //归零
            zeroCount = 0;
            chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
          }
          if (m == 0 && zeroCount < 4) {
            chineseStr += cnIntUnits[q];
          }
        }
        chineseStr += cnIntLast;
      }
      //小数部分
      if (decimalNum != '') {
        let decLen = decimalNum.length;
        for (let i = 0; i < decLen; i++) {
          let n = decimalNum.substr(i, 1);
          if (n != '0') {
            chineseStr += cnNums[Number(n)] + cnDecUnits[i];
          }
        }
      }
      if (chineseStr == '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
      } else if (decimalNum == '') {
        chineseStr += cnInteger;
      }
      return chineseStr;
    }
  }
};
</script>

<style scoped></style>
