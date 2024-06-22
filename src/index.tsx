import React from 'react';
import ReactDOM from 'react-dom/client';
import 'src/assets/scss/index.scss';
import { RecoilRoot } from 'recoil';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PageIndex } from 'src/pages/Index';
import { ConfigProvider } from 'antd';
import { AntdTheme } from 'src/constants/theme';
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <ConfigProvider theme={AntdTheme}>
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PageIndex />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </ConfigProvider>
  </React.StrictMode>,
);
