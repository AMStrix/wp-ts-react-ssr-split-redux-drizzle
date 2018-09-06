import React from 'react';

import styled from 'styled-components';
import { Row, Col, Icon } from 'antd';

interface Props {
  message?: string;
}

const SpinBox = styled.div`
  font-size: 1.6em;
  i {
    padding-right: 0.6em;
    color: orange;
  }
`;

const PageLoading = (p: Props) => (
  <Row type="flex" justify="space-around" align="middle" style={{ minHeight: '280px' }}>
    <Col span={8} style={{ textAlign: 'center' }}>
      <SpinBox>
        <Icon type="loading" spin />
        <span>{p.message || 'Loading...'}</span>
      </SpinBox>
    </Col>
  </Row>
);

export default PageLoading;
