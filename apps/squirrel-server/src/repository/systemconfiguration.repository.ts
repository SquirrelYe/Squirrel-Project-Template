import { Injectable } from '@nestjs/common';
import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, Comment, Index } from 'sequelize-typescript';
import { BaseSequelizeDAO } from '@/constructor/sequelize.constructor';

@Table
export class SystemConfiguration extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  ID: number;

  @Comment('配置名称')
  @Column(DataType.STRING(128))
  @Index({ unique: true, name: 'Type' })
  Type: string;

  @Comment('配置值')
  @Column(DataType.JSON)
  Content: any;

  @Comment('描述信息')
  @Column(DataType.STRING(1024))
  Description: string;

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
