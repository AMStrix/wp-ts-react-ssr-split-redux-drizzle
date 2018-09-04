import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { drizzleReducers } from 'drizzle';

import app from './app/reducer';

const rootReducer = combineReducers({
  app,
  router,
  ...drizzleReducers,
});

export default rootReducer;
