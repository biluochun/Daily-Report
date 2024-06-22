import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import styled from 'styled-components';
import { message, notification } from 'antd';
import { GlobalVar } from 'src/constants';
import { AppHeader } from 'src/layout/Header';

export const AppLayout: React.FC<{ children?: React.ReactNode }> = (props) => {
  const match = useMatch('*');
  const [api, contextHolder] = notification.useNotification();
  const [messageHandler, messageCtx] = message.useMessage();
  GlobalVar.notification = api;
  GlobalVar.message = messageHandler;

  return (
    <PageStyle className={`page-${match?.pathname.replace(/\//g, '') || ''}`}>
      <AppHeader />
      {props.children}
      {contextHolder}
      {messageCtx}
    </PageStyle>
  );
};

const PageStyle = styled.div`
  min-height: 100vh;
  width: 100%;
`;
