import express, { Request, Response, NextFunction } from 'express';
import * as cors from 'cors';
import * as path from 'path';
import chalk from 'chalk';
import manifestHelpers from 'express-manifest-helpers';
import * as bodyParser from 'body-parser';
import dotenv from 'dotenv';
import expressWinston from 'express-winston';

import log from './log';
import serverRender from './render';
// @ts-ignore
import * as paths from '../../config/paths';

const isDev = process.env.NODE_ENV === 'development';

dotenv.config();

const app = express();

// log requests
app.use(expressWinston.logger({ winstonInstance: log }));

if (isDev) {
  app.use(
    paths.publicPath,
    express.static(path.join(paths.clientBuild, paths.publicPath)),
  );
  app.use('/favicon.ico', (req, res) => {
    res.send('');
  });
} else {
  log.warn('PRODUCTION mode, serving static assets from node server.');
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

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  log.error(err);
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

app.use(expressWinston.errorLogger({ winstonInstance: log }));

app.listen(process.env.PORT || 3000, () => {
  const port = process.env.PORT || 3000;
  if (isDev) {
    console.log(chalk.blue(`App is running: 🌎 http://localhost:${port} `));
  } else {
    log.info(`Server started on port ${port}`);
  }
});

export default app;
