import { Space, Table, TableProps, Tag } from 'antd';
import React, { HTMLProps, useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

export const ETFsTable: React.FC<{
  data: null | any[];
}> = React.memo(function ETFsTable(props) {
  const table = useMemo(() => {
    const dataSource = [...(props.data || [])];
    const last = dataSource[dataSource.length - 1];
    const columns = Object.keys(props.data?.[0])?.map((key, index) => ({
      title: key,
      dataIndex: key,
      key: index,
      render(_: any, row: any) {
        return row[key];
      },
    }));
    if (last) columns.sort((a, b) => last[b.dataIndex] - last[a.dataIndex]);
    dataSource.reverse();
    return { columns, dataSource };
  }, [props.data]);
  console.log(table);
  return (
    <CptStyle>
      <Table size="small" pagination={false} columns={table.columns} rowKey="日期" dataSource={table.dataSource} />
    </CptStyle>
  );
});

const CptStyle = styled.div`
  width: 100vw;
  box-sizing: border-box;
  padding: 100px 2vw;
`;
