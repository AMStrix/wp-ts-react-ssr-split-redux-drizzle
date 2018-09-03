const baseConfig = require('./client.base');
const webpack = require('webpack');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const config = {
    ...baseConfig,
    plugins: [
        new WriteFileWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        ...baseConfig.plugins,
        new ForkTsCheckerWebpackPlugin(),
    ],
    mode: 'development',
    devtool: 'cheap-module-inline-source-map',
    performance: {
        hints: false,
    },
};

module.exports = config;
