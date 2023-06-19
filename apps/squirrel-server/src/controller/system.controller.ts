import { Inject } from '@nestjs/common';
import { Controller, Post, Headers, Body, HttpCode, HttpStatus } from '@nestjs/common';

import { SystemConfiguration, SystemConfigurationRepository } from '@/repository/systemconfiguration.repository';
import { SystemReport, SystemReportRepository } from '@/repository/systemreport.repository';

import { R } from '@/util/R';
import { Logger } from '@/util/logger';
import { Public } from '@/framework/decorator/public.decorator';

const logger = new Logger('SystemController');

@Controller('/api/v1/system')
export class SystemController {
  @Inject() private readonly systemConfigurationRepository: SystemConfigurationRepository;
  @Inject() private readonly systemReportRepository: SystemReportRepository;

  @Post('/GetSystemConfiguration')
  @Public()
  @HttpCode(HttpStatus.OK)
  async GetSystemConfiguration(@Body() body: Record<string, any>) {
    const { Type } = body;
    const [err, result] = await this.systemConfigurationRepository.findOne({ where: { Type }, raw: true });
    if (err) return R.error(err.message);
    return R.ok(result);
  }

  @Post('/ReportDeviceInfo')
  @Public()
  @HttpCode(HttpStatus.OK)
  async ReportDeviceInfo(@Headers() headers: Record<string, any>, @Body() body: Record<string, any>) {
    const { Source, Type, Content } = body;
    const [err, result] = await this.systemReportRepository.create({ Source, Type, Content });
    if (err) return R.error(err.message);
    return R.ok(result);
  }
}
