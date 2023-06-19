import React from 'react';
import { useAccess, useModel } from '@umijs/max';
import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Alert, Card, Typography, Button } from 'antd';

const Admin: React.FC = () => {
  const access = useAccess();
  const { initialState } = useModel('@@initialState');
  console.log('Admin Access', access, initialState); // AccessRoleAdmin : true

  return (
    <PageContainer
      extra={[
        <Button key="3">操作</Button>,
        <Button key="2">操作</Button>,
        <Button key="1" type="primary" onClick={() => {}}>
          主操作
        </Button>
      ]}
      subTitle="简单的描述"
      title="高级表格"
    >
      <Card>
        <Alert message={'更快更强的重型组件，已经发布。'} type="success" showIcon banner style={{ margin: -12, marginBottom: 48 }} />
        <Typography.Title level={2} style={{ textAlign: 'center' }}>
          <SmileTwoTone rev={undefined} />
          Ant Design Pro
          <HeartTwoTone rev={undefined} twoToneColor="#eb2f96" />
          You
        </Typography.Title>
      </Card>

      <p style={{ textAlign: 'center', marginTop: 24 }}>
        Want to add more pages? Please refer to{' '}
        <a href="https://pro.ant.design/docs/block-cn" target="_blank" rel="noopener noreferrer">
          use block
        </a>
        。
      </p>
    </PageContainer>
  );
};

export default Admin;
