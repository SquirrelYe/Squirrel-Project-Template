<template>
  <view @touchmove.stop.prevent="stop" v-if="isFixed">
    <view class="tui-bottom-popup" :class="{ 'tui-popup-show': isShow }">
      <view class="tui-calendar-header" :class="{ 'tui-calendar-radius': radius }">
        <view>{{ title }}</view>
        <view class="tui-iconfont tui-font-close" hover-class="tui-opacity" :hover-stay-time="150" @tap="hide"> </view>
      </view>

      <view class="tui-date-box">
        <view class="tui-iconfont tui-font-arrowleft" :style="{ color: yearArrowColor }" hover-class="tui-opacity" :hover-stay-time="150" v-if="arrowType == 1" @tap="changeYear(0)"></view>
        <view class="tui-iconfont tui-font-arrowleft" :style="{ color: monthArrowColor }" hover-class="tui-opacity" :hover-stay-time="150" @tap="changeMonth(0)"></view>
        <view class="tui-date_time">{{ showTitle }}</view>
        <view class="tui-iconfont tui-font-arrowright" :style="{ color: monthArrowColor }" hover-class="tui-opacity" :hover-stay-time="150" @tap="changeMonth(1)"></view>
        <view class="tui-iconfont tui-font-arrowright" :style="{ color: yearArrowColor }" hover-class="tui-opacity" :hover-stay-time="150" v-if="arrowType == 1" @tap="changeYear(1)"></view>
      </view>
      <view class="tui-date-header">
        <view class="tui-date">日</view>
        <view class="tui-date">一</view>
        <view class="tui-date">二</view>
        <view class="tui-date">三</view>
        <view class="tui-date">四</view>
        <view class="tui-date">五</view>
        <view class="tui-date">六</view>
      </view>
      <view class="tui-date-content" :class="{ 'tui-flex-start': isFixed && fixedHeight }" :style="{ height: isFixed && fixedHeight ? dateHeight * 6 + 'px' : 'auto' }">
        <block v-for="(item, index) in weekdayArr" :key="index">
          <view class="tui-date"></view>
        </block>
        <view
          class="tui-date"
          :class="{
            'tui-date-pd_0': isFixed && fixedHeight,
            'tui-opacity': openDisAbled(year, month, index + 1),
            'tui-start-date': (type == 2 && startDate == `${year}-${month}-${index + 1}`) || type == 1,
            'tui-end-date': (type == 2 && endDate == `${year}-${month}-${index + 1}`) || type == 1
          }"
          :style="{ backgroundColor: isFixed ? getColor(index, 1) : 'transparent', height: isFixed && fixedHeight ? dateHeight + 'px' : 'auto' }"
          v-for="(item, index) in daysArr"
          :key="index"
          @tap="dateClick(index)"
        >
          <view class="tui-date-text" :style="{ color: isFixed ? getColor(index, 2) : getStatusData(3, index), backgroundColor: getStatusData(2, index) }">
            <view v-if="isFixed || !getStatusData(4, index)">{{ index + 1 }}</view>
            <view v-if="!getStatusData(4, index)" class="tui-custom-desc" :class="{ 'tui-lunar-unshow': !lunar && isFixed }">
              {{ getDescText(index, startDate, endDate) }}
            </view>
            <text class="tui-iconfont tui-font-check" v-if="getStatusData(4, index)"></text>
          </view>
          <view class="tui-date-desc" :style="{ color: activeColor }" v-if="!lunar && type == 2 && startDate == `${year}-${month}-${index + 1}` && startDate != endDate">
            {{ startText }}
          </view>
          <view class="tui-date-desc" :style="{ color: activeColor }" v-if="!lunar && type == 2 && endDate == `${year}-${month}-${index + 1}`">{{ endText }}</view>
        </view>
        <view class="tui-bg-month">{{ month }}</view>
      </view>

      <view class="tui-calendar-op">
        <view class="tui-calendar-result">
          <text>{{ type == 1 ? activeDate : startDate }}</text>
          <text v-if="endDate">至{{ endDate }}</text>
        </view>
        <view class="tui-calendar-btn_box">
          <view :style="{ background: getBtnBgColor }" @tap.stop="btnFix(false)" class="tui-btn__confirm" :class="{ 'tui-btn__disabled': disabled, 'tui-btn__confirm-hover': !disabled }">确定</view>
        </view>
      </view>
    </view>

    <view class="tui-popup-mask" :class="[isShow ? 'tui-mask-show' : '']" @tap="hide"></view>
  </view>
  <view v-else>
    <view class="tui-date-box">
      <view class="tui-iconfont tui-font-arrowleft" :style="{ color: yearArrowColor }" hover-class="tui-opacity" :hover-stay-time="150" v-if="arrowType == 1" @tap="changeYear(0)"></view>
      <view class="tui-iconfont tui-font-arrowleft" :style="{ color: monthArrowColor }" hover-class="tui-opacity" :hover-stay-time="150" @tap="changeMonth(0)"></view>
      <view class="tui-date_time">{{ showTitle }}</view>
      <view class="tui-iconfont tui-font-arrowright" :style="{ color: monthArrowColor }" hover-class="tui-opacity" :hover-stay-time="150" @tap="changeMonth(1)"></view>
      <view class="tui-iconfont tui-font-arrowright" :style="{ color: yearArrowColor }" hover-class="tui-opacity" :hover-stay-time="150" v-if="arrowType == 1" @tap="changeYear(1)"></view>
    </view>
    <view class="tui-date-header">
      <view class="tui-date">日</view>
      <view class="tui-date">一</view>
      <view class="tui-date">二</view>
      <view class="tui-date">三</view>
      <view class="tui-date">四</view>
      <view class="tui-date">五</view>
      <view class="tui-date">六</view>
    </view>
    <view class="tui-date-content" :style="{ height: isFixed && fixedHeight ? dateHeight * 6 + 'px' : 'auto' }">
      <block v-for="(item, index) in weekdayArr" :key="index">
        <view class="tui-date"></view>
      </block>
      <view
        class="tui-date"
        :class="{
          'tui-date-pd_0': isFixed && fixedHeight,
          'tui-opacity': openDisAbled(year, month, index + 1),
          'tui-start-date': (type == 2 && startDate == `${year}-${month}-${index + 1}`) || type == 1,
          'tui-end-date': (type == 2 && endDate == `${year}-${month}-${index + 1}`) || type == 1
        }"
        :style="{ backgroundColor: isFixed ? getColor(index, 1) : 'transparent', height: isFixed && fixedHeight ? dateHeight + 'px' : 'auto' }"
        v-for="(item, index) in daysArr"
        :key="index"
        @tap="dateClick(index)"
      >
        <view class="tui-date-text" :style="{ color: isFixed ? getColor(index, 2) : getStatusData(3, index), backgroundColor: getStatusData(2, index) }">
          <view v-if="isFixed || !getStatusData(4, index)">{{ index + 1 }}</view>
          <view v-if="!getStatusData(4, index)" class="tui-custom-desc" :class="{ 'tui-lunar-unshow': !lunar && isFixed }">
            {{ getDescText(index, startDate, endDate) }}
          </view>
          <text class="tui-iconfont tui-font-check" v-if="getStatusData(4, index)"></text>
        </view>
        <view class="tui-date-desc" :style="{ color: activeColor }" v-if="!lunar && type == 2 && startDate == `${year}-${month}-${index + 1}` && startDate != endDate">
          {{ startText }}
        </view>
        <view class="tui-date-desc" :style="{ color: activeColor }" v-if="!lunar && type == 2 && endDate == `${year}-${month}-${index + 1}`">{{ endText }}</view>
      </view>
      <view class="tui-bg-month">{{ month }}</view>
    </view>
  </view>
</template>
<script>
import calendar from './tui-calendar.js';
export default {
  name: 'tuiCalendar',
  emits: ['hide', 'change'],
  props: {
    //1-切换月份和年份 2-切换月份
    arrowType: {
      type: [Number, String],
      default: 1
    },
    //1-单个日期选择 2-开始日期+结束日期选择 3-多个日期
    type: {
      type: Number,
      default: 1
    },
    //可切换最大年份
    maxYear: {
      type: Number,
      default: 2030
    },
    //可切换最小年份
    minYear: {
      type: Number,
      default: 1920
    },
    //最小可选日期(不在范围内日期禁用不可选)
    minDate: {
      type: String,
      default: '1920-01-01'
    },
    /**
     * 最大可选日期
     * 默认最大值为今天，之后的日期不可选
     * 2030-12-31
     * */
    maxDate: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '日期选择'
    },
    //显示圆角
    radius: {
      type: Boolean,
      default: true
    },
    //状态 数据顺序与当月天数一致，index=>day
    /**
					 * [{
						 * text:"", 描述：2字以内
						 * value:"",状态值 
						 * bgColor:"",背景色
						 * color:""  文字颜色,
						 * check:false //是否显示对勾
						 * 
					 }]
					 * 
					 * **/
    status: {
      type: Array,
      default() {
        return [];
      }
    },
    //月份切换箭头颜色
    monthArrowColor: {
      type: String,
      default: '#999'
    },
    //年份切换箭头颜色
    yearArrowColor: {
      type: String,
      default: '#bcbcbc'
    },
    //默认日期字体颜色
    color: {
      type: String,
      default: '#333'
    },
    //选中|起始结束日期背景色
    activeBgColor: {
      type: String,
      default: ''
    },
    //选中|起始结束日期字体颜色
    activeColor: {
      type: String,
      default: '#fff'
    },
    //范围内日期背景色
    rangeBgColor: {
      type: String,
      default: 'rgba(86,119,252,0.1)'
    },
    //范围内日期字体颜色
    rangeColor: {
      type: String,
      default: ''
    },
    //type=2时生效，起始日期自定义文案
    startText: {
      type: String,
      default: '开始'
    },
    //type=2时生效，结束日期自定义文案
    endText: {
      type: String,
      default: '结束'
    },
    //按钮背景色 V2.3.0+
    btnBgColor: {
      type: String,
      default: ''
    },
    //固定在底部
    isFixed: {
      type: Boolean,
      default: false
    },
    //固定日历容器高度，isFixed=true时生效
    fixedHeight: {
      type: Boolean,
      default: true
    },
    //当前选中日期带选中效果
    isActiveCurrent: {
      type: Boolean,
      default: true
    },
    //切换年月是否触发事件 type=1时生效
    isChange: {
      type: Boolean,
      default: false
    },
    //是否显示农历
    lunar: {
      type: Boolean,
      default: false
    },
    //初始化起始选中日期 格式： 2020-06-06 或 2020/06/06 【type=1 or 2】
    initStartDate: {
      type: [String, Array],
      default: ''
    },
    //初始化结束日期 格式： 2020-06-06 或 2020/06/06【type=2】
    initEndDate: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow: false,
      weekday: 1, // 星期几,值为1-7
      weekdayArr: [],
      days: 0, //当前月有多少天
      daysArr: [],
      showTitle: '',
      year: 2020,
      month: 0,
      day: 0,
      startYear: 0,
      startMonth: 0,
      startDay: 0,
      endYear: 0,
      endMonth: 0,
      endDay: 0,
      today: '',
      activeDate: '',
      startDate: '',
      endDate: '',
      isStart: true,
      min: null,
      max: null,
      dateHeight: 20
    };
  },
  computed: {
    dataChange() {
      return `${this.type}-${this.minDate}-${this.maxDate}-${this.initStartDate}-${this.initEndDate}`;
    },
    disabled() {
      return this.type == 2 && (!this.startDate || !this.endDate);
    },
    getActiveBgColor() {
      return this.activeBgColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    },
    getBtnBgColor() {
      return this.btnBgColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    },
    getRangeColor() {
      return this.rangeColor || (uni && uni.$tui && uni.$tui.color.primary) || '#5677fc';
    }
  },
  watch: {
    dataChange(val) {
      this.init();
    },
    fixedHeight(val) {
      if (val) {
        this.initDateHeight();
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    getColor(index, type) {
      let color = type == 1 ? '' : this.color;
      let day = index + 1;
      let date = `${this.year}-${this.month}-${day}`;
      let timestamp = new Date(date.replace(/\-/g, '/')).getTime();
      let start = this.startDate.replace(/\-/g, '/');
      let end = this.endDate.replace(/\-/g, '/');
      if ((this.isActiveCurrent && this.activeDate == date) || this.startDate == date || this.endDate == date) {
        color = type == 1 ? this.getActiveBgColor : this.activeColor;
      } else if (this.endDate && timestamp > new Date(start).getTime() && timestamp < new Date(end).getTime()) {
        color = type == 1 ? this.rangeBgColor : this.getRangeColor;
      }
      return color;
    },
    //获取状态数据
    getStatusData(type, index) {
      //1-描述text,2-bgColor背景色,3-color文字颜色 4-check 是否显示对勾
      let val = ['', 'transparent', '#333', ''][type - 1];
      if (!this.isFixed && this.status && this.status.length > 0) {
        let item = this.status[index];
        if (item) {
          switch (type) {
            case 1:
              val = item.text;
              break;
            case 2:
              val = item.bgColor;
              break;
            case 3:
              val = item.color;
              break;
            case 4:
              val = item.check;
              break;
            default:
              break;
          }
        }
      }
      return val;
    },
    getDescText(index, startDate, endDate) {
      let text = this.lunar ? this.getLunar(this.year, this.month, index + 1) : '';
      if (this.isFixed && this.type == 2) {
        //此判断不能与上面条件一起判断
        if (this.lunar) {
          let date = `${this.year}-${this.month}-${index + 1}`;
          if (startDate == date && startDate != endDate) {
            text = this.startText;
          } else if (endDate == date) {
            text = this.endText;
          }
        }
      } else {
        let status = this.getStatusData(1, index);
        if (status) text = status;
      }
      return text;
    },
    getLunar(year, month, day) {
      let obj = calendar.solar2lunar(year, month, day);
      return obj.IDayCn;
    },
    initDateHeight() {
      if (this.fixedHeight && this.isFixed) {
        this.dateHeight = uni.getSystemInfoSync().windowWidth / 7;
      }
    },
    init() {
      this.initDateHeight();
      let now = new Date();
      this.year = now.getFullYear();
      this.month = now.getMonth() + 1;
      this.day = now.getDate();
      this.today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      this.activeDate = this.today;
      this.min = this.initDate(this.minDate);
      this.max = this.initDate(this.maxDate || this.today);
      if (this.openDisAbled(this.year, this.month, this.day)) {
        this.year = this.min.year;
        this.month = this.min.month;
        this.day = this.min.day;
        this.activeDate = `${this.min.year}-${this.min.month}-${this.min.day}`;
        this.max = this.initDate(this.maxDate || this.minDate);
      }
      this.startDate = '';
      this.startYear = 0;
      this.startMonth = 0;
      this.startDay = 0;
      if (this.initStartDate) {
        let start = new Date(this.initStartDate.replace(/\-/g, '/'));
        if (this.type == 1) {
          this.year = start.getFullYear();
          this.month = start.getMonth() + 1;
          this.day = start.getDate();
          this.activeDate = `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`;
        } else {
          this.startDate = `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`;
          this.startYear = start.getFullYear();
          this.startMonth = start.getMonth() + 1;
          this.startDay = start.getDate();
          this.activeDate = '';
        }
      }
      this.endYear = 0;
      this.endMonth = 0;
      this.endDay = 0;
      this.endDate = '';
      if (this.initEndDate && this.type == 2) {
        let end = new Date(this.initEndDate.replace(/\-/g, '/'));
        this.endDate = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`;
        this.endYear = end.getFullYear();
        this.endMonth = end.getMonth() + 1;
        this.endDay = end.getDate();
        this.activeDate = '';
        this.year = end.getFullYear();
        this.month = end.getMonth() + 1;
        this.day = end.getDate();
      }
      this.isStart = true;
      this.changeData();
    },
    //日期处理
    initDate(date) {
      let fdate = date.split('-');
      return {
        year: Number(fdate[0] || 1920),
        month: Number(fdate[1] || 1),
        day: Number(fdate[2] || 1)
      };
    },
    openDisAbled: function (year, month, day) {
      let bool = true;
      let date = `${year}/${month}/${day}`;
      // let today = this.today.replace(/\-/g, '/');
      let min = `${this.min.year}/${this.min.month}/${this.min.day}`;
      let max = `${this.max.year}/${this.max.month}/${this.max.day}`;
      let timestamp = new Date(date).getTime();
      if (timestamp >= new Date(min).getTime() && timestamp <= new Date(max).getTime()) {
        bool = false;
      }
      return bool;
    },
    generateArray: function (start, end) {
      return Array.from(new Array(end + 1).keys()).slice(start);
    },
    formatNum: function (num) {
      return num < 10 ? '0' + num : num + '';
    },
    stop() {
      return false;
    },
    //一个月有多少天
    getMonthDay(year, month) {
      let days = new Date(year, month, 0).getDate();
      return days;
    },
    getWeekday(year, month) {
      let date = new Date(`${year}/${month}/01 00:00:00`);
      return date.getDay();
    },
    checkRange(year) {
      let overstep = false;
      if (year < this.minYear || year > this.maxYear) {
        uni.showToast({
          title: '日期超出范围啦~',
          icon: 'none'
        });
        overstep = true;
      }
      return overstep;
    },
    changeMonth(isAdd) {
      if (isAdd) {
        let month = this.month + 1;
        let year = month > 12 ? this.year + 1 : this.year;
        if (!this.checkRange(year)) {
          this.month = month > 12 ? 1 : month;
          this.year = year;
          this.changeData();
        }
      } else {
        let month = this.month - 1;
        let year = month < 1 ? this.year - 1 : this.year;
        if (!this.checkRange(year)) {
          this.month = month < 1 ? 12 : month;
          this.year = year;
          this.changeData();
        }
      }
    },
    changeYear(isAdd) {
      let year = isAdd ? this.year + 1 : this.year - 1;
      if (!this.checkRange(year)) {
        this.year = year;
        this.changeData();
      }
    },
    changeData() {
      this.days = this.getMonthDay(this.year, this.month);
      this.daysArr = this.generateArray(1, this.days);
      this.weekday = this.getWeekday(this.year, this.month);
      this.weekdayArr = this.generateArray(1, this.weekday);
      this.showTitle = `${this.year}年${this.month}月`;
      if (this.isChange && this.type == 1) {
        this.btnFix(true);
      }
    },
    dateClick: function (day) {
      day += 1;
      if (!this.openDisAbled(this.year, this.month, day)) {
        this.day = day;
        let date = `${this.year}-${this.month}-${day}`;
        if (this.type == 1) {
          this.activeDate = date;
        } else {
          let compare = new Date(date.replace(/\-/g, '/')).getTime() < new Date(this.startDate.replace(/\-/g, '/')).getTime();
          if (this.isStart || compare) {
            this.startDate = date;
            this.startYear = this.year;
            this.startMonth = this.month;
            this.startDay = this.day;
            this.endYear = 0;
            this.endMonth = 0;
            this.endDay = 0;
            this.endDate = '';
            this.activeDate = '';
            this.isStart = false;
          } else {
            this.endDate = date;
            this.endYear = this.year;
            this.endMonth = this.month;
            this.endDay = this.day;
            this.isStart = true;
          }
        }
        if (!this.isFixed) {
          this.btnFix();
        }
      }
    },
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
      this.$emit('hide', {});
    },
    getWeekText(date) {
      date = new Date(`${date.replace(/\-/g, '/')} 00:00:00`);
      let week = date.getDay();
      return '星期' + ['日', '一', '二', '三', '四', '五', '六'][week];
    },
    btnFix(show) {
      if (!show) {
        if (this.disabled) return;
        this.hide();
      }
      if (this.type == 1) {
        let arr = this.activeDate.split('-');
        let year = this.isChange ? this.year : Number(arr[0]);
        let month = this.isChange ? this.month : Number(arr[1]);
        let day = this.isChange ? this.day : Number(arr[2]);
        //当前月有多少天
        let days = this.getMonthDay(year, month);
        let result = `${year}-${this.formatNum(month)}-${this.formatNum(day)}`;
        let weekText = this.getWeekText(result);
        let isToday = false;
        if (`${year}-${month}-${day}` == this.today) {
          //今天
          isToday = true;
        }
        let lunar = calendar.solar2lunar(year, month, day);
        this.$emit('change', {
          year: year,
          month: month,
          day: day,
          days: days,
          result: result,
          week: weekText,
          isToday: isToday,
          switch: show, //是否是切换年月操作
          lunar: lunar
        });
      } else {
        if (!this.startDate || !this.endDate) return;
        let startMonth = this.formatNum(this.startMonth);
        let startDay = this.formatNum(this.startDay);
        let startDate = `${this.startYear}-${startMonth}-${startDay}`;
        let startWeek = this.getWeekText(startDate);
        let startLunar = calendar.solar2lunar(this.startYear, startMonth, startDay);

        let endMonth = this.formatNum(this.endMonth);
        let endDay = this.formatNum(this.endDay);
        let endDate = `${this.endYear}-${endMonth}-${endDay}`;
        let endWeek = this.getWeekText(endDate);
        let endLunar = calendar.solar2lunar(this.endYear, endMonth, endDay);
        this.$emit('change', {
          startYear: this.startYear,
          startMonth: this.startMonth,
          startDay: this.startDay,
          startDate: startDate,
          startWeek: startWeek,
          startLunar: startLunar,
          endYear: this.endYear,
          endMonth: this.endMonth,
          endDay: this.endDay,
          endDate: endDate,
          endWeek: endWeek,
          endLunar: endLunar
        });
      }
    }
  }
};
</script>

<style scoped>
@font-face {
  font-family: 'tuiDateFont';
  src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAVgAA0AAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAFRAAAABoAAAAci0/w50dERUYAAAUkAAAAHgAAAB4AKQANT1MvMgAAAaAAAABDAAAAVjxuSNNjbWFwAAAB+AAAAEoAAAFS5iPQt2dhc3AAAAUcAAAACAAAAAj//wADZ2x5ZgAAAlQAAAFHAAABvPf29TBoZWFkAAABMAAAADAAAAA2GMsN3WhoZWEAAAFgAAAAHQAAACQHjAOFaG10eAAAAeQAAAATAAAAFgzQAPJsb2NhAAACRAAAABAAAAAQAOoBSG1heHAAAAGAAAAAHgAAACABEwA3bmFtZQAAA5wAAAFJAAACiCnmEVVwb3N0AAAE6AAAADQAAABLUwjqHHjaY2BkYGAAYp5Gj5/x/DZfGbhZGEDg1tUn7+F00P/LzOuY9YFcDgYmkCgAa0gNlHjaY2BkYGBu+N/AEMPCAALM6xgYGVABCwBT4AMaAAAAeNpjYGRgYGBn0GZgYgABEMkFhAwM/8F8BgANaAFLAAB42mNgZGFgnMDAysDA1Ml0hoGBoR9CM75mMGLkAIoysDIzYAUBaa4pDA7PGJ49ZG7438AQw9zA0AAUZgTJAQDrcAy8AHjaY2GAABYIDgLCBQx1AAcEAc8AeNpjYGBgZoBgGQZGBhDwAfIYwXwWBgMgzQGETAwMzxifcTx7+P8/kMUAYUkxS/6VVIXqAgNGNgY4lxGoB6QPBTAyDHsAADDkDYkAAAAAAAAAAAAAADQAagC2AN542m2QsU7DMBCG/Tt1bNPUiUnkSgiVtqKpxJAgVLVbeAa6MaK+B4JXgJWBjY21UtW5gpkdMTFX7dzApaJLhXU6n8+n//ttxtn458N79XJWZ8eMxS00C4wy9A1EP8PQncAlIQzS4WgsVtPpSmwzV3OFRqLetH5TSQMK939X61ptPZ2p2EAttNMLBRMrtschQblDeS34aY50cIkCzg/B2Y5C+VpyQxhFkRgu515O8jvU5mmPM2O0wJ5Z27vhX+yMsV437WvCdTM+GI40MgwKfuGammC0uURqeqFMfe9cxaJclkt5GMaB1hIR1VobOgpEiKq+sLZcIrJWhO3/Jw7qWlYj1Jf21FaCtmd5bevrlk28O/7A4spXTl4KTh9MTlqQ8PESBRstReic+sRj0Dni9fIqmNS/pXNWCvWOeYBmx5S9Bsn9Ah+5WtAAeNp9kD1OAzEQhZ/zByQSQiCoXVEA2vyUKRMp9Ailo0g23pBo1155nUg5AS0VB6DlGByAGyDRcgpelkmTImvt6PObmeexAZzjGwr/3yXuhBWO8ShcwREy4Sr1F+Ea+V24jhY+hRvUf4SbuFUD4RYu1BsdVO2Eu5vSbcsKZxgIV3CKJ+Eq9ZVwjfwqXMcVPoQb1L+EmxjjV7iFa2WpDOFhMEFgnEFjig3jAjEcLJIyBtahOfRmEsxMTzd6ETubOBso71dilwMeaDnngCntPbdmvkon/mDLgdSYbh4FS7YpjS4idCgbXyyc1d2oc7D9nu22tNi/a4E1x+xRDWzU/D3bM9JIbAyvkJI18jK3pBJTj2hrrPG7ZynW814IiU68y/SIx5o0dTr3bmniwOLn8owcfbS5kj33qBw+Y1kIeb/dTsQgil2GP5PYcRkAAAB42mNgYoAALjDJyIAO2MGiTIxMjMyMLIys7GmJeRmlmWZQ2pQ5OSORLaU0Mz2/FACDfwlbAAAAAf//AAIAAQAAAAwAAAAWAAAAAgABAAMABgABAAQAAAACAAAAAHjaY2BgYGQAgqtL1DlA9K2rT97DaABNlwiuAAA=)
    format('woff');
  font-weight: normal;
  font-style: normal;
}

.tui-iconfont {
  font-family: 'tuiDateFont' !important;
  font-size: 36rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.tui-font-close:before {
  content: '\e608';
}

.tui-font-check:before {
  content: '\e6e1';
}

.tui-font-arrowright:before {
  content: '\e600';
}

.tui-font-arrowleft:before {
  content: '\e601';
}

.tui-date-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0 30rpx;
  background-color: #fff;
}

.tui-calendar-radius {
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  overflow: hidden;
}

.tui-date_time {
  padding: 0 16rpx;
  color: #333;
  font-size: 32rpx;
  line-height: 32rpx;
  font-weight: bold;
}

.tui-font-arrowleft {
  margin-right: 32rpx;
}

.tui-font-arrowright {
  margin-left: 32rpx;
}

.tui-date-header {
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #fff;
  font-size: 24rpx;
  line-height: 24rpx;
  color: #555;
  box-shadow: 0 15rpx 20rpx -15rpx #efefef;
  position: relative;
  z-index: 2;
}

.tui-date-content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 12rpx 0;
  box-sizing: border-box;
  background-color: #fff;
  position: relative;
}

.tui-flex-start {
  align-content: flex-start;
}

.tui-bg-month {
  position: absolute;
  font-size: 260rpx;
  line-height: 260rpx;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #f5f5f7;
  z-index: 1;
}

.tui-date {
  width: 14.2857%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx 0;
  overflow: hidden;
  position: relative;
  z-index: 2;
}

.tui-date-pd_0 {
  padding: 0 !important;
}

.tui-start-date {
  border-top-left-radius: 8rpx;
  border-bottom-left-radius: 8rpx;
}

.tui-end-date {
  border-top-right-radius: 8rpx;
  border-bottom-right-radius: 8rpx;
}

.tui-date-text {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 32rpx;
  line-height: 32rpx;
  position: relative;
  border-radius: 50%;
}

.tui-btn-calendar {
  padding: 16rpx;
  box-sizing: border-box;
  text-align: center;
  text-decoration: none;
}

.tui-opacity {
  opacity: 0.5;
}

.tui-bottom-popup {
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  visibility: hidden;
  transform: translate3d(0, 100%, 0);
  transform-origin: center;
  transition: all 0.3s ease-in-out;
  min-height: 20rpx;
}

.tui-popup-show {
  transform: translate3d(0, 0, 0);
  visibility: visible;
}

.tui-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9996;
  transition: all 0.3s ease-in-out;
  opacity: 0;
  visibility: hidden;
}

.tui-mask-show {
  opacity: 1;
  visibility: visible;
}

.tui-calendar-header {
  width: 100%;
  height: 80rpx;
  padding: 0 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  font-size: 30rpx;
  background-color: #fff;
  color: #555;
  position: relative;
}

.tui-font-close {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.tui-btn-calendar {
  padding: 16rpx;
  box-sizing: border-box;
  text-align: center;
  text-decoration: none;
}

.tui-font-check {
  color: #fff;
  font-size: 54rpx;
  line-height: 54rpx;
}

.tui-custom-desc {
  width: 100%;
  font-size: 24rpx;
  line-height: 24rpx;
  transform: scale(0.8);
  transform-origin: center center;
  text-align: center;
}

.tui-lunar-unshow {
  position: absolute;
  left: 0;
  bottom: 8rpx;
  z-index: 2;
}

.tui-date-desc {
  width: 100%;
  font-size: 24rpx;
  line-height: 24rpx;
  position: absolute;
  left: 0;
  transform: scale(0.8);
  transform-origin: center center;
  text-align: center;
  bottom: 8rpx;
  z-index: 2;
}

.tui-calendar-op {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #fff;
  padding: 0 42rpx 30rpx;
  box-sizing: border-box;
  font-size: 24rpx;
  color: #666;
}

.tui-calendar-result {
  height: 48rpx;
  transform: scale(0.9);
  transform-origin: center 100%;
}

.tui-calendar-btn_box {
  width: 100%;
}

.tui-btn__confirm {
  width: 100%;
  height: 72rpx;
  border-radius: 72rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
  color: #fff;
  position: relative;
}

.tui-btn__confirm-hover:active::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 72rpx;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 72rpx;
  pointer-events: none;
}

.tui-btn__disabled {
  opacity: 0.5;
  /* #ifdef H5 */
  cursor: not-allowed;
  /* #endif */
}
</style>
