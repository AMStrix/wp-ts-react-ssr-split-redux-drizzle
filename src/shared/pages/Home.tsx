import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Helmet } from 'react-helmet';
import loadable from 'loadable-components';

export const EthInit = loadable(() => import('../components/EthInit'));

class Home extends React.Component<any> {
  render() {
    return (
      <div>
        <Helmet>
          <title>Home</title>
          <meta name="home page" content="home page stuff" />
        </Helmet>
        <EthInit />
      </div>
    );
  }
}
const mapStateToProps = (state: any) => ({ state });
export default connect(mapStateToProps)(translate()(Home));
