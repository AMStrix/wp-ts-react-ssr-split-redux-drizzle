const path = require('path');
const nodeExternals = require('webpack-node-externals');

const paths = require('../paths');
const { server: serverLoaders } = require('./loaders');
const resolvers = require('./resolvers');
const plugins = require('./plugins');

// REACT-UNIVERSAL EXAMPLE
// Try to use nodeExternals instead
// if you're specifying externals to leave unbundled, you need to tell Webpack
// to still bundle `react-universal-component`, `webpack-flush-chunks` and
// `require-universal-module` so that they know they are running
// within Webpack and can properly make connections to client modules:
// const externals = fs
//   .readdirSync(nodeModules)
//   .filter(x => !/\.bin|react-universal-component|webpack-flush-chunks/.test(x))
//   .reduce((externals, mod) => {
//     externals[mod] = `commonjs ${mod}`
//     return externals
//   }, {})
//   externals['react-dom/server'] = 'commonjs react-dom/server'

module.exports = {
  name: 'server',
  target: 'node',
  entry: {
    server: [path.resolve(__dirname, '../../src/server/index.tsx')],
  },
  externals: [
    nodeExternals({
      // we still want imported css from external files to be bundled otherwise 3rd party packages
      // which require us to include their own css would not work properly
      whitelist: [
        /\.css$/,
        /^antd.*style$/,
        'react-universal-component',
        'webpack-flush-chunks',
        'react-dom/server',
      ],
    }),
  ],
  output: {
    path: paths.serverBuild,
    filename: 'server.js',
    publicPath: paths.publicPath,
    libraryTarget: 'commonjs2',
  },
  resolve: { ...resolvers },
  module: {
    rules: serverLoaders,
  },
  plugins: [...plugins.shared, ...plugins.server],
  stats: {
    colors: true,
  },
};
