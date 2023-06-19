/**
 * @description 时间工具类
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.12 15:49:55
 */
class TimeUtils {
  // 2023-06-12T07:25:31.000Z 转换为东八区时间，然后格式化为 06.12
  public static formatTime2LocalDate(time: string): string {
    const timeArr = new Date(time).toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' }).split('/');
    return `${timeArr[1]}.${timeArr[2]}`;
  }

  // 2023-06-12T07:25:31.000Z 转换为东八区时间，然后格式化为 2023.06.12 15:25
  public static formatTime2LocalDateTime(time: string | number): string {
    const timeArr = new Date(time).toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' }).split('/');
    const timeArr2 = new Date(time).toLocaleTimeString('en-US', { timeZone: 'Asia/Shanghai', hour12: false }).split(':');
    return `${timeArr.join('/').toString()} ${timeArr2[0]}:${timeArr2[1]}`;
  }
}

export { TimeUtils };
