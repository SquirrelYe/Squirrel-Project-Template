import { Utils } from '@/utils/index';
import { useProfileStore } from '@/stores/profile';
import { APIConfiguration } from '@/config/api.config';
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

  // 格式化文件下载路径
  public formatFileDownloadUrl = (cloudPath: string) => {
    const formatCloudPath = cloudPath.startsWith('/') ? cloudPath : '/' + cloudPath;
    const cosBucket = CommonConfiguration.WeiXinCloudBaseFileStorageBucket;
    const serviceEnv = CommonConfiguration.WeiXinCloudBaseEnvironment;
    const FileID = `cloud://${serviceEnv}.${cosBucket}${formatCloudPath}`;
    const FilePath = `https://${cosBucket}.tcb.qcloud.la${formatCloudPath}`;
    return { FileID, FilePath };
  };

  // 格式化请求头
  public formatRequestHeader = (header: any) => {
    const userStore = useProfileStore();
    // 组装请求头
    const headers = Object.assign(header, {
      Authorization: userStore.userToken ? `Bearer ${userStore.userToken}` : '',
      'X-Runtime-Environment': CommonConfiguration.environment, // 当前执行环境
      'X-Runtime-Token': userStore.userToken ? userStore.userToken : '', // 当前用户Token
      'X-Runtime-OpenID': userStore.userOpenID ? userStore.userOpenID : '', // 当前用户OpenID
      'X-Runtime-AppID': CommonConfiguration.WeiXinMiniProgramAppId // 当前小程序AppID
    });
    return headers || {};
  };

  // 请求发送
  public request = async (requestOption: RequestOption) => {
    const { path, method = 'POST', data, header = {}, showLoading = true, showLoadingDelay = 0 } = requestOption;

    // 判断是否延迟展示加载中
    if (showLoading) {
      if (this.delayed) clearTimeout(this.delayed);
      this.delayed = setTimeout(() => {
        this.loadding = true;
        Utils.showLoading('加载中，请稍后...');
      }, showLoadingDelay || 0);
    }

    // 执行请求
    let res: RequestResult | undefined = undefined;
    let err: any;
    try {
      const baseUrl = CommonConfiguration.environment == 'development' ? CommonConfiguration.RequestHttpDevelopmentBaseUrl : CommonConfiguration.RequestHttpReleaseBaseUrl;
      const responseResult: any = await uni.request({
        url: baseUrl + path,
        method: method,
        data: data,
        header: this.formatRequestHeader(header),
        timeout: CommonConfiguration.RequestTimeout
      });
      res = responseResult;
    } catch (error) {
      err = error;
    } finally {
      if (this.loadding) {
        this.loadding = false;
        uni.hideLoading();
      }
    }

    // 请求结果处理
    if (err || res === undefined) {
      Utils.showToast('请求失败，请检查网络', 2 * 1000, 'none');
      return [err, null];
    } else {
      const statusCode = res.statusCode;
      const responseCode = res.data.Code;
      if (statusCode == CommonConfiguration.RequestSuccessCode && responseCode === CommonConfiguration.RequestSuccessResponseCode) {
        return [err, res.data];
      } else {
        const errMsg = res.data.Message || '请求失败' + '，错误码：' + statusCode;
        Utils.showToast(errMsg, 2 * 1000, 'none');
        return [errMsg, null];
      }
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

    // 获取文件上传链接
    const reqSysConfigPath = APIConfiguration.ApiWeiXinGetCosUploadFileUrl;
    const reqSysConfigObj = { Path: cloudPath };
    const [patherr, pathres] = await this.request({ path: reqSysConfigPath, method: 'POST', data: reqSysConfigObj, header: {} });
    if (patherr) {
      Utils.showToast('获取文件上传链接失败', 2 * 1000, 'none');
      return [patherr, null];
    }

    // 获取文件上传链接数据信息
    const { Url, Token, Authorization, CosFileId, FileId } = pathres.Data;

    // 上传文件
    let res: UploadFileResult | null = null;
    let err: any;
    [err, res] = await new Promise(resolve => {
      uni.uploadFile({
        url: Url,
        filePath: filePath,
        name: 'file',
        formData: {
          key: cloudPath,
          Signature: Authorization,
          'x-cos-security-token': Token,
          'x-cos-meta-fileid': CosFileId
        },
        success: () => {
          const { FileID, FilePath } = this.formatFileDownloadUrl(cloudPath);
          res = { FileID: FileID, FilePath: FilePath, ErrMsg: '' };
          resolve([null, res]);
        },
        fail: error => {
          err = error;
          resolve([err, null]);
        }
      });
    });

    // 隐藏加载中
    if (this.loadding) {
      this.loadding = false;
      uni.hideLoading();
    }

    // 请求结果处理
    if (err) {
      Utils.showToast('请求失败，请检查网络', 2 * 1000, 'none');
      return [err, null];
    } else {
      return [null, res];
    }
  };
}

export { RequestUtils };
