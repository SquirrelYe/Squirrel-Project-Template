import React from 'react';
import { DefaultFooter } from '@ant-design/pro-components';

const Footer: React.FC = () => {
  const defaultMessage = '某某';
  const currentYear = new Date().getFullYear();
  const links = [{ key: '风继续吹1', title: '风继续吹 <will@aesen.cc>', href: 'mailto:will@aesen.cc', blankTarget: true }];

  return <DefaultFooter style={{ background: 'none' }} copyright={`${currentYear} ${defaultMessage}`} links={links} />;
};
export default Footer;
