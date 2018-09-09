import React from 'react';
import { translate } from 'react-i18next';
import { Card } from 'antd';
import Helmet from 'react-helmet';

import { Style, A, B, C } from './Sandbox.styled';
import css from './Sandbox.css';
import less from './Sandbox.less';
import ReactLogo from '../assets/react.svg';

class Sandbox extends React.Component<any> {
  render() {
    const { t } = this.props;
    return (
      <Style>
        <Helmet>
          <title>Sandbox</title>
          <meta name="sandbox page" content="sandbox page stuff" />
        </Helmet>
        <div>
          <Card title="Translated Text">
            <p>"{t('features')}"</p>
          </Card>
          <Card title="SVG">
            <ReactLogo />
          </Card>
        </div>
        <div>
          <Card title="PNG">
            <img src={require('../assets/ethereum.png')} style={{ width: '100%' }} />
          </Card>
          <Card title="JPG">
            <img src={require('../assets/ethereum.jpg')} style={{ width: '100%' }} />
          </Card>
          <Card title="GIF">
            <img src={require('../assets/doge.gif')} style={{ width: '100%' }} />
          </Card>
        </div>
        <div>
          <Card title="CSS">
            <span className={css.a}>Styled</span>
            <span className={css.b}> with</span>
            <span className={css.c}> css.</span>
          </Card>
          <Card title="LESS">
            <span className={less.a}>Styled</span>
            <span className={less.b}> with</span>
            <span className={less.c}> less.</span>
          </Card>
          <Card title="styled-components">
            <A>Styled</A>
            <B> with</B>
            <C> styled-components</C>
          </Card>
        </div>
      </Style>
    );
  }
}

export default translate()(Sandbox);
