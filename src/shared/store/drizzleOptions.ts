// note: tsconfig allowSyntheticDefaultImports:true enables this import
//       require(...) may work if there are issues
import MetaCoin from 'contracts/MetaCoin.json';

export const options = {
  contracts: [MetaCoin],
  polls: {
    blocks: 3000,
    accounts: 3000,
  },
  // if fallback not set, drizzle will try local
  web3: { fallback: null },
  events: [],
};

export default options;
