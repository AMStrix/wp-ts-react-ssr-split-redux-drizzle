/// <reference types="cypress"/>
import * as Web3 from 'web3';

import * as truffleConfig from '../../../truffle';

const makeWeb3Conn = () => {
  const { host, port } = truffleConfig.networks.development;
  return `ws://${host}:${port}`;
};

const loadWeb3 = (window: any) => {
  window.web3 = new Web3(makeWeb3Conn());
};

describe('home', () => {
  it('should load and be able to browse pages (no web3)', () => {
    cy.visit('http://localhost:3000');
    cy.title().should('include', 'Home');
    cy.get('.ant-breadcrumb-link').contains('Home');

    cy.get('a[href="/sandbox"]').click();
    cy.title().should('include', 'Sandbox');

    cy.get('a[href="/metacoin').click();
    cy.title().should('include', 'MetaCoin');
    cy.get('a[href="https://metamask.io/"]').should('exist');
  });

  it('should load MetaCoin with web3 interaction', () => {
    cy.visit('http://localhost:3000/metacoin', { onBeforeLoad: loadWeb3 });
    cy.title().should('include', 'MetaCoin');
    cy.get('#address').should('exist');
    cy.window()
      .then(w => w.web3.eth.getAccounts())
      .then(console.log);
  });
});
