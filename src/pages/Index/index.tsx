import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Dropdown, MenuProps, Segmented, Select } from 'antd';
import { AppLayout } from 'src/layout';
import { fetchJson, localStorageEffect } from 'src/utils';
import { usePromise } from 'src/hook/usePromise';
import { ECharts } from 'src/components/ECharts';
import * as echarts from 'echarts';
import { GlobalVar } from 'src/constants';
import { atom, useRecoilState } from 'recoil';
import { ETFsTable } from 'src/components/ETFsTable';

// fetchJson('/BTC-ETF.json');
const fetchData = () => {
  return fetch(`https://docs.google.com/spreadsheets/d/${GlobalVar.GoogleSheetsId}/gviz/tq?tqx=out:csv&sheet=${GlobalVar.SheetsName}`).then(async (res) => {
    const text = await res.text();
    const lines: string[][] = text.split('\n').map((a) => a.replace(/^"/, '').replace(/"$/, '').split(`","`));
    console.log(lines);
    const json: Record<string, string | number>[] = [];
    const header = lines.shift()?.filter((a) => a);
    lines.forEach((line, lIndex) => {
      // 日期还没填写的行,暂时不显示
      if (!line[0]) return;
      const data: Record<string, string | number> = {};
      let total = 0;
      header?.forEach((key, index) => {
        if (['总计', '日变动率'].includes(key)) return;
        if (key === '日期') {
          data[key] = line[index];
        } else {
          const value = line[index];
          const prevValue = lines[lIndex - 1]?.[index] || '0';
          const val = parseFloat((value || prevValue).replace(/,/g, ''));
          data[key] = val;
          data[`${key}_updated`] = value ? 'true' : 'false';
          total += val;
          data['总计'] = total;
        }
      });
      json.push(data);
    });
    return json;
  });
};
let req = fetchData();

export const stateCacheBtcEtfs = atom({
  key: 'stateCacheBtcEtfs',
  default: null as null | any[],
  effects_UNSTABLE: [localStorageEffect('stateCacheBtcEtfs')],
});

export const PageIndex: React.FC<{}> = (props) => {
  const [query, _query] = useState(req);
  useEffect(() => {
    const timer = setInterval(() => {
      _query(fetchData());
    }, 30000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  const lastData: any[] | null = usePromise(query);
  const [cache, _cache] = useRecoilState(stateCacheBtcEtfs);
  useEffect(() => {
    if (!lastData) return;
    _cache(lastData);
  }, [lastData]);

  const data = useMemo(() => {
    if (lastData) return lastData;
    return cache;
  }, [cache, lastData]);

  const options = useMemo(() => {
    if (!data?.[0]) return null;
    const last = data[data.length - 1];
    const list: string[] = Object.keys(last).filter((key) => key !== '日期' && !key.match(/_updated/));
    list.sort((a, b) => {
      // if (last[`${b}_updated`] === 'false') return -1;
      // if (last[`${a}_updated`] === 'false') return 1;
      return last[b] - last[a];
    });
    const dates = data.map((d) => d['日期']);
    const series = list.map((name) => {
      let yAxisIndex = 0;
      const ext = {} as any;
      if (name === '总计') {
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
        position: function (point: any, params: any, dom: any, rect: any, size: any) {
          return [point[0] - size.contentSize[0] - 50, '10%'];
        },
        formatter: (params: any[], ticket: string) => {
          if (!params || !params.length) return null;
          const items = params.map((item) => {
            const diff = item.value - data[item.dataIndex - 1]?.[item.seriesName];
            let prevStr = '';
            if (data[item.dataIndex]?.[`${item.seriesName}_updated`] === 'false') {
              prevStr = `<span style="color: #999;margin-right: 4px;">(?)</span>`;
            } else {
              if (diff > 0) prevStr = `<span style="color: green;margin-right: 4px;">(+${diff.toLocaleString()})</span>`;
              if (diff < 0) prevStr = `<span style="color: red;margin-right: 4px;">(${diff.toLocaleString()})</span>`;
            }
            return `<div style="display:flex;justify-content: space-between;">
            <div>${item.marker} ${item.seriesName}</div>
            <div>${prevStr}${item.value.toLocaleString()}</div>
            </div>`;
          });
          return `<div>
          <div>${params[0].axisValue} 单位(BTC)</div>
          <div style="display:flex;justify-content: space-between;">
            <div>ETF</div>
            <div>(对比前一次增减)当前持有BTC总量</div>
          </div>
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
        <h4 style={{ padding: '0 30px' }}>
          当前数据来源于由{' '}
          <a href="https://twitter.com/Phyrex_Ni" target="_blank" rel="external noreferrer">
            @Phyrex_Ni
          </a>{' '}
          和{' '}
          <a href="https://twitter.com/follow_clues" target="_blank" rel="external noreferrer">
            @follow_clues
          </a>{' '}
          创建并维护的 google sheets{' '}
          <a href="https://docs.google.com/spreadsheets/d/1jf5CmR-z8T9ldP0APSrofMBC_hxViJ8DWqPtopRcYeI/edit?gid=486385649#gid=486385649" target="_blank" rel="external noreferrer">
            现货ETF数据跟踪统计表
          </a>
        </h4>
        <ECharts style={{ width: '100vw', height: 600, paddingTop: 100 }} options={options} />
        {/* <ETFsTable data={data} /> */}
      </PageIndexStyle>
    </AppLayout>
  );
};

const PageIndexStyle = styled.div`
  width: 100vw;
  min-height: 100vh;
  padding-bottom: 300px;
`;
