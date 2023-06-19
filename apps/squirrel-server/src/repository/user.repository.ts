import { Injectable } from '@nestjs/common';
import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, Comment } from 'sequelize-typescript';
import { BaseSequelizeDAO } from '@/constructor/sequelize.constructor';

@Table
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Comment('数据库ID')
  @Column(DataType.INTEGER({ length: 11 }))
  ID: number;

  @Comment('小程序OpenID')
  @Column(DataType.STRING(128))
  OpenID: string;

  @Comment('用户微信号')
  @Column(DataType.STRING(128))
  UserID: string;

  @Comment('用户名称')
  @Column(DataType.STRING(128))
  UserName: string;

  @Comment('个人介绍')
  @Column(DataType.STRING(1024))
  Introduction: string;

  @Comment('用户头像')
  @Column(DataType.STRING(256))
  Avatar: string;

  @Comment('用户手机号')
  @Column(DataType.STRING(32))
  PhoneNum: string;

  @Comment('用户性别')
  @Column(DataType.STRING(32))
  Gender: string;

  @Comment('用户出生日期')
  @Column(DataType.STRING(32))
  Birthday: string;

  @Comment('用户所在城市')
  @Column(DataType.STRING(255))
  City: string;

  @Comment('用户所在省份')
  @Column(DataType.STRING(255))
  Province: string;

  @Comment('数据创建时间')
  @Column(DataType.DATE)
  CreatedAt: Date;

  @Comment('数据更新时间')
  @Column(DataType.DATE)
  UpdatedAt: Date;
}

@Injectable()
export class UserRepository extends BaseSequelizeDAO {
  constructor() {
    super(User);
  }
}
