const path = require('path');
const fs = require('fs');
const findRoot = require('find-root');

const appDirectory = fs.realpathSync(process.cwd());
// truffle exec cwd moves to called js, so make sure we are on root
const appRoot = findRoot(appDirectory);
const resolveApp = relativePath => path.resolve(appRoot, relativePath);

const paths = {
  clientBuild: resolveApp('build/client'),
  serverBuild: resolveApp('build/server'),
  dotenv: resolveApp('.env'),
  src: resolveApp('src'),
  srcClient: resolveApp('src/client'),
  srcServer: resolveApp('src/server'),
  srcShared: resolveApp('src/shared'),
  publicPath: '/static/',
  contractsBuild: resolveApp('build/contracts'),
  logs: resolveApp('logs'),
};

paths.resolveModules = [
  paths.srcClient,
  paths.srcServer,
  paths.srcShared,
  paths.src,
  'node_modules',
];

module.exports = paths;
