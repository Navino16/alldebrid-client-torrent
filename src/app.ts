import express, { NextFunction, Request, Response } from 'express';
import { logger, morganLogger } from './Utils';
import Constants from './Constants';
import { AppRoutes, TorrentRoutes } from './Routes';
import { AppDataSource } from './AppDataSource';
import { AllDebrid } from './AllDebrid';

logger.debug('[app.ts - Express]: Create application');
const app = express();

logger.debug('[app.ts - Express]: Configure application to only accept JSON');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure authorized methods
logger.debug('[app.ts - Express]: Configure authorized methods');
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE, OPTIONS');
  next();
});

logger.debug('[app.ts - Express]: Add request logger');
app.use(morganLogger);

logger.debug('[app.ts - Express]: Set routes');
app.use('/api/v2/app', AppRoutes);
app.use('/api/v2/torrents', TorrentRoutes);

// Define error middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err && err.message) {
    logger.error('[app.ts - Error handler]: %s', err.message);
    res.status(500).send(err.message);
    return;
  }
  next(err);
});

// Handle 404 - Keep this as a last route
app.use((req: Request, res: Response) => {
  logger.warn('[app.ts - 404 handler]: %s not found', req.path);
  res.status(404).send('404 - Not Found');
});

// Connect to database
logger.debug('[app.ts - TypeORM]: Connect to database');
AppDataSource.initialize().then(() => {
  logger.debug('[app.ts - Express]: Start listening');
  app.listen(Constants.PORT, () => {
    logger.info(
      '[app.ts - Express]: App is running at http://localhost:%d in mode %s',
      Constants.PORT,
      Constants.NODE_ENV,
    );
    logger.info('[app.ts - Express]: Press CTRL-C to stop');
    AllDebrid.setupAllJobs();
    app.emit('ServerReady');
  });
}).catch((reason) => { logger.error('[app.ts - TypeORM]:  %s', reason); });

// Catch CTRL-C
process.on('SIGINT', () => {
  logger.info('[app.ts - System]: Receive SIGINT signal');
  logger.info('[app.ts - System]: Application stopped');
  process.exit();
});
