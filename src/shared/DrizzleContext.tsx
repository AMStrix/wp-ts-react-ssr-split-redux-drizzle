import React from 'react';
import { Drizzle } from 'drizzle';
import drizzleOptions from './store/drizzleOptions';

interface MetaCoin {
  methods: {
    getBalance: () => void;
  };
}

export interface Drizzle {
  contracts: {
    MetaCoin: MetaCoin;
  };
}

const DrizzleContext = React.createContext({});

const Provider = (p: any) => {
  const drizzle: Drizzle = new Drizzle(drizzleOptions, p.store);
  return <DrizzleContext.Provider value={drizzle}>{p.children}</DrizzleContext.Provider>;
};

const Consumer = DrizzleContext.Consumer;

export default { Consumer, Provider };
