import { routerReducer as router } from 'react-router-redux';
import { drizzleReducers } from 'drizzle';

import app from './app/reducer';
import metaCoin from './metaCoin/reducer';

const {
  accounts,
  accountBalances,
  contracts,
  drizzleStatus,
  transactionStack,
  transactions,
  web3,
} = drizzleReducers;

const rootReducer = (state: any = {}, action: any) => {
  return {
    app: app(state.app, action),
    router: router(state.router, action),
    accounts: accounts(state.accounts, action),
    accountBalances: accountBalances(state.accountBalances, action),
    contracts: contracts(state.contracts, action),
    drizzleStatus: drizzleStatus(state.drizzleStatus, action),
    transactionStack: transactionStack(state.transactionStack, action),
    transactions: transactions(state.transactions, action),
    web3: web3(state.web3, action),
    metaCoin: metaCoin(state.metaCoin, action, state),
  };
};

export default rootReducer;
