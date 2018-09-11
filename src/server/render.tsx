import React from 'react';
import { Request, Response } from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import IntlProvider from '../shared/i18n/IntlProvider';
import { getLoadableState } from 'loadable-components/server';
import { ServerStyleSheet } from 'styled-components';

import log from './log';
import { makeStore } from '../shared/store';
import DrizzleContext from '../shared/DrizzleContext';
import Html from './components/HTML';
import App from '../shared/App';

// react-router recommends agains redux - router integration, perhaps remove?
// https://reacttraining.com/react-router/web/guides/redux-integration

const serverRenderer = () => async (req: Request, res: Response) => {
  const store = makeStore(req.url);
  const sheet = new ServerStyleSheet();
  const reactApp = (
    <Provider store={store}>
      <DrizzleContext.Provider store={store}>
        <Router location={req.url} context={{}}>
          <IntlProvider>
            <App />
          </IntlProvider>
        </Router>
      </DrizzleContext.Provider>
    </Provider>
  );

  let loadableState;
  // 1. loadable state will render dynamic imports
  try {
    loadableState = await getLoadableState(reactApp);
  } catch (e) {
    const disp = `Error getting loadable state for SSR`;
    log.error(`${disp} \n ${e}`);
    return res.status(404).send(disp + ' (more info in server logs)');
  }
  // 2. styled components will gather styles & wrap in provider
  const styleConnectedApp = sheet.collectStyles(reactApp);

  const styleElements = sheet.getStyleElement();
  const content = renderToString(styleConnectedApp);
  const state = JSON.stringify(store.getState());

  // ! ensure manifest.json is available
  try {
    res.locals.getManifest();
  } catch (e) {
    const disp =
      'ERROR: Could not load client manifest.json, there was probably a client build error.';
    log.error(disp);
    return res.status(500).send(disp);
  }

  return res.send(
    '<!doctype html>' +
      renderToString(
        <Html
          css={[
            res.locals.assetPath('bundle.css'),
            res.locals.assetPath('vendor.css'),
          ].filter(Boolean)}
          styleElements={styleElements}
          scripts={[
            res.locals.assetPath('bundle.js'),
            res.locals.assetPath('vendor.js'),
          ].filter(Boolean)}
          state={state}
          loadableStateScript={loadableState.getScriptContent()}
        >
          {content}
        </Html>,
      ),
  );
};

export default serverRenderer;
