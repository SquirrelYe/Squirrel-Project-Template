import { request } from '@umijs/max';
import { ApiConstant } from '@/constants/api.constant';
import { RequestOptions } from '@@/plugin-request/request';

// 拉取表格数据
export const getTableList = async (data: Record<string, any>, options: RequestOptions = {}) => {
  return request(ApiConstant.ApiTestListTableData, { method: 'POST', data, options });
};

// 新增表格数据
export const addTableItem = async (data: Record<string, any>, options: RequestOptions = {}) => {
  return request(ApiConstant.ApiTestAddTableData, { method: 'POST', data, options });
};

// 更新表格数据
export const updateTableItem = async (data: Record<string, any>, options: RequestOptions = {}) => {
  return request(ApiConstant.ApiTestUpdateTableData, { method: 'POST', data, options });
};
