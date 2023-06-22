import { Utils } from '@/utils/index';
import { COSUtils } from '@/utils/cos';
import { useProfileStore } from '@/stores/profile';
import { CommonConfiguration } from '@/config/common.config';

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
    Object.assign(header, {
      Authorization: userStore.userToken ? `Bearer ${userStore.userToken}` : '',
      __APPID__: CommonConfiguration.WeiXinMiniProgramAppId,
      __TOKEN__: userStore.userToken ? userStore.userToken : '',
      __OPENID__: userStore.userOpenID ? userStore.userOpenID : ''
    });

    // 拦截Body参数
    const body = data;

    // 判断是否延迟展示加载中
    if (showLoading) {
      if (this.delayed) clearTimeout(this.delayed);
      this.delayed = setTimeout(() => {
        this.loadding = true;
        Utils.showLoading('加载中，请稍后...');
      }, showLoadingDelay || 0);
    }

    // 请求发送，此处区分使用云托管还是普通请求
    let res: RequestResult, err;
    [err, res] = await this.requestHttp(path, method, body, header);

    if (this.loadding) {
      this.loadding = false;
      uni.hideLoading();
    }

    // 请求结果处理
    const statusCode = res.statusCode;
    const responseCode = res.data.Code;
    if (statusCode == CommonConfiguration.RequestSuccessCode && responseCode === CommonConfiguration.RequestSuccessResponseCode) {
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

    // 请求发送，此处区分使用云托管还是普通请求
    let res: UploadFileResult, err;
    [err, res] = await this.uploadFileHttp(filePath, cloudPath);

    // 请求结果处理
    if (!err) {
      return [err, res];
    } else {
      Utils.showToast(res.ErrMsg, 2 * 1000, 'none');
      return [err, null];
    }
  };

  // 请求发送（普通）
  private requestHttp = async (path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data: Record<string, any>, header?: Record<string, any>) => {
    let res: any, err;
    try {
      const baseUrl = CommonConfiguration.environment == 'development' ? CommonConfiguration.RequestHttpDevelopmentBaseUrl : CommonConfiguration.RequestHttpReleaseBaseUrl;
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

  // 上传文件（普通）
  private uploadFileHttp = async (filePath: string, cloudPath: string) => {
    let res, err;
    try {
      const cosClient = COSUtils.getCOSInstance();
      [err, res] = await COSUtils.uploadFile(cosClient, filePath, cloudPath);

      if (!err && res.statusCode === 200) {
        const { FileID, FilePath } = COSUtils.formatFileDownloadUrl(cloudPath);
        res = { FileID: FileID, FilePath: FilePath, ErrMsg: res.errMsg, StatusCode: res.statusCode };
      } else err = err || new Error('上传失败');
    } catch (error) {
      err = error;
    }
    return [err, res];
  };
}

export { RequestUtils };
