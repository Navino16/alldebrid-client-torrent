export default class Constants {
  public static PORT: number = parseInt(process.env.PORT, 10) || 3000;

  public static LOG_LEVEL: string = process.env.LOG_LEVEL || 'debug';

  public static NODE_ENV: string = process.env.NODE_ENV || 'DEVELOPMENT';
}
