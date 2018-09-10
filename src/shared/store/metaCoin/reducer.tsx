export const initialState: any = Object.freeze({
  sending: false,
  sendingAmount: 0,
  stackId: -1,
  txHash: undefined,
  getting: false,
  status: 'init',
  account: undefined,
  balance: 0,
});

// find balance when account is changed in MM
const acctToGetBalHash: { [index: string]: string } = {};
const resolveBal = (account: string, fullState: any, balance: number) => {
  if (!fullState.contracts.MetaCoin) return balance;
  const hash = acctToGetBalHash[account];
  const getBal = fullState.contracts.MetaCoin.getBalance;
  if (hash && getBal && getBal[hash]) {
    return parseInt(getBal[hash].value, 10);
  }
  return balance;
};

let drizzle = {};

export default (state: any = initialState, action: any, fullState: any): any => {
  const { type } = action;
  switch (type) {
    case 'DRIZZLE_INITIALIZING': {
      drizzle = action.drizzle;
      (window as any).xxx = drizzle;
      return { ...state };
    }
    case 'CONTRACT_INITIALIZED': {
      const { name } = action;
      const status = name === 'MetaCoin' ? 'ready' : 'init';
      return { ...state, status };
    }
    case 'ACCOUNTS_FETCHED': {
      // catch account changes (mm switch active account)
      const account = action.accounts[0];
      const balance = resolveBal(account, fullState, state.balance);
      return { ...state, account, balance };
    }
    case 'CALL_CONTRACT_FN': {
      const {
        contract: { contractName },
        args: [acct],
        fnName,
      } = action;
      if (
        contractName === 'MetaCoin' &&
        acct === state.account &&
        fnName === 'getBalance'
      ) {
        return { ...state, getting: true };
      }
      return { ...state };
    }
    case 'GOT_CONTRACT_VAR': {
      const {
        name,
        variable,
        args: [acct],
        argsHash,
        value,
      } = action;
      if (name === 'MetaCoin' && acct === state.account && variable === 'getBalance') {
        acctToGetBalHash[acct] = argsHash;
        return { ...state, getting: false, balance: parseInt(value, 10) };
      }
      return { ...state };
    }
    case 'SEND_CONTRACT_TX': {
      const {
        contract: { contractName },
        fnName,
        args,
        stackId,
      } = action;
      if (contractName === 'MetaCoin' && fnName === 'sendCoin') {
        return { ...state, sending: true, sendingAmount: args[1], stackId };
      }
      return { ...state };
    }
    case 'TX_BROADCASTED': {
      const { stackId, txHash } = action;
      if (state.sending && stackId === state.stackId) {
        return { ...state, txHash };
      }
      return { ...state };
    }
    case 'TX_SUCCESSFUL': {
      const { txHash } = action;
      if (txHash === state.txHash) {
        return { ...state, sending: false, sendingAmount: 0 };
      }
      return { ...state };
    }
  }

  return state;
};
