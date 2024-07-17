import { SeederOptions } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';
import readConfig from './database-read.config';

export const AppReadDataSource: DataSourceOptions & SeederOptions = {
  name: 'read',
  type: 'postgres',
  host: readConfig.db.host,
  port: Number(readConfig.db.port),
  username: readConfig.db.username,
  password: readConfig.db.password,
  database: readConfig.db.database,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: readConfig.env === 'test' ? false : false,
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  seeds: [__dirname + '/../seeder/*{.ts,.js}'],
};

export default new DataSource(AppReadDataSource);
