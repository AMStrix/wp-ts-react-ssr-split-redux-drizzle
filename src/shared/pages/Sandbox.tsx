import React from 'react';
import { translate } from 'react-i18next';
import { Card } from 'antd';
import Helmet from 'react-helmet';

import { Style, ReactLogo, A, B, C } from './Sandbox.styled';
import css from './Sandbox.css';

class Sandbox extends React.Component<any> {
  render() {
    const { t } = this.props;
    return (
      <Style>
        <Helmet>
          <title>Sandbox</title>
          <meta name="sandbox page" content="sandbox page stuff" />
        </Helmet>
        <Card title="Translated Text">
          <p>"{t('features')}"</p>
        </Card>
        <Card title="SVG">
          <ReactLogo src={require('../assets/react.svg')} />
        </Card>
        <Card title="CSS">
          <span className={css.a}>Styled</span>
          <span className={css.b}> with</span>
          <span className={css.c}> css.</span>
        </Card>
        <Card title="styled-components">
          <A>Styled</A>
          <B> with</B>
          <C> styled-components</C>
        </Card>
      </Style>
    );
  }
}

export default translate()(Sandbox);
