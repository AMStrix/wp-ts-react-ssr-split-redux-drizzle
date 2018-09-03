const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const babelPresets = [
  '@babel/react',
  // '@babel/typescript',
  ['@babel/env', { modules: false }],
];

const lessLoader = {
  loader: 'less-loader',
  options: { javascriptEnabled: true },
};

const tsBabelLoaderClient = {
  test: /\.tsx?$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        plugins: [
          'dynamic-import-webpack', // for client
          'loadable-components/babel',
          ['styled-components', { ssr: true }],
          '@babel/plugin-proposal-object-rest-spread',
          '@babel/plugin-proposal-class-properties',
          ['import', { libraryName: 'antd', style: true }],
        ],
        presets: babelPresets,
        // env: {
        //     test: {
        //         plugins: ['@babel/plugin-transform-modules-commonjs']
        //     }
        // }
      },
    },
    {
      loader: 'ts-loader',
      options: { transpileOnly: process.env.NODE_ENV === 'development' },
    },
  ],
};

const tsBabelLoaderServer = {
  test: /\.tsx?$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        plugins: [
          'loadable-components/babel',
          ['styled-components', { ssr: true }],
          'dynamic-import-node', // for server
          '@babel/plugin-proposal-object-rest-spread',
          '@babel/plugin-proposal-class-properties',
          ['import', { libraryName: 'antd', style: true }],
        ],
        presets: babelPresets,
      },
    },
    {
      loader: 'ts-loader',
      options: { transpileOnly: process.env.NODE_ENV === 'development' },
    },
  ],
};

const cssLoaderClient = {
  test: /\.css$/,
  exclude: /node_modules/,
  use: [
    'css-hot-loader',
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        camelCase: true,
        modules: true,
        importLoaders: 1,
        sourceMap: true,
        localIdentName: '[name]__[local]--[hash:base64:5]',
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
      },
    },
  ],
};

const lessLoaderClient = {
  test: /\.less$/,
  exclude: /node_modules/,
  use: [...cssLoaderClient.use, lessLoader],
};

const cssLoaderServer = {
  test: /\.css$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'css-loader/locals',
      options: {
        camelCase: true,
        importLoaders: 1,
        modules: true,
        localIdentName: '[name]__[local]--[hash:base64:5]',
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
      },
    },
  ],
};

const lessLoaderServer = {
  test: /\.less$/,
  exclude: /node_modules/,
  use: [...cssLoaderServer.use, lessLoader],
};

const urlLoaderClient = {
  test: /\.(png|jpe?g|gif|svg)$/,
  loader: require.resolve('url-loader'),
  options: {
    limit: 2048,
    name: 'assets/[name].[hash:8].[ext]',
  },
};

const urlLoaderServer = {
  ...urlLoaderClient,
  options: {
    ...urlLoaderClient.options,
    emitFile: false,
  },
};

const fileLoaderClient = {
  exclude: [/\.(js|ts|tsx|css|less|mjs|html|json|ejs)$/],
  use: [
    {
      loader: 'file-loader',
      options: {
        name: 'assets/[name].[hash:8].[ext]',
      },
    },
  ],
};

const fileLoaderServer = {
  // WARNING: this will catch all files except those below
  exclude: [/\.(js|ts|tsx|css|less|mjs|html|json|ejs)$/],
  use: [
    {
      loader: 'file-loader',
      options: {
        name: 'assets/[name].[hash:8].[ext]',
        emitFile: false,
      },
    },
  ],
};

// Write css files from node_modules to its own vendor.css file
const externalCssLoaderClient = {
  test: /\.css$/,
  include: /node_modules/,
  use: ['css-hot-loader', MiniCssExtractPlugin.loader, 'css-loader'],
};

const externalLessLoaderClient = {
  test: /\.less$/,
  include: /node_modules/,
  use: ['css-hot-loader', MiniCssExtractPlugin.loader, 'css-loader', lessLoader],
};

// Server build needs a loader to handle external .css files
const externalCssLoaderServer = {
  test: /\.css$/,
  include: /node_modules/,
  loader: 'css-loader/locals',
};

const externalLessLoaderServer = {
  test: /\.less$/,
  include: /node_modules/,
  use: ['css-loader/locals', lessLoader],
};

const client = [
  {
    // oneOf: first matching rule takes all
    oneOf: [
      tsBabelLoaderClient,
      cssLoaderClient,
      lessLoaderClient,
      urlLoaderClient,
      fileLoaderClient,
      externalCssLoaderClient,
      externalLessLoaderClient,
    ],
  },
];

const server = [
  {
    // oneOf: first matching rule takes all
    oneOf: [
      tsBabelLoaderServer,
      cssLoaderServer,
      lessLoaderServer,
      urlLoaderServer,
      fileLoaderServer,
      externalCssLoaderServer,
      externalLessLoaderServer,
    ],
  },
];

module.exports = {
  client,
  server,
};
