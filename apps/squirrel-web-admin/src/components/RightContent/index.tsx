import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';

export type SiderTheme = 'light' | 'dark';

export const Question = () => {
  return (
    <div style={{ display: 'flex', height: 26 }} onClick={() => console.log('question')}>
      <QuestionCircleOutlined rev="" />
    </div>
  );
};
