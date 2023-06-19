import { Injectable } from '@nestjs/common';
import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, Comment } from 'sequelize-typescript';
import { BaseSequelizeDAO } from '@/constructor/sequelize.constructor';

@Table
export class SystemConfiguration extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  ID: number;

  @Comment('配置名称')
  @Column(DataType.STRING(128))
  Type: string;

  @Comment('配置值')
  @Column(DataType.JSON)
  Content: Record<string, any>;

  @Column(DataType.DATE)
  CreatedAt: Date;

  @Column(DataType.DATE)
  UpdatedAt: Date;
}

@Injectable()
export class SystemConfigurationRepository extends BaseSequelizeDAO {
  constructor() {
    super(SystemConfiguration);
  }
}
