import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import cx from 'classnames';

export const ECharts: React.FC<{
  options?: any;
  className?: string;
  style?: React.CSSProperties;
}> = React.memo(function ECharts(props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.ECharts | null>(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return;
    // if (chart.current) return;
    const temp = echarts.init(chartRef.current);
    temp.setOption({ ...props.options });
    chart.current = temp;
  }, [props.options]);

  return <div ref={chartRef} style={props.style} className={cx('echarts-react', props.className)} />;
});
