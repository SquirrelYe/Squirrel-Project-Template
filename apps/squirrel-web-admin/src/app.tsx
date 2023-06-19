import React from 'react';
import Footer from '@/components/Footer';
import { SettingDrawer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { UserOutlined } from '@ant-design/icons';
import { AvatarDropdown, AvatarName } from '@/components/RightContent/AvatarDropdown';
import { CommonConstant } from '@/constants/common.constant';
import { fetchAdminProfileInfo } from '@/hooks/fetchAdminProfileInfo.hook';

import { DefaultSettings } from '../config/default.settings';
import { RequestConfiguration } from '../config/request.config';

import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';

const isDev = process.env.NODE_ENV === 'development';

/**
 * @description 获取初始状态，并在初始状态中获取用户信息
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.17 17:11:47
 * @see https://v3.umijs.org/zh-CN/plugins/plugin-initial-state
 */
export async function getInitialState() {
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== CommonConstant.RouterPathLogin) {
    const currentAdminProfile = await fetchAdminProfileInfo();
    return {
      fetchAdminProfileInfo,
      currentAdminProfile,
      settings: DefaultSettings
    };
  }

  return {
    fetchAdminProfileInfo,
    settings: DefaultSettings
  };
}

/**
 * @description 布局配置，可以配置顶栏、菜单、页脚、水印、菜单宽度、菜单主题、菜单模式、菜单折叠、菜单顶栏固定、菜单底部固定、菜单隐藏、菜单缩进、菜单展开、菜单自动
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.17 17:20:00
 * @see https://v3.umijs.org/zh-CN/plugins/plugin-layout
 * @see https://procomponents.ant.design/components/layout#prolayout 参数配置
 */
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    avatarProps: {
      icon: <UserOutlined rev={undefined} />,
      title: <AvatarName />,
      render: (_: any, avatarChildren: any) => <AvatarDropdown>{avatarChildren}</AvatarDropdown>
    },
    waterMarkProps: { content: initialState?.currentAdminProfile?.name },
    links: [],
    unAccessible: <div>unAccessible</div>, // 自定义 403 页面
    noFound: <div>noFound</div>, // 自定义 404 页面
    appList: DefaultSettings.appList, // 自定义应用列表
    bgLayoutImgList: DefaultSettings.bgLayoutImgList, // 自定义背景图片列表
    menuHeaderRender: () => undefined, // 自定义菜单头
    actionsRender: () => [], // <Question key="doc" />
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      if (!initialState?.currentAdminProfile && location.pathname !== CommonConstant.RouterPathLogin) {
        history.push(CommonConstant.RouterPathLogin); // 如果没有登录，重定向到 login。
      }
    },

    // 子页面渲染
    childrenRender: children => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {/* 内容区域 */}
          {children}

          {/* 开发环境页面设置组件 */}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings as LayoutSettings}
              onSettingChange={settings => setInitialState((preInitialState: any) => ({ ...preInitialState, settings }))}
            />
          )}
        </>
      );
    },

    // 注入系统配置信息
    ...initialState?.settings
  };
};

/**
 * @name request 配置，可以配置错误处理
 * @description 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @see https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...RequestConfiguration.commonConfiguration,
  requestInterceptors: RequestConfiguration.requestInterceptors,
  responseInterceptors: RequestConfiguration.responseInterceptors,
  errorConfig: RequestConfiguration.errorConfig
};
