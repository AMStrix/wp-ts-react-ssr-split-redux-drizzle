import * as React from 'react';
import { connect } from 'react-redux';
import { Layout as AntdLayout, Menu, Icon } from 'antd';
const { Header, Content, Sider } = AntdLayout;

export interface Props {
  location: string;
}

class LayoutImpl extends React.Component<Props> {
  render() {
    return (
      <AntdLayout>
        <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
          <Menu theme="dark" mode="inline">
            <Menu.Item key="1">
              <Icon type="user" />
              <span className="nav-text">user</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <AntdLayout style={{ marginLeft: 200 }}>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff' }}>{this.props.children}</div>
          </Content>
        </AntdLayout>
      </AntdLayout>
    );
  }
}

const stateToProps = ({ router }: any) => {
  return {
    location: 'test',
  };
};

const Layout = connect(stateToProps)(LayoutImpl);

export default Layout;
