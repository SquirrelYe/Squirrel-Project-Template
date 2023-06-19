/**
 * @description 工具类
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.04 02:00:47
 */
class Utils {
  // 判断当前设备是否为IOS
  public static isIOS() {
    const res = uni.getSystemInfoSync();
    return 'ios' == res.platform.toLocaleLowerCase();
  }

  // 判断当前设备是否为Android
  public static isAndroid() {
    const res = uni.getSystemInfoSync();
    return 'android' == res.platform.toLocaleLowerCase();
  }

  // 展示提醒
  public static showToast = (title: string | undefined, duration: number, icon: 'none' | 'success' | 'loading' | 'error' | undefined) => {
    uni.showToast({
      title: title || '未知错误',
      duration: duration || 2 * 1000,
      icon: icon || 'none'
    });
  };

  // 展示弹窗
  public static showModal = (title: string, content: string, showCancel: boolean, cancelText: string, confirmText: string) => {
    return new Promise(resolve => {
      uni.showModal({
        title: title || '提示',
        content: content || '未知错误',
        showCancel: showCancel,
        cancelText: cancelText || '取消',
        confirmText: confirmText || '确定',
        fail: () => resolve(false),
        success: () => resolve(true)
      });
    });
  };

  // 展示加载中
  public static showLoading = (title: string, mask?: boolean) => {
    uni.showLoading({
      title: title || '加载中，请稍后...',
      mask: mask
    });
  };
}

export { Utils };
