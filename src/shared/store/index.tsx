import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { Drizzle } from 'drizzle';

import drizzleOptions from './drizzleOptions';
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

export const configureStore = (
  { initialState, middleware }: Config = { initialState: undefined, middleware: [] },
) => {
  const devtools = isDev && !isServer && composeWithDevTools({});
  const composeEnhancers = devtools || compose;
  const sagaMiddleware = createSagaMiddleware();
  const extraMiddleware = [
    sagaMiddleware,
    isDev && !isServer && createLogger({ collapsed: true }),
  ].filter(Boolean);
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware.concat(extraMiddleware))),
  );

  sagaMiddleware.run(rootSaga);
  new Drizzle(drizzleOptions, store); // init drizzle

  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('./rootReducer', () =>
        store.replaceReducer(require('./rootReducer').default),
      );
    }
  }

  return store;
};

export default configureStore;
