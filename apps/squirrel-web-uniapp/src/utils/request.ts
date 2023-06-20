import { CommonConfiguration } from '@/config/common.config';
import { Utils } from '@/utils/index';
import { COSUtils } from '@/utils/cos';
import { useProfileStore } from '@/stores/profile';

import type { RequestOption, UploadFileOption, RequestResult, UploadFileResult } from '@/types/Request.type';

/**
 * @description request 请求封装
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.05 09:34:46
 */
class RequestUtils {
  private delayed: any = null; // 是否延迟展示加载中
  private loadding = false; // 是否正在加载中

  // 请求发送
  public request = async (requestOption: RequestOption) => {
    const userStore = useProfileStore();

    const { path, method = 'POST', data, header = {}, showLoading = true, showLoadingDelay = 0 } = requestOption;

    // 组装请求头
    const tokenHeader = { Authorization: `Bearer ${userStore.userToken}` };
    Object.assign(header, tokenHeader);
    const devHeader = CommonConfiguration.RequestHttpDevelopmentSimulationHttpHeader;
    if (CommonConfiguration.environment == 'development') Object.assign(header, devHeader);

    // 拦截Body参数
    const body = {
      ...data,
      __token__: userStore.userToken,
      __mobile__: userStore.userMobile,
      __openid__: userStore.userOpenID
    };

    // 判断是否延迟展示加载中
    if (showLoading) {
      if (this.delayed) clearTimeout(this.delayed);
      if (this.loadding) {
        this.loadding = false;
        uni.hideLoading();
      }
      this.delayed = setTimeout(() => {
        this.loadding = true;
        Utils.showLoading('加载中，请稍后...');
      }, showLoadingDelay || 0);
    }

    console.log(`# request start: ${path} #`, requestOption);

    // 请求发送，此处区分使用云托管还是普通请求
    let res: RequestResult, err;
    if (CommonConfiguration.environment == 'development') [err, res] = await this.requestHttp(path, method, body, header);
    else [err, res] = await this.requestContainer(path, method, body, header);

    console.log(`# request end: ${path} #`, res, err);

    // 请求结果处理
    const statusCode = res.statusCode;
    const responseCode = res.data.Code;
    if (statusCode == CommonConfiguration.RequestSuccessCode && responseCode === 0) {
      return [err, res.data];
    } else {
      const errMsg = res.data.Message || '请求失败' + '，错误码：' + statusCode;
      Utils.showToast(errMsg, 2 * 1000, 'none');
      return [errMsg, null];
    }
  };

  // 上传文件
  public uploadFile = async (requestOption: UploadFileOption) => {
    const { filePath, cloudPath, showLoading = true, showLoadingDelay } = requestOption;

    // 判断是否延迟展示加载中
    if (showLoading) {
      if (this.delayed) clearTimeout(this.delayed);
      if (this.loadding) {
        this.loadding = false;
        uni.hideLoading();
      }
      this.delayed = setTimeout(() => {
        this.loadding = true;
        Utils.showLoading('上传中，请稍后...');
      }, showLoadingDelay || 0);
    }

    console.log(`# upload start: #####`, requestOption);

    // 请求发送，此处区分使用云托管还是普通请求
    let res: UploadFileResult, err;
    if (CommonConfiguration.environment == 'development') [err, res] = await this.uploadFileContainer(filePath, cloudPath);
    else [err, res] = await this.uploadFileHttp(filePath, cloudPath);

    console.log(`# upload end: #`, res, err);

    // 请求结果处理
    if (!err) {
      return [err, res];
    } else {
      Utils.showToast(res.ErrMsg, 2 * 1000, 'none');
      return [err, null];
    }
  };

  // 请求发送（云托管）
  private requestContainer = async (path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data: Record<string, any>, header?: Record<string, any>) => {
    let res, err;
    try {
      wx.cloud.init();
      res = await wx.cloud.callContainer({
        config: {
          env: CommonConfiguration.WeiXinCloudBaseEnvironment
        },
        path: path,
        method: method || 'POST',
        data: data,
        header: {
          'X-WX-SERVICE': CommonConfiguration.WeiXinCloudBaseServiceName,
          ...header
        }
      });
    } catch (error) {
      err = error;
    }
    return [err, res];
  };

  // 请求发送（普通）
  private requestHttp = async (path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data: Record<string, any>, header?: Record<string, any>) => {
    let res: any, err;
    try {
      const baseUrl = CommonConfiguration.environment == 'development' ? CommonConfiguration.RequestHttpDevelopmentBaseUrl : CommonConfiguration.WeiXinCloudBaseBaseUrl;
      res = await uni.request({
        url: baseUrl + path, // 举例：http://localhost:3000 + /api/user/login
        method: method,
        data: data,
        header: header || {},
        timeout: CommonConfiguration.RequestTimeout
      });
    } catch (error) {
      err = error;
    }
    return [err, res];
  };

  // 上传文件（云托管）
  private uploadFileContainer = async (filePath: string, cloudPath: string) => {
    let res: any, err;
    try {
      wx.cloud.init();
      const workDirectory = CommonConfiguration.WeiXinCloudBaseFileWorkDirectory;
      const cosCloudPath = workDirectory + cloudPath;

      const resp = await wx.cloud.uploadFile({
        filePath: filePath,
        cloudPath: cosCloudPath,
        config: { env: CommonConfiguration.WeiXinCloudBaseEnvironment }
      });

      // 格式化返回值
      const { FileID, FilePath } = COSUtils.formatFileDownloadUrl(cosCloudPath);
      res = { FileID: FileID, FilePath: FilePath, ErrMsg: resp.errMsg, StatusCode: resp.statusCode };
    } catch (error) {
      err = error;
    }
    return [err, res];
  };

  // 上传文件（普通）
  private uploadFileHttp = async (filePath: string, cloudPath: string) => {
    let res, err;
    try {
      const workDirectory = CommonConfiguration.WeiXinCloudBaseFileWorkDirectory;
      const cosCloudPath = workDirectory + cloudPath;

      const cosClient = COSUtils.getCOSInstance();
      [err, res] = await COSUtils.uploadFile(cosClient, filePath, cosCloudPath);

      if (!err && res.statusCode === 200) {
        const { FileID, FilePath } = COSUtils.formatFileDownloadUrl(cosCloudPath);
        res = { FileID: FileID, FilePath: FilePath, ErrMsg: res.errMsg, StatusCode: res.statusCode };
      } else err = err || new Error('上传失败');
    } catch (error) {
      err = error;
    }
    return [err, res];
  };
}

export { RequestUtils };
