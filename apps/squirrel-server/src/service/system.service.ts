import { Injectable, Inject } from '@nestjs/common';
import { SystemConfigurationType } from '@/configuration/systemconfiguration.enum';
import { WeiXinService } from '@/service/weixin.service';
import { Logger } from '@/util/logger';
import { HandleException } from '@/framework/decorator/public.decorator';
import { CommonConfiguration } from '@/configuration/common.configuration';
import { SystemConfiguration, SystemConfigurationRepository } from '@/repository/systemconfiguration.repository';

import type { ServiceReturnType } from '@/types/index';

const logger = new Logger('SystemConfigurationService');

/**
 * @description SystemConfigurationService 系统配置服务类，提供任务相关的配置方法
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.21 22:09:57
 */
@Injectable()
export class SystemConfigurationService {
  @Inject() private readonly wechatService: WeiXinService;
  @Inject() private readonly systemConfigurationRepository: SystemConfigurationRepository;

  // 刷新微信AccessToken
  @HandleException()
  async refreshWechatAccessToken(): ServiceReturnType<any> {
    // 获取微信AccessToken
    const [tokenerr, tokenres] = await this.wechatService.getWeiXinAccessToken();
    if (tokenerr) return [tokenerr, null];

    // 记录数据库
    const AccessToken = tokenres.access_token;
    const ExpiresIn = tokenres.expires_in;

    logger.log('获取微信AccessToken返回结果信息，', tokenerr, tokenres);
    logger.log('AccessToken', AccessToken);
    logger.log('ExpiresIn', ExpiresIn);

    const configuration = new SystemConfiguration();
    configuration.Type = SystemConfigurationType.WeChatAccessToken;
    configuration.Content = AccessToken;
    configuration.Description = `获取微信AccessToken成功，有效期${ExpiresIn}秒，过期时间${new Date(Date.now() + ExpiresIn * 1000).toLocaleString()}`;

    const [err, res] = await this.systemConfigurationRepository.upsert<SystemConfiguration>(configuration);
    return [err, res];
  }

  // 获取微信AccessToken
  @HandleException()
  async getWechatAccessToken(): ServiceReturnType<SystemConfiguration> {
    const [err, res] = await this.systemConfigurationRepository.findOne<SystemConfiguration>({ where: { Type: SystemConfigurationType.WeChatAccessToken }, raw: true });
    if (err) return [err, null];
    return [null, res];
  }
}
