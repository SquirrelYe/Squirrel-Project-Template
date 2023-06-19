/**
 * 工具类：常用数据处理
 * @author echo.
 * @version 1.1.0
 * https://www.thorui.cn/doc
 **/

const utils = {
  /**
   * @desc 去左右空格
   * @param value 需要处理的字符串
   **/
  trim: function (value) {
    return value.replace(/(^\s*)|(\s*$)/g, '');
  },
  /**
   * @desc 去所有空格
   * @param value 需要处理的字符串
   **/
  trimAll: function (value) {
    return value.replace(/\s+/g, '');
  },
  /**
   * @desc 替换所有相同字符串
   * @param text 需要处理的字符串
   * @param repstr 被替换的字符
   * @param newstr 替换后的字符
   **/
  replaceAll: function (text, repstr, newstr) {
    return text.replace(new RegExp(repstr, 'gm'), newstr);
  },
  /**
   * @desc 格式化手机号码
   * @param num 手机号码
   **/
  formatNumber: function (num) {
    return num.length === 11 ? num.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2') : num;
  },
  /**
   * @desc 金额格式化，保留两位小数
   * @param money 金额值
   **/
  formatMoney: function (money) {
    return parseFloat(money)
      .toFixed(2)
      .toString()
      .split('')
      .reverse()
      .join('')
      .replace(/(\d{3})/g, '$1,')
      .replace(/\,$/, '')
      .split('')
      .reverse()
      .join('');
  },
  /**
   * @desc 日期格式化
   * @param formatStr 格式化字符串(y-m-d h:i:s)
   * @param fdate 需要格式化日期
   * @param type  fdate的格式：1-日期字符串(2017/12/04 12:12:12) 2-时间戳(1603676514690) 3-日期字符串，无连接符(20171204121212)
   * 4-new Date()时间格式(Thu Oct 01 2020 00:00:00 GMT+0800 (中国标准时间))
   * @param isMs  时间戳精度是否为毫秒（精度是秒时传false），type=2时有效
   **/
  formatDate: function (formatStr, fdate, type = 1, isMs = true) {
    let date = '';
    if (type === 3) {
      date = utils._formatTimeStr(fdate, formatStr);
    } else {
      date = utils._formatDate(formatStr, fdate, type, isMs);
    }
    return date;
  },
  _formatDate(formatStr, fdate, type = 1, isMs) {
    if (!fdate) return;
    let fTime,
      fStr = 'ymdhis';
    if (type === 4) {
      fTime = fdate;
    } else {
      fdate = fdate.toString();
      if (~fdate.indexOf('.')) {
        fdate = fdate.substring(0, fdate.indexOf('.'));
      }
      fdate = fdate.replace('T', ' ').replace(/\-/g, '/');
      if (!formatStr) formatStr = 'y-m-d h:i:s';
      if (fdate) {
        if (type === 2) {
          fdate = isMs ? Number(fdate) : Number(fdate) * 1000;
        }
        fTime = new Date(fdate);
      } else {
        fTime = new Date();
      }
    }
    var month = fTime.getMonth() + 1;
    var day = fTime.getDate();
    var hours = fTime.getHours();
    var minu = fTime.getMinutes();
    var second = fTime.getSeconds();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hours = hours < 10 ? '0' + hours : hours;
    minu = minu < 10 ? '0' + minu : minu;
    second = second < 10 ? '0' + second : second;
    var formatArr = [fTime.getFullYear().toString(), month.toString(), day.toString(), hours.toString(), minu.toString(), second.toString()];
    for (var i = 0; i < formatArr.length; i++) {
      formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
    }
    return formatStr;
  },
  /**
   * @desc 格式化时间
   * @param timeStr 时间字符串 20191212162001
   * @param formatStr 需要的格式 如 y-m-d h:i:s | y/m/d h:i:s | y/m/d | y年m月d日 等
   **/
  _formatTimeStr: function (timeStr, formatStr) {
    if (!timeStr) return;
    timeStr = timeStr.toString();
    if (timeStr.length === 14) {
      let timeArr = timeStr.split('');
      let fStr = 'ymdhis';
      if (!formatStr) {
        formatStr = 'y-m-d h:i:s';
      }
      let formatArr = [
        [...timeArr].splice(0, 4).join(''),
        [...timeArr].splice(4, 2).join(''),
        [...timeArr].splice(6, 2).join(''),
        [...timeArr].splice(8, 2).join(''),
        [...timeArr].splice(10, 2).join(''),
        [...timeArr].splice(12, 2).join('')
      ];
      for (let i = 0; i < formatArr.length; i++) {
        formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
      }
      return formatStr;
    }
    return timeStr;
  },
  /**
   * @desc RGB颜色转十六进制颜色
   * @param r
   * @param g
   * @param b
   **/
  rgbToHex: function (r, g, b) {
    return '#' + utils._toHex(r) + utils._toHex(g) + utils._toHex(b);
  },
  _toHex: function (n) {
    n = parseInt(n, 10);
    if (isNaN(n)) return '00';
    n = Math.max(0, Math.min(n, 255));
    return '0123456789ABCDEF'.charAt((n - (n % 16)) / 16) + '0123456789ABCDEF'.charAt(n % 16);
  },
  /**
   * @desc 十六进制颜色转RGB颜色
   * @param hex 颜色值 #333 或 #333333
   **/
  hexToRGB(hex) {
    if (hex.length === 4) {
      let text = hex.substring(1, 4);
      hex = '#' + text + text;
    }
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  },
  /**
   * @desc 唯一标识，随机数
   * @param n 随机数位数
   **/
  unique: function (n) {
    n = n || 6;
    let rnd = '';
    for (let i = 0; i < n; i++) rnd += Math.floor(Math.random() * 10);
    return 'tui_' + new Date().getTime() + rnd;
  },
  /**
   * @desc 获取uuid
   */
  getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      return (c === 'x' ? (Math.random() * 16) | 0 : 'r&0x3' | '0x8').toString(16);
    });
  },
  /**
   * @desc 简单数组合并去重
   * @param arr1 数组1
   * @param arr2 数组2 可不传
   **/
  distinctArray: function (arr1, arr2) {
    arr1 = arr1 || [];
    arr2 = arr2 || [];
    return [...new Set([...arr1, ...arr2])];
  },

  /**
   * @desc 获取日期时间段
   * @param type 1-今天 2-昨天 3-本周 4-本月 5-本年
   **/
  getDateTimeSlot: function (type) {
    let now = new Date();
    let start = now.toDateString();
    let end = now.toDateString();
    switch (type) {
      case 1:
        start = `${start} 00:00:00`;
        end = `${end} 23:59:59`;
        break;
      case 2:
        now.setTime(now.getTime() - 3600 * 1000 * 24 * 1);
        start = `${now.toDateString()} 00:00:00`;
        end = `${now.toDateString()} 23:59:59`;
        break;
      case 3:
        // 获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
        let weekday = now.getDay() || 7;
        // 往前算（weekday-1）天，年份、月份会自动变化
        now.setDate(now.getDate() - weekday + 1);
        start = `${now.toDateString()} 00:00:00`;
        end = `${end} 23:59:59`;
        break;
      case 4:
        start = `${now.getFullYear()}-${now.getMonth() + 1}-01 00:00:00`;
        end = `${end} 23:59:59`;
        break;
      case 5:
        start = `${now.getFullYear()}-01-01 00:00:00`;
        end = `${end} 23:59:59`;
        break;
      default:
        break;
    }

    return {
      start: new Date(start.replace(/\-/g, '/')),
      end: new Date(end.replace(/\-/g, '/'))
    };
  },
  /*
   * @desc 获取Url参数，返回一个对象
   * @param url url地址
   * ?a=1&b=2 ==> {a: "1", b: "2"}
   */
  getUrlParam(url) {
    let arrObj = url.split('?');
    let params = {};
    if (arrObj.length > 1) {
      arrObj = arrObj[1].split('&');
      arrObj.forEach(item => {
        item = item.split('=');
        params[item[0]] = item[1];
      });
    }
    return params;
  },
  /**
   * @method 函数防抖
   * @desc 短时间内多次触发同一事件，只执行最后一次，或者只执行最开始的一次，中间的不执行。
   * @param func 目标函数
   * @param wait 延迟执行毫秒数
   * @param immediate true - 立即执行， false - 延迟执行
   */
  debounce(func, wait = 1000, immediate = true) {
    let timer;
    return function () {
      let context = this,
        args = arguments;
      if (timer) clearTimeout(timer);
      if (immediate) {
        let callNow = !timer;
        timer = setTimeout(() => {
          timer = null;
        }, wait);
        if (callNow) func.apply(context, args);
      } else {
        timer = setTimeout(() => {
          func.apply(context, args);
        }, wait);
      }
    };
  },
  /**
   * @method 函数节流
   * @desc 指连续触发事件，但是在 n 秒内只执行一次函数。即 2n 秒内执行 2 次... 。会稀释函数的执行频率。
   * @param func 函数
   * @param wait 延迟执行毫秒数
   * @param type 1 在时间段开始的时候触发 2 在时间段结束的时候触发
   */
  throttle(func, wait = 1000, type = 1) {
    let previous = 0;
    let timeout;
    return function () {
      let context = this;
      let args = arguments;
      if (type === 1) {
        let now = Date.now();
        if (now - previous > wait) {
          func.apply(context, args);
          previous = now;
        }
      } else if (type === 2) {
        if (!timeout) {
          timeout = setTimeout(() => {
            timeout = null;
            func.apply(context, args);
          }, wait);
        }
      }
    };
  }
};

export default {
  trim: utils.trim,
  trimAll: utils.trimAll,
  replaceAll: utils.replaceAll,
  formatNumber: utils.formatNumber,
  formatMoney: utils.formatMoney,
  formatDate: utils.formatDate,
  rgbToHex: utils.rgbToHex,
  hexToRGB: utils.hexToRGB,
  unique: utils.unique,
  distinctArray: utils.distinctArray,
  getDateTimeSlot: utils.getDateTimeSlot,
  getUrlParam: utils.getUrlParam,
  getUUID: utils.getUUID,
  debounce: utils.debounce,
  throttle: utils.throttle
};
