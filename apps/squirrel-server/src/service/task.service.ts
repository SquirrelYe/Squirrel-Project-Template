import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Logger } from '@/util/logger';
import { CommonConfiguration } from '@/configuration/common.configuration';
import { SystemConfigurationService } from '@/service/system.service';

const logger = new Logger('TaskService');

/**
 * @description TaskService 任务服务类，提供任务相关的服务方法
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.21 22:09:57
 */
@Injectable()
export class TaskService implements OnModuleInit {
  @Inject() private readonly systemConfigurationService: SystemConfigurationService;

  // 模块初始化时执行
  async onModuleInit() {
    logger.debug('😈😈😈😈😈😈TaskService onModuleInit');
    const [err, res] = await this.systemConfigurationService.refreshWechatAccessToken();
    if (err) logger.error(err);
    else logger.debug(res);
  }

  // 刷新微信 Access Token
  @Interval(CommonConfiguration.SystemWechatAccessTokenRefreshInterval)
  async refreshWechatAccessToken() {
    const [err, res] = await this.systemConfigurationService.refreshWechatAccessToken();
    if (err) logger.error(err);
    else logger.debug(res);
  }
}
