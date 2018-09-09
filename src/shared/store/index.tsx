import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const isDev = process.env.NODE_ENV === 'development';
export const isServer = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

interface Config {
  initialState: any;
  middleware: any[];
}

const doNotLog = [
  'ACCOUNTS_FETCHED',
  'ACCOUNT_BALANCE_FETCHED',
  'ACCOUNT_BALANCES_FETCHED',
  'SYNCING_ACCOUNTS',
  'BLOCK_FOUND',
];

export const configureStore = (
  { initialState, middleware }: Config = { initialState: undefined, middleware: [] },
) => {
  const devtools = isDev && !isServer && composeWithDevTools({});
  const composeEnhancers = devtools || compose;
  const sagaMiddleware = createSagaMiddleware();
  const extraMiddleware = [
    sagaMiddleware,
    isDev &&
      !isServer &&
      createLogger({
        collapsed: true,
        predicate: (getState, action) => doNotLog.indexOf(action.type) === -1,
      }),
  ].filter(Boolean);
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware.concat(extraMiddleware))),
  );

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

export default configureStore;
