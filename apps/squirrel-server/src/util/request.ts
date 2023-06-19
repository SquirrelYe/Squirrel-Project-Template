import axios, { AxiosInstance } from 'axios';

/**
 * @description axios实例
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.08 11:08:08
 */
const axiosService: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 15 * 1000,
  withCredentials: true
});

axiosService.interceptors.request.use(
  config => config,
  error => error
);

axiosService.interceptors.response.use(
  response => response.data,
  error => error
);

export { axiosService };
