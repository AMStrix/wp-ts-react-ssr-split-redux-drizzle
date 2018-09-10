import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { loadComponents } from 'loadable-components';
import { ConnectedRouter as Router } from 'react-router-redux';
import IntlProvider from '../shared/i18n/IntlProvider';
import DrizzleContext from '../shared/DrizzleContext';

import { makeStore } from '../shared/store';
import App from '../shared/App';

const store = makeStore();

loadComponents().then(() => {
  hydrate(
    <Provider store={store}>
      <DrizzleContext.Provider store={store}>
        <Router history={store._history}>
          <IntlProvider>
            <App />
          </IntlProvider>
        </Router>
      </DrizzleContext.Provider>
    </Provider>,
    document.getElementById('app'),
  );
});

if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept();
  }
}
