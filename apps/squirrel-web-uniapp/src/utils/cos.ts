import COS from 'cos-wx-sdk-v5';
import { RequestUtils } from '@/utils/request';
import { APIConfiguration } from '@/config/api.config';
import { CommonConfiguration } from '@/config/common.config';

/**
 * @description 云托管对象存储工具类
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.20 15:35:39
 */
class COSUtils {
  // 初始化COS
  public static getCOSInstance = () => {
    const cos = new COS({
      SimpleUploadMethod: 'putObject',
      // 异步获取临时密钥
      getAuthorization: (options: any, callback: any) => {
        const requestUtils = new RequestUtils();
        const reqPath = APIConfiguration.ApiWeiXinGetCosSignatureToken;
        const reqObj = {};
        requestUtils
          .request({ path: reqPath, method: 'GET', data: reqObj, header: {} })
          .then((res: any) => {
            const [coserr, cosres] = res;
            if (coserr) throw coserr;
            // 回调执行创建Client
            callback({
              TmpSecretId: cosres.Data.TmpSecretId,
              TmpSecretKey: cosres.Data.TmpSecretKey,
              SecurityToken: cosres.Data.Token,
              ExpiredTime: cosres.Data.ExpiredTime
            });
          })
          .catch((err: any) => {
            console.error('getCOSInstance Failed -->', err);
            throw err;
          });
      }
    });
    return cos;
  };

  // 上传文件
  public static uploadFile = (cosClient: any, filePath: string, cloudPath: string): Promise<[Error, any]> => {
    return new Promise(resolve => {
      cosClient.putObject(
        {
          Bucket: CommonConfiguration.WeiXinCloudBaseFileStorageBucket,
          Region: CommonConfiguration.WeiXinCloudBaseFileStorageRegion,
          Key: cloudPath,
          FilePath: filePath
        },
        (err: any, data: any) => resolve([err, data])
      );
    });
  };

  // 格式化文件下载路径
  public static formatFileDownloadUrl = (cloudPath: string) => {
    const formatCloudPath = cloudPath.startsWith('/') ? cloudPath : '/' + cloudPath;
    const cosBucket = CommonConfiguration.WeiXinCloudBaseFileStorageBucket;
    const serviceEnv = CommonConfiguration.WeiXinCloudBaseEnvironment;

    const FileID = `cloud://${serviceEnv}.${cosBucket}${formatCloudPath}`;
    const FilePath = `https://${cosBucket}.tcb.qcloud.la${formatCloudPath}`;

    return {
      FileID,
      FilePath
    };
  };
}

export { COSUtils };
