import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { createMemoryHistory, createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const isDev = process.env.NODE_ENV === 'development';
export const isServer = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

const doNotLog = [
  'ACCOUNTS_FETCHED',
  'ACCOUNT_BALANCE_FETCHED',
  'ACCOUNT_BALANCES_FETCHED',
  'SYNCING_ACCOUNTS',
  'BLOCK_FOUND',
];

const makeHistory = (path?: string) => {
  let history;
  if (isServer && path) {
    history = createMemoryHistory({ initialEntries: [path] });
  } else {
    if (window && (window as any)._history) {
      history = (window as any)._history;
    } else {
      history = createBrowserHistory();
      (window as any)._history = history;
    }
  }
  return history;
};

const getInitialState = () => {
  let initialState;
  if (isServer) {
    initialState = {};
  } else {
    initialState = window && (window as any).__PRELOADED_STATE__;
  }
  return initialState;
};

export const makeStore = (path?: string) => {
  if (!isServer && (window as any).store) return (window as any).store;
  const history = makeHistory(path);
  const initialState = getInitialState();

  const devtools = isDev && !isServer && composeWithDevTools({});
  const composeEnhancers = devtools || compose;
  const sagaMiddleware = createSagaMiddleware();
  const loggerMiddleware = createLogger({
    collapsed: true,
    predicate: (getState, action) => doNotLog.indexOf(action.type) === -1,
  });

  const middleware = [routerMiddleware(history), sagaMiddleware];
  if (isDev && !isServer) middleware.push(loggerMiddleware);

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware)),
  );

  (store as any)._history = history;

  if (!isServer) {
    (window as any).store = store;
  }

  let sagaTask = sagaMiddleware.run(rootSaga);
  sagaTask.done.catch(e => {
    console.log('rootSaga error', e.message);
  });

  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('./rootReducer', () =>
        store.replaceReducer(require('./rootReducer').default),
      );
      module.hot.accept('./rootSaga', () => {
        sagaTask.cancel();
        sagaTask.done.then(() => {
          sagaTask = sagaMiddleware.run(require('./rootSaga').default);
        });
      });
    }
  }

  return store;
};

export default makeStore;
