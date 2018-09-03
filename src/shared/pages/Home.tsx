import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ReactLogo } from './Home.styled';

class Home extends React.Component<any> {
  render() {
    const { t } = this.props;
    return (
      <div>
        <div>Home :)</div>
        <Link to="/status">status</Link>
        <div>{t('features')}</div>
        <ReactLogo src={require('../assets/react.svg')} />
        <pre>{JSON.stringify(this.props.state, null, 2)}</pre>
      </div>
    );
  }
}
const mapStateToProps = (state: any) => ({ state });
export default connect(mapStateToProps)(translate()(Home));
