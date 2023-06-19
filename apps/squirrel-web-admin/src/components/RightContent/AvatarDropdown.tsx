import React, { useCallback } from 'react';
import { Spin } from 'antd';
import { stringify } from 'querystring';
import { flushSync } from 'react-dom';
import { history, useModel } from '@umijs/max';

import { adminLogout } from '@/services/auth.service';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { useUserProfileStore } from '@/stores/user.store';

import HeaderDropdown from '@/components/HeaderDropdown';

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentAdminProfile } = initialState || {};
  return <span className="anticon">{currentAdminProfile?.name}</span>;
};

/**
 * @description 个人选项下拉菜单
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.05.31 23:18:56
 */
export const AvatarDropdown = ({ children }: { children: React.ReactNode }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const userProfileStore = useUserProfileStore();

  // 退出登录
  const loginOut = async () => {
    await adminLogout({});
    userProfileStore.setUserLogout();

    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    const redirect = urlParams.get('redirect');
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({ pathname: '/user/login', search: stringify({ redirect: pathname + search }) });
    }
  };

  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover
      }
    };
  });

  const onMenuClick = useCallback(
    (event: any) => {
      const { key } = event;
      // 退出登录
      if (key === 'logout') {
        flushSync(() => setInitialState((s: any) => ({ ...s, currentAdminProfile: undefined })));
        loginOut();
        return;
      }
      // 跳转到个人中心
      if (key === 'center') {
        history.push('/account/center');
        return;
      }
      // 跳转到个人设置
      if (key === 'settings') {
        history.push('/account/settings');
        return;
      }
    },
    [setInitialState]
  );

  const loading = (
    <span className={actionClassName}>
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    </span>
  );

  if (!initialState) return loading;
  const { currentAdminProfile } = initialState;
  if (!currentAdminProfile || !currentAdminProfile.name) return loading;

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: [
          { key: 'center', icon: <UserOutlined rev={undefined} />, label: '个人中心' },
          { key: 'settings', icon: <SettingOutlined rev={undefined} />, label: '个人设置' },
          { type: 'divider' as const },
          { key: 'logout', icon: <LogoutOutlined rev={undefined} />, label: '退出登录' }
        ]
      }}
    >
      {children}
    </HeaderDropdown>
  );
};
