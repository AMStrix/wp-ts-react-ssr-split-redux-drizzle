const wp = require('@cypress/webpack-preprocessor');
module.exports = on => {
  // on('before:browser:launch', (browser = {}, args) => {
  //   console.log(browser);
  //   if (browser.name === 'chrome') {
  //     args.push('--load-extension=/Users/aaron/nkbihfbeogaeaoehlefnkodbefgpgknn/4.9.3_0');
  //   }
  //   return args;
  // });
  const options = {
    webpackOptions: {
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: 'ts-loader',
            options: { transpileOnly: true },
          },
        ],
      },
    },
  };
  on('file:preprocessor', wp(options));
};
