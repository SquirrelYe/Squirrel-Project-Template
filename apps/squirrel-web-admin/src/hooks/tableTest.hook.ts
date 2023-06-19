import React, { useRef, useState, useCallback } from 'react';
import { Button, message } from 'antd';

import { getTableList, addTableItem, updateTableItem } from '@/services/test.service';

/**
 * @description 表格测试Hooks
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.19 10:25:04
 */

// 拉取测试表格数据
export const useManageTableTestDataList = () => {
  const [dataList, setDataList] = useState([]);
  const [total, setTotal] = useState(0);

  // 拉取表格数据
  const doPullTableTestData = useCallback(async (params: Record<string, any>) => {
    const res = await getTableList(params);
    if (res.Code === 0) {
      const { Data, Current, PageSize, Success, Total } = res.Data;
      setDataList(Data);
      setTotal(Total);
      return { data: Data, total: Total, success: Success, pageSize: PageSize, current: Current };
    } else {
      message.error(res.Msg);
      return { data: [], total: 0, success: false, pageSize: 20, current: 1 };
    }
  }, []);

  // 新增表格数据
  const doAddTableTestData = useCallback(async (params: Record<string, any>) => {
    const res = await addTableItem(params);
    if (res.Code === 0) {
      message.success('新增成功');
      return true;
    } else {
      message.error(res.Msg);
      return false;
    }
  }, []);

  // 更新表格数据
  const doUpdateTableTestData = useCallback(async (params: Record<string, any>) => {
    const res = await updateTableItem(params);
    if (res.Code === 0) {
      message.success('更新成功');
      return true;
    } else {
      message.error(res.Msg);
      return false;
    }
  }, []);

  return {
    dataList,
    total,
    setDataList,
    setTotal,
    doPullTableTestData,
    doAddTableTestData,
    doUpdateTableTestData
  };
};
