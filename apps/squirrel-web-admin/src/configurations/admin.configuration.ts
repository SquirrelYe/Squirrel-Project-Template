import { BaseConfiguration } from '@/configurations/base.configuration';

/**
 * @description 管理端配置清单
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.20 09:48:01
 */
class AdminConfiguration extends BaseConfiguration {
  constructor() {
    super();
    this.configurationName = 'AdminConfiguration';
    this.configurationDescription = '管理端配置清单';
  }
}

export { AdminConfiguration };
