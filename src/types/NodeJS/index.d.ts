declare namespace NodeJS {
  interface ProcessEnv {
    LOG_LEVEL: string;
    NODE_ENV: string
    PORT: string;
    DATABASE_NAME: string;
    ALLDEBRID_API_KEY: string;
  }
}
