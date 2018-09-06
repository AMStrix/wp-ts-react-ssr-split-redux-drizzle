import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Helmet from 'react-helmet';

import GetMetaMask from '../components/GetMetaMask';
import PageLoading from '../components/PageLoading';

class MetaCoin extends React.Component<any> {
  render() {
    const {
      drizzleStatus: { initialized },
    } = this.props.state;
    const web3Injected = typeof window !== 'undefined' && !!(window as any).web3;
    return (
      <div>
        <Helmet>
          <title>MetaCoin</title>
          <meta name="metacoin page" content="metacoin page stuff" />
        </Helmet>
        <div>{initialized ? <Interact {...this.props} /> : <GetMetaMask />}</div>
      </div>
    );
  }
}
const mapStateToProps = (state: any) => ({ state });
export default connect(mapStateToProps)(translate()(MetaCoin));

const Interact = (p: any) => {
  const {
    accounts,
    contracts,
    drizzleStatus: { initialized },
  } = p.state;
  (window as any).xxx = contracts.MetaCoin.methods;
  if (!initialized) return <PageLoading message="Initializing..." />;
  return <div>INTERACT</div>;
};
