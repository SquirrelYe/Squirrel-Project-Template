import { Injectable } from '@nestjs/common';
import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, Comment } from 'sequelize-typescript';
import { BaseSequelizeDAO } from '@/constructor/sequelize.constructor';

@Table
export class SystemReport extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  ID: number;

  @Comment('上报数据来源')
  @Column(DataType.STRING(128))
  Source: string;

  @Comment('上报数据类型')
  @Column(DataType.STRING(128))
  Type: string;

  @Comment('上报数据值')
  @Column(DataType.JSON)
  Content: Record<string, any>;

  @Column(DataType.DATE)
  CreatedAt: Date;

  @Column(DataType.DATE)
  UpdatedAt: Date;
}

@Injectable()
export class SystemReportRepository extends BaseSequelizeDAO {
  constructor() {
    super(SystemReport);
  }
}
