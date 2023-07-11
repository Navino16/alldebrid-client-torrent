import {
  createLogger, format, Logger, transports,
} from 'winston';
import morgan, { StreamOptions } from 'morgan';
import Constants from '../Constants';

const myFormat = format.printf((info) => `[${info.timestamp}][${info.level}] ${info.message}`);

const appLogger: Logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.splat(),
    format.simple(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    myFormat,
  ),
  level: Constants.LOG_LEVEL,
  transports: [
    new transports.Console(),
  ],
});

const stream: StreamOptions = {
  write: (message) => appLogger.http(message),
};

// Skip all the Morgan http log if the
// application is not running in development mode.
// This method is not really needed here since
// we already told to the logger that it should print
// only warning and error messages in production.
const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

const mLogger = morgan(
  // Define message format string (this is the default one).
  // The message format is made from tokens, and each token is
  // defined inside the Morgan library.
  // You can create your custom token to show what do you want from a request.
  ':method :url :status :res[content-length] - :response-time ms',
  // Options: in this case, I overwrote the stream and the skip logic.
  // See the methods above.
  { stream, skip },
);

export const logger = appLogger;
export const morganLogger = mLogger;
