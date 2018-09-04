import React from 'react';
import { hot } from 'react-hot-loader';
import { translate } from 'react-i18next';
import { Switch, Route } from 'react-router';

import { Home, Features, MetaCoin } from './routes';
import Layout from './containers/Layout';

class App extends React.Component<any> {
  render() {
    return (
      <Layout>
        <Switch>
          <Route exact={true} path="/" component={Home} />
          <Route path="/features" component={Features} />
          <Route path="/metacoin" component={MetaCoin} />
        </Switch>
      </Layout>
    );
  }
}

export default hot(module)(translate()(App));
