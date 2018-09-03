const truffle = require('./truffle');

module.exports = function(done) {
  // Initialize the truffle environment however we want, web3 is available
  if (!web3) {
    console.log(`web3 not available, skipping sending funds...`);
  } else {
    truffle.fund(web3);
  }
  console.info('Compiling smart contracts...');
  truffle.compile();
  console.info('Running migrations...');
  truffle.migrate();
  console.info('Truffle initialized, starting repl console!');
  done();
};
