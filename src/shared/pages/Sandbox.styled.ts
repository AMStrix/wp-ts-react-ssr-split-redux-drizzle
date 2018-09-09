import styled from 'styled-components';

export const ReactLogo = styled.img`
  vertical-align: middle;
  height: 48px;
  width: 48px;
`;

export const Style = styled.div`
  > div {
    display: flex;
    .ant-card {
      width: 220px;
      margin-bottom: 1em;
    }
    .ant-card + .ant-card {
      margin-left: 1em;
    }
  }
`;

export const A = styled.span`
  color: red;
`;

export const B = styled.span`
  color: green;
`;

export const C = styled.span`
  color: blue;
`;
