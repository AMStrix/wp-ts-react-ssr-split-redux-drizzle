const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');

const paths = require('../config/paths');
const { logMessage, isPortTaken } = require('./utils');

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

const compile = (module.exports.compile = () => {
  childProcess.execSync('truffle compile');
});

const migrate = (module.exports.migrate = () => {
  childProcess.execSync('truffle migrate');
});

module.exports.ethereumCheck = async () => {
  let isGanashePortTaken;
  try {
    isGanashePortTaken = await isPortTaken(8545);
    if (isGanashePortTaken) {
      logMessage('Ganache appears to be running (port 8545 in use).');
    } else {
      logMessage('Ganache might not be running, port 8545 is not in use.', 'error');
    }
  } catch (e) {
    console.log('Encountered error checking if ganache port is taken: ', e);
  }

  const contractDirCheck = fs.existsSync(paths.contractsBuild);
  if (contractDirCheck) {
    logMessage(
      'Truffle contracts build directory exists. Skip truffle compile & migrate.',
      'info',
    );
  } else {
    if (isGanashePortTaken) {
      logMessage('truffle compile, please wait...', 'info');
      compile();
      logMessage('truffle migrate, please wait...', 'info');
      migrate();
    } else {
      logMessage(
        'WARNING: no truffle contract build dir @ ' + paths.contractsBuild,
        'error',
      );
    }
  }
};
