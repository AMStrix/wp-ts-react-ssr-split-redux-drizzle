import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Helmet from 'react-helmet';

class MetaCoin extends React.Component<any> {
  render() {
    return (
      <div>
        <Helmet>
          <title>MetaCoin</title>
          <meta name="metacoin page" content="metacoin page stuff" />
        </Helmet>
        TODO
      </div>
    );
  }
}
const mapStateToProps = (state: any) => ({ state });
export default connect(mapStateToProps)(translate()(MetaCoin));
