import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Switch, Route } from 'react-router';

import { Home, Status } from './routes';
import Layout from './containers/Layout';

class App extends React.Component<any> {
  render() {
    return (
      <Layout>
        <Switch>
          <Route exact={true} path="/" component={Home} />
          <Route path="/status" component={Status} />
        </Switch>
      </Layout>
    );
  }
}

const mapStateToProps = (state: any) => ({ state });
export default connect(mapStateToProps)(translate()(App));
