const fs = require('fs');
const webpack = require('webpack');
const nodemon = require('nodemon');
const rimraf = require('rimraf');
const webpackConfig = require('../config/webpack.config.js')(
  process.env.NODE_ENV || 'development',
);
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const express = require('express');
const paths = require('../config/paths');
const truffle = require('../scripts/truffle');
const { logMessage, compilerPromise } = require('./utils');

const app = express();

const WEBPACK_PORT =
  process.env.WEBPACK_PORT ||
  (!isNaN(Number(process.env.PORT)) ? Number(process.env.PORT) + 1 : 8501);

const start = async () => {
  rimraf.sync(paths.clientBuild);
  rimraf.sync(paths.serverBuild);

  await truffle.ethereumCheck();

  const [clientConfig, serverConfig] = webpackConfig;
  clientConfig.entry.bundle = [
    `webpack-hot-middleware/client?path=http://localhost:${WEBPACK_PORT}/__webpack_hmr`,
    ...clientConfig.entry.bundle,
  ];

  clientConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json';
  clientConfig.output.hotUpdateChunkFilename = 'updates/[id].[hash].hot-update.js';

  const publicPath = clientConfig.output.publicPath;

  clientConfig.output.publicPath = [`http://localhost:${WEBPACK_PORT}`, publicPath]
    .join('/')
    .replace(/([^:+])\/+/g, '$1/');

  serverConfig.output.publicPath = [`http://localhost:${WEBPACK_PORT}`, publicPath]
    .join('/')
    .replace(/([^:+])\/+/g, '$1/');

  const multiCompiler = webpack([clientConfig, serverConfig]);

  const clientCompiler = multiCompiler.compilers[0];
  const serverCompiler = multiCompiler.compilers[1];
  serverCompiler.hooks.compile.tap('_', () =>
    logMessage('Server is compiling...', 'info'),
  );
  clientCompiler.hooks.compile.tap('_', () =>
    logMessage('Client is compiling...', 'info'),
  );

  const clientInitialBuild = compilerPromise(clientCompiler);
  const serverInitialBuild = compilerPromise(serverCompiler);

  const watchOptions = {
    // poll: true,
    ignored: /node_modules/,
    stats: clientConfig.stats,
  };

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    return next();
  });

  app.use(
    webpackDevMiddleware(clientCompiler, {
      publicPath: clientConfig.output.publicPath,
      stats: clientConfig.stats,
      watchOptions,
    }),
  );

  app.use(webpackHotMiddleware(clientCompiler));

  app.use('/static', express.static(paths.clientBuild));

  const clientDevServer = app.listen(WEBPACK_PORT);

  const serverWatcher = serverCompiler.watch(watchOptions, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      console.log(stats.toString(serverConfig.stats));
      return;
    }

    if (error) {
      logMessage(error, 'error');
    }

    if (stats.hasErrors()) {
      const info = stats.toJson();
      logMessage('Server compilation errors:\n', 'error');
      info.errors.forEach(e => console.log(e + '\n'));
    }
  });

  // wait & check for errors on initial client and server builds
  try {
    await clientInitialBuild;
  } catch (error) {
    logMessage('Client initial build failed! ', 'error');
  }
  try {
    await serverInitialBuild;
  } catch (error) {
    logMessage('Server initial build failed! ', 'error');
  }

  const script = nodemon({
    script: `${paths.serverBuild}/server.js`,
    // todo: investigate why hot-updates are being generated for server build
    ignore: ['src', 'scripts', 'config', './*.*', 'build/client', '*.hot-update.*'],
    verbose: true,
  });

  // uncomment to see nodemon details
  // script.on('log', x => console.log(`LOG `, x.colour));

  script.on('crash', () =>
    logMessage(
      'Server crashed, will attempt to restart after changes. Waiting...',
      'error',
    ),
  );

  script.on('restart', () => {
    logMessage('Server restarted.', 'warning');
  });

  script.on('quit', () => {
    // logging here sometimes leaves a naked terminal line, boo
  });

  script.on('error', () => {
    logMessage('An error occured attempting to run the server. Exiting', 'error');
    process.exit(1);
  });
};

start();
