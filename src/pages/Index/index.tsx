import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Dropdown, MenuProps, Segmented, Select } from 'antd';
import { AppLayout } from 'src/layout';
import { fetchJson } from 'src/utils';
import { usePromise } from 'src/hook/usePromise';
import { ECharts } from 'src/components/ECharts';
import * as echarts from 'echarts';

const req = fetchJson('/BTC-ETF.json');

export const PageIndex: React.FC<{}> = (props) => {
  const data: any[] = usePromise(req);
  const options = useMemo(() => {
    if (!data?.[0]) return null;
    const last = data[data.length - 1];
    const list: string[] = Object.keys(last).filter((key) => key !== 'date');
    list.sort((a, b) => last[b] - last[a]);
    const dates = data.map((d) => d.date);
    const total = data.map((d) => {
      let s = 0;
      for (let key in d) {
        if (key === 'date') continue;
        s += d[key];
      }
      if (!d.Total) d.Total = s;
      return s;
    });
    if (list[0] !== 'Total') list.unshift('Total');
    const series = list.map((name) => {
      let yAxisIndex = 0;
      const ext = {} as any;
      if (name === 'Total') {
        yAxisIndex = 1;
        Object.assign(ext, {
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(58,77,233,0.8)' },
              { offset: 1, color: 'rgba(58,77,233,0.3)' },
            ]),
          },
        });
      }
      return {
        ...ext,
        name,
        type: 'line',
        // smooth: true,
        yAxisIndex,
        showSymbol: false,
        data: data.map((d) => d[name]),
      };
    });
    const options = {
      title: { text: '' },
      tooltip: {
        // hideDelay: 1000000,
        trigger: 'axis',
        formatter: (params: any[], ticket: string) => {
          console.log(ticket, params);
          if (!params || !params.length) return null;
          const items = params.map((item) => {
            const diff = item.value - data[item.dataIndex - 1]?.[item.seriesName];
            let prevStr = '';
            if (diff > 0) prevStr = `<span style="color: green;margin-right: 4px;">(+${diff})</span>`;
            if (diff < 0) prevStr = `<span style="color: red;margin-right: 4px;">(${diff})</span>`;
            return `<div style="display:flex;justify-content: space-between;">
            <div>${item.marker} ${item.seriesName}</div>
            <div>${prevStr}${item.value}</div>
            </div>`;
          });
          return `<div>
          <div>${params[0].axisValue}</div>
          ${items.join(' ')}
          </div>`;
        },
      },
      dataZoom: [
        { show: true, realtime: true, start: 0, end: 100, xAxisIndex: [0, 1] },
        { type: 'inside', realtime: true, start: 0, end: 100, xAxisIndex: [0, 1] },
      ],
      legend: { data: list },
      grid: { top: '18%', left: '3%', right: '4%', bottom: '10%', containLabel: true },
      toolbox: { feature: { saveAsImage: {} } },
      xAxis: [{ type: 'category', boundaryGap: false, data: dates }],
      yAxis: [{ type: 'value' }, { type: 'value' }],
      series,
    };
    return options;
  }, [data]);
  return (
    <AppLayout>
      <PageIndexStyle>
        <ECharts style={{ width: '100vw', height: 600, paddingTop: 100 }} options={options} />
      </PageIndexStyle>
    </AppLayout>
  );
};

const PageIndexStyle = styled.div`
  width: 100vw;
  min-height: 100vh;
`;
