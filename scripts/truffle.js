const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');

require('../config/env');

module.exports = {};

module.exports.fund = web3 => {
  // Fund ETH accounts
  const ethAccounts = process.env.FUND_ETH_ADDRESSES
    ? process.env.FUND_ETH_ADDRESSES.split(',').map(a => a.trim())
    : [];

  if (ethAccounts.length) {
    console.info('Sending 50 ETH to the following addresses...');
    ethAccounts.forEach((addr, i) => {
      try {
        web3.eth.sendTransaction({
          to: addr,
          from: web3.eth.accounts[i],
          value: web3.toWei('50', 'ether'),
        });
        console.info(`    ${addr} <- from ${web3.eth.accounts[i]}`);
      } catch (error) {
        console.log(`    Error sending funds to ${addr} : ${error}`);
      }
    });
  } else {
    console.info('No accounts specified for funding in .env file...');
  }
};

module.exports.compile = () => {
  childProcess.execSync('truffle compile');
};

module.exports.migrate = () => {
  childProcess.execSync('truffle migrate');
};
