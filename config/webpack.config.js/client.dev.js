const baseConfig = require('./client.base');
const webpack = require('webpack');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  ...baseConfig,
  plugins: [
    new WriteFileWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    ...baseConfig.plugins,
    new ForkTsCheckerWebpackPlugin(),
    new BundleAnalyzerPlugin(),
  ],
  mode: 'development',
  devtool: 'cheap-module-inline-source-map',
  performance: {
    hints: false,
  },
};

module.exports = config;
