const paths = require('../paths');

module.exports = {
  extensions: ['.ts', '.tsx', '.js', '.mjs', '.json'],
  modules: paths.resolveModules,
  // tsconfig.compilerOptions.paths should sync with these
  alias: {
    contracts: paths.contractsBuild, // truffle build contracts dir
  },
};
