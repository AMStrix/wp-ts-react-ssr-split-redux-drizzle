import React from 'react';
import { hot } from 'react-hot-loader';
import { Switch, Route, Redirect } from 'react-router';

import { Home, Sandbox, MetaCoin } from './routes';
import Layout from './containers/Layout';

class App extends React.Component<any> {
  render() {
    return (
      <Layout>
        <Switch>
          <Route exact={true} path="/" component={Home} />
          <Route path="/sandbox" component={Sandbox} />
          <Route path="/metacoin" component={MetaCoin} />
          <Route path="/*" render={() => <Redirect to="/" />} />
        </Switch>
      </Layout>
    );
  }
}

export default hot(module)(App);
