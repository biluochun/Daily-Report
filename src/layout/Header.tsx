import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useMatch } from 'react-router-dom';
import styled from 'styled-components';

export const AppHeader: React.FC<{}> = (props) => {
  return (
    <PageStyle>
      <div className="left">
        <NavLink to="/">
          <img height={24} width={24} src="/favicon.png" />
          BTC-ETFs
        </NavLink>
        {/* <NavLink to="/ETH-ETFs">
          <img height={24} width={24} src="/token/eth.png" />
          ETH-ETFs
        </NavLink> */}
      </div>
    </PageStyle>
  );
};

const PageStyle = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  > .left {
    display: flex;
    gap: 16px;
    > a {
      text-decoration: none;
      font-size: 18px;
      color: #555;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      &:hover {
        opacity: 0.8;
        text-decoration: underline;
      }
      &.active {
        color: #b6ddff;
        text-decoration: underline;
      }
    }
  }
`;
