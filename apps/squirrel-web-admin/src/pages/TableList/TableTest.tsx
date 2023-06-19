import React, { useRef, useState, useCallback, useEffect } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { ModalForm, PageContainer, ProFormText, ProFormTextArea, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import { useManageTableTestDataList } from '@/hooks/tableTest.hook';

import TableUpdateForm from '@/components/TableUpdateForm';

import type { ActionType, ProColumns } from '@ant-design/pro-components';

/**
 * @description 表格列表
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.18 19:49:33
 */
const TableList: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false); // 新建窗口的弹窗
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false); // 分布更新窗口的弹窗
  const [currentRow, setCurrentRow] = useState<any>();

  const { dataList, doPullTableTestData, doAddTableTestData, doUpdateTableTestData } = useManageTableTestDataList();

  useEffect(() => {
    console.log('TableList Init', 'xxxxxx', dataList);
  }, [dataList]);

  const refProTable = useRef<ActionType>();

  // 处理同步操作
  const handleSyncOperation = useCallback((type: string, args?: any) => {
    switch (type) {
      case 'add':
        setCreateModalOpen(true);
        break;
      case 'update':
        setUpdateModalOpen(true);
        setCurrentRow(args);
        break;
      case 'delete':
        Modal.confirm({
          title: '你确定要删除这项数据吗？',
          icon: <ExclamationCircleFilled rev={undefined} />,
          content: 'Some descriptions ...',
          okText: '确认',
          cancelText: '取消',
          okButtonProps: { danger: true },
          onOk: async () => {
            console.log('OK');
            message.success('删除成功！');
          },
          onCancel() {
            console.log('Cancel');
            message.error('删除失败！');
          }
        });
        break;
      default:
        break;
    }
  }, []);

  // 处理异步操作
  const handleAsyncOperation = useCallback(async (type: string, args?: any) => {
    switch (type) {
      case 'add:submit': {
        const success = await doAddTableTestData(args);
        if (success) {
          setCreateModalOpen(false);
          if (refProTable.current) refProTable.current.reload();
        }
        break;
      }
      case 'update:submit': {
        const success = await doUpdateTableTestData(args);
        if (success) {
          setUpdateModalOpen(false);
          setCurrentRow(undefined);
          if (refProTable.current) refProTable.current.reload();
        }
        break;
      }
      default:
        break;
    }
  }, []);

  const tableColumns: ProColumns<any>[] = [
    {
      title: '规则名称',
      dataIndex: 'name',
      tip: 'xxxxxx',
      render: (dom: any, entity: any) => <a onClick={() => setCurrentRow(entity)}>{dom}</a>
    },
    { title: '描述', dataIndex: 'desc', valueType: 'textarea' },
    { title: '服务调用次数', dataIndex: 'callNo', sorter: true, hideInForm: true, renderText: (val: string) => `${val}${'万'}` },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: { text: '关闭', status: 'Default' },
        1: { text: '运行中', status: 'Processing' },
        2: { text: '已上线', status: 'Success' },
        3: { text: '异常', status: 'Error' }
      }
    },
    { title: '上次调度时间', sorter: true, dataIndex: 'updatedAt', valueType: 'dateTime' },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, record: any) => [
        <Button icon={<EditOutlined rev={undefined} />} size="small" key="config" type="primary" onClick={() => handleSyncOperation('update', record)}>
          配置
        </Button>,
        <Button icon={<DeleteOutlined rev={undefined} />} size="small" danger key="config2" type="primary" onClick={() => handleSyncOperation('delete', record)}>
          删除
        </Button>
      ]
    }
  ];

  return (
    <PageContainer>
      {/* 展示表格区域 */}
      <ProTable
        headerTitle={'数据表格'}
        refProTable={refProTable}
        rowKey="key"
        search={{ labelWidth: 120 }}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => handleSyncOperation('add')}>
            <PlusOutlined rev={undefined} /> 新建
          </Button>
        ]}
        request={doPullTableTestData}
        columns={tableColumns}
      />

      {/* 新建数据 */}
      <ModalForm title={'新建数据'} width="600px" open={createModalOpen} onOpenChange={setCreateModalOpen} onFinish={(value: any) => handleAsyncOperation('add:submit', value)}>
        <ProFormText rules={[{ required: true, message: '规则名称为必填项' }]} width="lg" name="name" />
        <ProFormTextArea name="desc" />
      </ModalForm>

      {/* 更新规则 */}
      <TableUpdateForm onSubmit={(value: any) => handleAsyncOperation('update:submit', value)} onCancel={() => setUpdateModalOpen(false)} updateModalOpen={updateModalOpen} values={currentRow || {}} />
    </PageContainer>
  );
};

export default TableList;
