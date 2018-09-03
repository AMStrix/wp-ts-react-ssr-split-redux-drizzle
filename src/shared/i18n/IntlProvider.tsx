import React, { ReactNode } from 'react';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { connect } from 'react-redux';
import { getLocale } from '../store/app/selectors';

import deDE from './locales/de-DE.json';
import enUS from './locales/en-US.json';

i18next.init({
  fallbackLng: 'en-US',
  fallbackNS: ['translation'],
  resources: {
    'de-DE': deDE,
    'en-US': enUS,
  },
  parseMissingKeyHandler: missing => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('MISSING TRANSLATION:', missing);
    }
    return missing;
  },
});

export interface Props {
  children: ReactNode;
  locale: string;
}

class I18N extends React.Component<Props> {
  componentDidMount() {
    i18next.changeLanguage(this.props.locale);
  }

  componentDidUpdate(prevProps: Props) {
    const { locale: newLocale } = this.props;
    const { locale: oldLocale } = prevProps;

    if (oldLocale !== newLocale) {
      i18next.changeLanguage(newLocale);
    }
  }

  render() {
    return <I18nextProvider i18n={i18next}>{this.props.children}</I18nextProvider>;
  }
}

const mapStateToProps = (state: any) => ({
  locale: getLocale(state),
});

export default connect(
  mapStateToProps,
  null,
  null,
  { pure: false },
)(I18N);
