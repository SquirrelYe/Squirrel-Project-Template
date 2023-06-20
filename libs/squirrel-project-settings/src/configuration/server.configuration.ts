import { BaseConfiguration } from '@/configuration/base.configuration';

/**
 * @description 后台项目 NestJS 配置清单
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.20 09:48:34
 */
class ServerConfiguration extends BaseConfiguration {
  constructor() {
    super();
    this.configurationName = 'ServerConfiguration';
    this.configurationDescription = '后台项目 NestJS 配置清单';
  }
}

export { ServerConfiguration };
