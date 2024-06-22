import React, { HTMLProps, useContext, useEffect, useState } from 'react';

import { tween } from 'shifty';
const lastShifty: Record<string, any> = {};
const lastShiftyFrom: Record<string, any> = {};
let sfIndex = 0;

interface CptTypes {
  from?: number;
  to: number;
  duration: number;
  fixed?: number;
}

// eslint-disable-next-line react/display-name
export const NumberRun: React.FC<CptTypes> = React.memo((props) => {
  const [value, setValue] = useState(props.from ?? props.to);
  const [index] = useState(sfIndex++);
  useEffect(() => {
    lastShiftyFrom[index] = props.from ?? props.to;
    return () => {
      if (!lastShifty[index]) return;
      lastShifty[index].stop();
      delete lastShifty[index];
    };
  }, []);

  useEffect(() => {
    UpdateNum(props.to);
  }, [props.to]);

  function UpdateNum(to: number) {
    if (lastShifty[index]) lastShifty[index].stop();
    lastShifty[index] = tween({
      from: { x: lastShiftyFrom[index] },
      to: { x: to },
      duration: props.duration,
      easing: 'linear',
      render: updateNumber,
    });
  }
  function updateNumber(state: any) {
    lastShiftyFrom[index] = state.x;
    setValue(state.x);
  }
  return <>{value.toFixed(props.fixed ?? 2)}</>;
});
