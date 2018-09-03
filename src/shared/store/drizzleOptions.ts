// note: tsconfig allowSyntheticDefaultImports:true enables this import
//       require(...) may work if there are issues
import MetaCoin from 'contracts/MetaCoin.json';

export const options = {
  contracts: [MetaCoin],
  web3: {},
  events: [],
};

export default options;
