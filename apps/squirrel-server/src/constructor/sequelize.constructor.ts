import { ModelStatic, Model, CreationAttributes, Optional, BulkCreateOptions, CreateOptions, FindOptions, UpdateOptions, DestroyOptions, Attributes } from 'sequelize';
import { DataBaseException } from '@/framework/exception/database.exception';

type SquirrelSequelizeResult<M> = [Error | null, M];

/**
 * @description 全局Sequelize DAO类，封装通用的CRUD操作
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.09 09:10:55
 */
class BaseSequelizeDAO {
  public sequelizeRepository: ModelStatic<Model<any, any>>;

  constructor(sequelizeRepository: ModelStatic<Model>) {
    this.sequelizeRepository = sequelizeRepository;
  }

  // [C] 新增数据
  public async create<M>(data: Optional<any, string> | M, options?: CreateOptions<any>): Promise<SquirrelSequelizeResult<M>> {
    let [err, res]: SquirrelSequelizeResult<M> = [null, null];
    try {
      const saveData = data instanceof this.sequelizeRepository ? data.toJSON() : data;
      res = await this.sequelizeRepository.create<any>(saveData, options);
    } catch (e: any) {
      console.error(`[DB Exception]: create data to ${this.sequelizeRepository.name} failed.`, data, e);
      err = new DataBaseException(e.message);
    }
    return [err, res];
  }

  // [C Many] 批量新增数据
  public async createMany<M extends Model>(data: Array<CreationAttributes<any>>, options?: BulkCreateOptions<Attributes<any>>): Promise<SquirrelSequelizeResult<M[]>> {
    let [err, res]: SquirrelSequelizeResult<M[]> = [null, null];
    try {
      res = await this.sequelizeRepository.bulkCreate<any>(data, options);
    } catch (e: any) {
      console.error(`[DB Exception]: create data to ${this.sequelizeRepository.name} failed.`, data, e);
      err = new DataBaseException(e.message);
    }
    return [err, res];
  }

  // [C or U] 创建或更新
  public async upsert<M extends Model>(values: any, options?: CreateOptions<any>): Promise<SquirrelSequelizeResult<[M, boolean]>> {
    let [err, res]: SquirrelSequelizeResult<[M, boolean]> = [null, null];
    try {
      res = await this.sequelizeRepository.upsert<any>(values, options);
    } catch (e: any) {
      console.error(`[DB Exception]: create or update data to ${this.sequelizeRepository.name} failed.`, values, e);
      err = new DataBaseException(e.message);
    }
    return [err, res];
  }

  // [R] 查询数据
  public async findOne<M extends Model>(options: FindOptions<any>): Promise<SquirrelSequelizeResult<M>> {
    let [err, res]: SquirrelSequelizeResult<M> = [null, null];
    try {
      res = await this.sequelizeRepository.findOne<any>(options);
    } catch (e: any) {
      console.error(`[DB Exception]: get data from ${this.sequelizeRepository.name} failed.`, options, e);
      err = new DataBaseException(e.message);
    }
    return [err, res];
  }

  // [R Many] 查询多条数据
  public async findMany<M extends Model>(options: FindOptions<any>): Promise<SquirrelSequelizeResult<M[]>> {
    let [err, res]: SquirrelSequelizeResult<M[]> = [null, null];
    try {
      res = await this.sequelizeRepository.findAll<any>(options);
    } catch (e: any) {
      console.error(`[DB Exception]: get data from ${this.sequelizeRepository.name} failed.`, options, e);
      err = new DataBaseException(e.message);
    }
    return [err, res];
  }

  // [U] 更新数据
  public async update(values: any, options: UpdateOptions<any>): Promise<SquirrelSequelizeResult<[affectedCount: number]>> {
    let [err, res]: SquirrelSequelizeResult<[affectedCount: number]> = [null, null];
    try {
      const updateObj = values instanceof this.sequelizeRepository ? values.toJSON() : values;
      console.log('updateObj', updateObj);
      res = await this.sequelizeRepository.update<any>(updateObj, options);
    } catch (e: any) {
      console.error(`[DB Exception]: update data from ${this.sequelizeRepository.name} failed.`, values, options, e);
      err = new DataBaseException(e.message);
    }
    return [err, res];
  }

  // [D] 删除数据
  public async delete(options: DestroyOptions<any>): Promise<SquirrelSequelizeResult<number>> {
    let [err, res]: SquirrelSequelizeResult<number> = [null, null];
    try {
      res = await this.sequelizeRepository.destroy<any>(options);
    } catch (e: any) {
      console.error(`[DB Exception]: delete data from ${this.sequelizeRepository.name} failed.`, options, e);
      err = new DataBaseException(e.message);
    }
    return [err, res];
  }
}

export { BaseSequelizeDAO };
