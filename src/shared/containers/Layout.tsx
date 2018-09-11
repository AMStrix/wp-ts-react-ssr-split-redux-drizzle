import * as React from 'react';
import { connect } from 'react-redux';
import { Layout as AntdLayout, Menu, Icon, Breadcrumb } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { Link, Redirect } from 'react-router-dom';
const { Header, Content, Footer } = AntdLayout;

import routes, { byPath } from '../routes';

class Layout extends React.Component<RouteComponentProps<any>> {
  render() {
    const {
      location: { pathname },
    } = this.props;
    const route = byPath[pathname];
    if (!route) {
      return <Redirect to="/" />;
    }
    return (
      <AntdLayout>
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            style={{ lineHeight: '64px' }}
            selectedKeys={[pathname]}
          >
            {routes.map(r => (
              <Menu.Item key={r.path}>
                <Link to={r.path}>
                  {r.icon && <Icon type={r.icon} />}
                  {r.disp}
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>{route.disp}</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            {this.props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Footer ©2018</Footer>
      </AntdLayout>
    );
  }
}

const mapStateToProps = (state: any) => ({ state });
export default connect(mapStateToProps)(withRouter(Layout));
