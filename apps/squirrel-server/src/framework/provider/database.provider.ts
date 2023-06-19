import { Sequelize } from 'sequelize-typescript';

import { CommonConstant } from '@/constant/common.constant';
import { CommonConfiguration } from '@/configuration/common.configuration';
import { Logger } from '@/util/logger';

import { User } from '@/repository/user.repository';
import { Admin } from '@/repository/admin.repository';
import { SystemConfiguration } from '@/repository/systemconfiguration.repository';
import { SystemReport } from '@/repository/systemreport.repository';

const logger = new Logger('DatabaseProvider');

/**
 * @description 数据库提供者类
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.15 10:56:46
 */
export const databaseProviders = [
  {
    provide: CommonConstant.IOC_PROVIDER_SEQUELIZE,
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: CommonConfiguration.DATABASE_DIALECT,
        host: CommonConfiguration.DATABASE_HOST,
        port: CommonConfiguration.DATABASE_PORT,
        username: CommonConfiguration.DATABASE_USERNAME,
        password: CommonConfiguration.DATABASE_PASSWORD,
        database: CommonConfiguration.DATABASE_DATABASE,
        logging: (sql: string) => logger.log(`[Sequelize SQL] ${sql}`),
        define: {
          timestamps: true,
          createdAt: 'CreatedAt',
          updatedAt: 'UpdatedAt',
          deletedAt: 'DeletedAt',
          freezeTableName: true
        },
        timezone: '+00:00',
        pool: { max: 5, min: 0, idle: 10 * 1000, acquire: 30 * 1000 }
      });

      sequelize.addModels([User, Admin, SystemConfiguration, SystemReport]);
      await sequelize.sync(); // 同步数据库，如果表不存在则创建表，如果表存在则不做任何事情

      return sequelize;
    }
  }
];
