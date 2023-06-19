import { ConsoleLogger } from '@nestjs/common';

/**
 * @description 全局Logger日志封装类
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.15 15:01:00
 */
class Logger {
  public logger: ConsoleLogger;

  constructor(context: string) {
    this.logger = new ConsoleLogger(context);
  }

  public formatMessage(message: Array<any>) {
    return message
      .map(item => {
        if (typeof item === 'object') {
          try {
            return JSON.stringify(item);
          } catch (error) {
            return item;
          }
        }
        return item;
      })
      .join('  ');
  }

  public log(...message: Array<any>) {
    this.logger.log(this.formatMessage(message));
  }

  public error(...message: Array<any>) {
    this.logger.error(this.formatMessage(message));
  }

  public warn(...message: Array<any>) {
    this.logger.warn(this.formatMessage(message));
  }

  public debug(...message: Array<any>) {
    this.logger.debug(this.formatMessage(message));
  }

  public verbose(...message: Array<any>) {
    this.logger.verbose(this.formatMessage(message));
  }

  public setContext(context: string) {
    this.logger.setContext(context);
  }
}

export { Logger };
