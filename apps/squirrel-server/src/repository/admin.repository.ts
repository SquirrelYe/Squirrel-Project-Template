import { Injectable } from '@nestjs/common';
import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, Comment, Min } from 'sequelize-typescript';
import { BaseSequelizeDAO } from '@/constructor/sequelize.constructor';

@Table
export class Admin extends Model {
  @PrimaryKey
  @AutoIncrement
  @Comment('数据库ID')
  @Column(DataType.INTEGER({ length: 11 }))
  ID: number;

  @Comment('用户名称')
  @Column(DataType.STRING(128))
  UserName: string;

  @Comment('用户密码')
  @Column(DataType.STRING(128))
  Password: string;

  @Comment('个人介绍')
  @Column(DataType.STRING(1024))
  Introduction: string;

  @Comment('用户头像')
  @Column(DataType.STRING(256))
  Avatar: string;

  @Comment('用户手机号')
  @Column(DataType.STRING(32))
  PhoneNum: string;

  @Comment('数据创建时间')
  @Column(DataType.DATE)
  CreatedAt: Date;

  @Comment('数据更新时间')
  @Column(DataType.DATE)
  UpdatedAt: Date;
}

@Injectable()
export class AdminRepository extends BaseSequelizeDAO {
  constructor() {
    super(Admin);
  }
}
