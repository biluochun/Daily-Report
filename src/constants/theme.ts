import { ThemeConfig } from 'antd';

export const AntdTheme: ThemeConfig = {
  token: {
    colorBgElevated: '#153d39',
    colorBgContainer: '#001e1b',
    colorText: '#ececec',
    colorTextDescription: '#cbcbcb',
    colorBorder: '#003437',
    colorBorderSecondary: '#003437',
    colorPrimary: '#27a69a',
  },
  components: {
    Tabs: {},
    Slider: {
      railBg: '#ececec',
      railHoverBg: '#ececec55',
    },
    Tooltip: {
      colorBgSpotlight: '#005462',
    },
    Input: {
      activeBorderColor: '#003400',
      hoverBorderColor: '#003400',
      activeShadow: '#003400',
    },
    Table: {
      borderColor: '#ffffff14',
      headerSplitColor: '#ffffff14',
      colorText: '#00c192',
      headerColor: '#00ffc1',
      cellPaddingBlockSM: 1,
      cellPaddingInlineSM: 1,
      rowHoverBg: '#002244',
    },
    Segmented: {
      trackBg: '#f5f5f517',
      itemColor: '#ffffff85',
      itemSelectedBg: '#27a69a',
      itemSelectedColor: '#ffffff',
    },
  },
};
