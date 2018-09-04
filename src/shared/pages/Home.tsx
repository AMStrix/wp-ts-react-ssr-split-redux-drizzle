import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import EthInit from '../components/EthInit';

class Home extends React.Component<any> {
  render() {
    return (
      <div>
        <EthInit />
        {/* <pre>{JSON.stringify(this.props.state, null, 2)}</pre> */}
      </div>
    );
  }
}
const mapStateToProps = (state: any) => ({ state });
export default connect(mapStateToProps)(translate()(Home));
