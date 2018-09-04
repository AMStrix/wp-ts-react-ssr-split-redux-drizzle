import React from 'react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { ReactLogo } from './Features.styled';

class Home extends React.Component<any> {
  render() {
    const { t } = this.props;
    return (
      <div>
        <div>translated -> {t('features')}</div>
        <div>
          svg -> <ReactLogo src={require('../assets/react.svg')} />
        </div>
        <br /> go <Link to="/">home</Link>
      </div>
    );
  }
}

export default translate()(Home);
