const base = {
  /**
   * content-type:
   * form=>application/x-www-form-urlencoded
   * json=>application/json
   * ......
   */
  config() {
    return {
      //接口域名：https://base.com
      host: '',
      //接口地址：/login
      url: '',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      //有效值必须大写
      method: 'POST',
      //大于0时才生效，否则使用全局配置或者默认值
      timeout: 0,
      dataType: 'json',
      //String，不同接口请求名称不可相同，否则会拦截重复key的请求，不传默认不拦截
      requestTaskKey: '',
      //是否只返回简洁的接口数据：true 仅返回接口数据data，false 返回包含header、statusCode、errMsg、data等数据
      concise: false,
      showLoading: true,
      errorMsg: '网络不给力，请稍后再试~'
    };
  },
  getOptions(config) {
    let options = {
      ...config
    };
    ['host', 'timeout', 'requestTaskKey', 'showLoading', 'errorMsg'].forEach(item => {
      delete options[item];
    });
    return options;
  },
  merge(a, b) {
    return Object.assign({}, a, b);
  },
  mergeConfig(defaultConfig, config, init) {
    let header = base.merge(defaultConfig.header, config.header || {});
    let params = base.merge(defaultConfig, config);
    params.header = header;
    if (!init) {
      let url = base.combineURLs(params.host, params.url);
      params.url = url;
    }
    return params;
  },
  //如果host为空，则直接使用传入的目标地址
  combineURLs(host, target) {
    return host ? host.replace(/\s+/g, '') + '/' + target.replace(/\s+/g, '').replace(/^\/+/, '') : target;
  },
  toast(text, duration, success) {
    uni.showToast({
      title: text || '出错啦~',
      icon: success ? 'success' : 'none',
      duration: duration || 2000
    });
  },
  showLoading(title, mask = true) {
    uni.showLoading({
      mask: mask,
      title: title || '请稍候...'
    });
  }
};
export default base;
