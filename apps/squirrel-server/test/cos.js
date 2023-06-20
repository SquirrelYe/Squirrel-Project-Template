/* eslint-disable @typescript-eslint/no-var-requires */

const COS = require('cos-nodejs-sdk-v5');
const Axios = require('axios');

// 初始化COS
const initCOSClient = () => {
  try {
    const cos = new COS({
      getAuthorization: async (options, callback) => {
        // 获取票
        const res = await Axios.get('https://xxx.sh.run.tcloudbase.com/api/v1/weixin/getauth');
        console.log('获取临时票据', res.data.Data);

        // 回调执行创建Client
        callback({
          TmpSecretId: res.data.Data.TmpSecretId,
          TmpSecretKey: res.data.Data.TmpSecretKey,
          SecurityToken: res.data.Data.Token,
          ExpiredTime: res.data.Data.ExpiredTime
        });
      }
    });
    console.log('COS初始化成功');
    return cos;
  } catch (e) {
    console.log('COS初始化失败', e);
  }
};

initCOSClient().getObject(
  {
    Bucket: 'xxx',
    Region: 'ap-shanghai',
    Key: '/chat-svr/user-avatar/1686492716110-xxx.jpeg'
  },
  (err, data) => {
    console.log(err || data);
  }
);
