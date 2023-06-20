import { message, notification } from 'antd';
import { state } from '@/stores/user.store';

import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';

// 与后端约定的响应数据格式
interface ResponseStructure {
  Code: number;
  Data: any;
  Message: string;
  Path?: string;
  Time?: string;
}

/**
 * @name 错误处理
 * @description Pro 自带的错误处理，可以在这里做自己的改动
 * @see https://umijs.org/docs/max/request
 */
class RequestConfiguration {
  // 公共配置
  public static readonly commonConfiguration: RequestConfig = {
    timeout: 5 * 1000, // 超时时间
    headers: { 'Content-Type': 'application/json' }
  };

  // 请求拦截器
  public static readonly requestInterceptors: RequestConfig['requestInterceptors'] = [
    (config: RequestOptions) => {
      const { headers = {} } = config;
      const userToken = state.userToken;
      const userName = state.userName;
      if (userToken) headers.Authorization = `Bearer ${userToken}`;
      if (userName) headers['X-User-Name'] = userName;
      return config;
    }
  ];

  // 响应拦截器
  public static readonly responseInterceptors: RequestConfig['responseInterceptors'] = [response => response];

  // 错误处理，此处为Umi3的错误处理方案
  public static readonly errorConfig: RequestConfig['errorConfig'] = {
    // 错误抛出
    errorThrower: () => {},

    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      // 如果设置了 skipErrorHandler，跳过默认的错误处理，直接抛出错误。
      if (opts?.skipErrorHandler) throw error;

      const responseData: ResponseStructure = error?.response?.data || {};
      const requestData = opts?.data || {};

      // Axios 的错误，请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
      if (error.response) {
        const { Code, Message } = responseData;
        message.error(`Error code: ${Code}, message: ${Message}, status code: ${error.response.status}`);
      }

      // 请求已经成功发起，但没有收到响应
      else if (error.request) {
        message.error('None response! Please retry.');
      }

      // 发送请求时出了点问题
      else {
        message.error('Request error, please retry.');
      }
    }
  };
}

export { RequestConfiguration };
