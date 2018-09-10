/// <reference types="cypress"/>
import Web3 = require('web3');

// @ts-ignore
import truffleConfig = require('../../../truffle');

const makeWeb3Conn = () => {
  const { host, port } = truffleConfig.networks.development;
  return `ws://${host}:${port}`;
};

const loadWeb3 = (window: any) => {
  window.web3 = new Web3(makeWeb3Conn());
};

interface Window {
  web3: Web3;
}

describe('home', () => {
  it('should be able to transfer metacoin', () => {
    cy.visit('http://localhost:3000/metacoin', { onBeforeLoad: loadWeb3 });
    cy.title().should('include', 'MetaCoin');
    cy.get('#address').should('exist'); // wait for interactions to load
    let oldBal = 0;
    cy.contains(/balance: [0-9]+/).then(
      (x: any) => (oldBal = parseInt(x.text().replace(/[^0-9]+/, ''), 10)),
    );
    cy.window()
      .then(w => (w as any).web3.eth.getAccounts())
      .then(accts => {
        console.log(oldBal);
        const sender = accts[0];
        const recip = accts[1];
        cy.get('#address').type(recip);
        cy.get('#amount').type('5');
        cy.get('button[type="submit"]').click();
        cy.contains('balance: ' + (oldBal - 5));
      });
  });
});
