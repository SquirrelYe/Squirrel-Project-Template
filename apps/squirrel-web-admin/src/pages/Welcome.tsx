import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { useModel } from '@umijs/max';
import { Card } from 'antd';

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const welcomeContentClassName = useEmotionCss(() => ({
    backgroundPosition: '100% -30%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '274px auto',
    backgroundImage: "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')"
  }));

  console.log('initialState?.settings.title', initialState);

  return (
    <PageContainer>
      <Card>
        <div className={welcomeContentClassName}>
          <div style={{ fontSize: '20px' }}>欢迎使用</div>
          <p style={{ fontSize: '14px', lineHeight: '22px', marginTop: 16, marginBottom: 32, width: '65%' }}>
            Ant Design Pro 是一个整合了 umi，Ant Design 和 ProComponents 的脚手架方案。
            致力于在设计规范和基础组件的基础上，继续向上构建，提炼出典型模板/业务组件/配套设计资源，进一步提升企业级中后台产品设计研发过程中的『用户』和『设计者』的体验。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>xxxx</div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
