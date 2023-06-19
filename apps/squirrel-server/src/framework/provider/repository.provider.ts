import { UserRepository } from '@/repository/user.repository';
import { AdminRepository } from '@/repository/admin.repository';
import { SystemConfigurationRepository } from '@/repository/systemconfiguration.repository';
import { SystemReportRepository } from '@/repository/systemreport.repository';

/**
 * @description 数据库实体提供者类
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.15 10:57:42
 */
export const repositoryProviders = [
  // 注册数据库实体
  UserRepository,
  AdminRepository,
  SystemConfigurationRepository,
  SystemReportRepository
];
