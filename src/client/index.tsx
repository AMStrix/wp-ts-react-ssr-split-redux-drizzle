import React from 'react';
import createHistory from 'history/createBrowserHistory';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { loadComponents } from 'loadable-components';
import { ConnectedRouter as Router, routerMiddleware } from 'react-router-redux';
import IntlProvider from '../shared/i18n/IntlProvider';

import { configureStore } from '../shared/store';
import App from '../shared/App';

const windowTyped = (window as any) || {};
const browserHistory = windowTyped.browserHistory || createHistory();
const store =
  windowTyped.store ||
  configureStore({
    initialState: windowTyped.__PRELOADED_STATE__,
    middleware: [routerMiddleware(browserHistory)],
  });

loadComponents().then(() => {
  hydrate(
    <Provider store={store}>
      <Router history={browserHistory}>
        <IntlProvider>
          <App />
        </IntlProvider>
      </Router>
    </Provider>,
    document.getElementById('app'),
  );
});

if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept();
  }

  if (!windowTyped.store || !windowTyped.browserHistory) {
    windowTyped.browserHistory = browserHistory;
    windowTyped.store = store;
  }
}
