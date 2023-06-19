/**
 * @description 通用返回值封装，统一Http返回信息，方便统一处理。
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.08 11:38:26
 */
class R extends Map<string, any> {
  // 基础返回值封装
  constructor() {
    super();
    this.set('code', 0);
    this.set('message', 'success');
    this.set('data', {});
  }

  // 封装失败返回函数
  private static errorFunc = (code: number | string, message: string): R => {
    const r = new R();
    r.set('code', code);
    r.set('message', message);
    return r;
  };

  /**
   * 失败返回值重载封装。
   * @param code number/string 当POJO内部传输是可当做type使用，HttpResult为请求状态码。
   * @param message POJO/HttpResult 中均为错误信息
   */
  static error(code?: number | string | undefined, message?: string | any | undefined): R {
    if (typeof code === 'undefined' && typeof message === 'undefined') return this.errorFunc(5000, 'Unknown exception, please contact the PGOS team.');
    if (typeof code === 'undefined' && typeof message !== 'undefined') return this.errorFunc(5000, message.message ? message.message : message);
    if (typeof code !== 'undefined' && typeof message === 'undefined') return this.errorFunc(code, '');
    if (typeof code !== 'undefined' && typeof message !== 'undefined') return this.errorFunc(code, message.message ? message.message : message);
  }

  // 成功返回值重载封装
  static ok = (data?: any): R => {
    const r: R = new R();
    if (typeof data !== 'undefined') r.set('data', data);
    return r;
  };

  // 获取返回值code
  public getErrCode() {
    return this.get('code');
  }

  // 格式化返回值
  public transformHttpReturnResult() {
    return {
      Code: this.get('code'),
      Message: this.get('message'),
      Data: this.get('data')
    };
  }

  override set(key: string, value: any): this {
    super.set(key, value);
    return this;
  }
}

export { R };
