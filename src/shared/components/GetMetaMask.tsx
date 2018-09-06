import React from 'react';

import MmLogo from '../assets/metamask-fox.svg';
import styled from 'styled-components';
import { Row, Col } from 'antd';

const MmLink = styled.a`
  display: inline-block;
  font-size: 1.2em;
  outline: 1px solid #cccccc;
  color: #888888;
  padding: 0.5em;
  :hover {
    color: #444444;
    outline: 1px solid #444444;
  }
  svg {
    margin-bottom: -0.5em;
    margin-right: 0.2em;
  }
`;

const GetMetaMask = () => (
  <Row type="flex" justify="space-around" align="middle" style={{ minHeight: '280px' }}>
    <Col span={8} style={{ textAlign: 'center' }}>
      <p>
        In order to interact with MetaCoin,
        <br /> please install and configure MetaMask.
      </p>
      <MmLink href="https://metamask.io/" target="_blank">
        <MmLogo height="1.8em" />
        Get metamask
      </MmLink>
    </Col>
  </Row>
);

export default GetMetaMask;
