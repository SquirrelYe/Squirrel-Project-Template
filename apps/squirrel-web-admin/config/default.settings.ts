/**
 * @description 项目配置文件
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.05.31 22:40:47
 * @see https://procomponents.ant.design/components/layout
 */
const DefaultSettings = {
  navTheme: 'light',
  colorPrimary: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '某某管理系统',
  pwa: true,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg', // './logo/logo.png',
  iconfontUrl: '',
  token: {},

  // 子应用设置
  appList: [],
  // 自定义背景图片列表
  bgLayoutImgList: [
    {
      src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
      left: 85,
      bottom: 100,
      height: '303px'
    },
    {
      src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
      bottom: -68,
      right: -45,
      height: '303px'
    },
    {
      src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
      bottom: 0,
      left: 0,
      width: '331px'
    }
  ]
};

export { DefaultSettings };
