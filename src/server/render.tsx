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

import fs from 'fs';
import path from 'path';
// @ts-ignore
import * as paths from '../../config/paths';
const isDev = process.env.NODE_ENV === 'development';

let cachedStats: any;
const getStats = () =>
  new Promise((res, rej) => {
    if (!isDev && cachedStats) {
      res(cachedStats);
      return;
    }
    const statsPath = path.join(paths.clientBuild, paths.publicPath, 'stats.json');
    fs.readFile(statsPath, (e, d) => {
      if (e) {
        rej(e);
        return;
      }
      cachedStats = JSON.parse(d.toString());
      res(cachedStats);
    });
  });

const chunkExtractFromLoadables = (loadableIds: string[]) =>
  getStats().then((stats: any) => {
    const mods = stats.modules.filter(
      (m: any) =>
        m.reasons.filter((r: any) => loadableIds.indexOf(r.userRequest) > -1).length > 0,
    );
    const chunks = mods.reduce((a: any[], m: any) => a.concat(m.chunks), []);
    const files = stats.chunks
      .filter((c: any) => chunks.indexOf(c.id) > -1)
      .reduce((a: string[], c: any) => a.concat(c.files), []);
    return {
      css: files.filter((f: string) => /.css$/.test(f)),
      js: files.filter((f: string) => /.js$/.test(f)),
    };
  });

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
  let loadableFiles;
  // 1. loadable state will render dynamic imports
  try {
    loadableState = await getLoadableState(reactApp);
    loadableFiles = await chunkExtractFromLoadables(
      loadableState.tree.children.map((c: any) => c.id),
    );
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

  const cssFiles = ['bundle.css', 'vendor.css', ...loadableFiles.css]
    .map(f => res.locals.assetPath(f))
    .filter(Boolean);
  const jsFiles = [...loadableFiles.js, 'bundle.js', 'vendor.js']
    .map(f => res.locals.assetPath(f))
    .filter(Boolean);

  return res.send(
    '<!doctype html>' +
      renderToString(
        <Html
          css={cssFiles}
          styleElements={styleElements}
          scripts={jsFiles}
          state={state}
          loadableStateScript={loadableState.getScriptContent()}
        >
          {content}
        </Html>,
      ),
  );
};

export default serverRenderer;
