import { request } from '@umijs/max';
import { ApiConstant } from '@/constants/api.constant';
import { RequestOptions } from '@@/plugin-request/request';

// 获取管理员用户信息
export async function getAdminProfile(options: RequestOptions = {}) {
  return request(ApiConstant.ApiAdminGetAdminProfile, { method: 'POST', options });
}

// 管理员登录
export async function adminLogin(data: Record<string, any>, options: RequestOptions = {}) {
  return request(ApiConstant.ApiAuthAdminLogin, { method: 'POST', data, ...options });
}

// 管理员登出
export async function adminLogout(data: Record<string, any>, options: RequestOptions = {}) {
  return request(ApiConstant.ApiAuthAdminLogout, { method: 'POST', data, options });
}
