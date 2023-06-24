import React from 'react';
import { message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { history, Helmet, useModel } from '@umijs/max';

import { adminLogin } from '@/services/auth.service';
import { useFetchAdminProfileInfo } from '@/hooks/fetchAdminProfileInfo.hook';
import { useUserProfileStore } from '@/stores/user.store';

import Footer from '@/components/Footer';

/**
 * @description 登录组件
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.18 16:19:54
 */
export default (props: Record<string, any>) => {
  const { initialState } = useModel('@@initialState');
  const { settings } = initialState || {};

  const { doFetchAdminProfileInfo } = useFetchAdminProfileInfo();
  const userProfileStore = useUserProfileStore();

  // 页面容器样式
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage: "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%'
    };
  });

  // 执行登录
  const doLoginSystem = async (values: any) => {
    try {
      // 登录
      const { username, password } = values;
      const reqBody = { UserName: username, Password: password };
      const loginres = await adminLogin(reqBody, { skipErrorHandler: true });
      if (loginres.Code === 0) {
        message.success('登录成功！');
        userProfileStore.setUserToken(loginres.Data.Token);
        userProfileStore.setUserName(loginres.Data.User.UserName);
        await doFetchAdminProfileInfo();

        // 跳转到登录前的页面
        const formatHref = window.location.href.replace('#', '');
        const urlParams = new URL(formatHref).searchParams;
        history.push(urlParams.get('redirect') || '/');
      } else {
        const { Message } = loginres;
        const defaultLoginFailureMessage = '登录失败，请重试。' + (Message ? ` - ${Message}` : '');
        message.error(defaultLoginFailureMessage);
      }
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>{'网评小助手 - 登录'}</title>
      </Helmet>

      <div style={{ flex: '1', margin: '100px 0' }}>
        <LoginForm
          contentStyle={{ minWidth: 280, maxWidth: '75vw' }}
          logo={<img alt="logo" src={settings!.logo} />}
          title="网评小助手管理系统"
          initialValues={{ autoLogin: true }}
          onFinish={doLoginSystem}
        >
          <div style={{ marginTop: '30px' }}>
            <ProFormText
              name="username"
              fieldProps={{ size: 'large', prefix: <UserOutlined rev={undefined} /> }}
              placeholder={'请输入用户名'}
              rules={[{ required: true, message: '用户名是必填项！' }]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{ size: 'large', prefix: <LockOutlined rev={undefined} /> }}
              placeholder={'请输入密码'}
              rules={[{ required: true, message: '密码是必填项！' }]}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a style={{ float: 'right' }}>忘记密码 ?</a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
