import 'reflect-metadata';
import { DataSource } from 'typeorm';
import Constants from './Constants';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: Constants.DATABASE_NAME,
  synchronize: true,
  logging: false,
  entities: [`${__dirname}/Entities/index{.ts,.js}`],
  migrations: [],
  subscribers: [],
});
