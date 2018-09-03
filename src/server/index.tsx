import express, { Request, Response, NextFunction } from 'express';
import * as cors from 'cors';
import * as path from 'path';
import chalk from 'chalk';
import manifestHelpers from 'express-manifest-helpers';
import * as bodyParser from 'body-parser';
import dotenv from 'dotenv';

import serverRender from './render';
// @ts-ignore
import * as paths from '../../config/paths';

dotenv.config();

const app = express();

// Use Nginx or Apache to serve static assets in production or remove the if() around the following
// lines to use the express.static middleware to serve assets for production (not recommended!)
if (process.env.NODE_ENV === 'development') {
  app.use(
    paths.publicPath,
    express.static(path.join(paths.clientBuild, paths.publicPath)),
  );
  app.use('/favicon.ico', (req, res) => {
    res.send('');
  });
} else if (process.env.NODE_ENV === 'production') {
  console.log('Warning: PRODUCTION mode, serving static assets from node server.');
  app.use(
    paths.publicPath,
    express.static(path.join(paths.clientBuild, paths.publicPath)),
  );
  app.use('/favicon.ico', (req, res) => {
    res.send('');
  });
}

app.use(cors());

app.use(bodyParser.json());

const manifestPath = path.join(paths.clientBuild, paths.publicPath);

app.use(
  manifestHelpers({
    manifestPath: `${manifestPath}/manifest.json`,
    cache: process.env.NODE_ENV === 'production',
    // prependPath: '//cdn.example/assets' // if statics are elsewhere
  }),
);

app.use(serverRender());

// eslint-disable-next-line no-unused-vars
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    status: 'error',
    message: err.message,
    stack:
      // print a nicer stack trace by splitting line breaks and making them array items
      process.env.NODE_ENV === 'development' &&
      (err.stack || '')
        .split('\n')
        .map((line: string) => line.trim())
        .map((line: string) => line.split(path.sep).join('/'))
        .map((line: string) =>
          line.replace(
            process
              .cwd()
              .split(path.sep)
              .join('/'),
            '.',
          ),
        ),
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `[${new Date().toISOString()}]` +
      chalk.blue(` App is running: 🌎 http://localhost:${process.env.PORT || 3000} `),
  );
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

export default app;
