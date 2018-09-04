import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

class MetaCoin extends React.Component<any> {
  render() {
    return <div>MetaCoin</div>;
  }
}
const mapStateToProps = (state: any) => ({ state });
export default connect(mapStateToProps)(translate()(MetaCoin));
