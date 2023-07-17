export default class Constants {
  public static PORT: number = parseInt(process.env.PORT, 10) || 3000;

  public static LOG_LEVEL: string = process.env.LOG_LEVEL || 'debug';

  public static NODE_ENV: string = process.env.NODE_ENV || 'DEVELOPMENT';

  public static DATABASE_NAME: string = process.env.DATABASE_NAME || 'alldebrid-client.db';

  public static ALLDEBRID_API_KEY: string = process.env.ALLDEBRID_API_KEY || 'toChange';
}
