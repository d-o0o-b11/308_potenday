import config from './database.config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const AppDataSource: DataSourceOptions = {
  type: 'postgres',
  host: config.db.host,
  port: Number(config.db.port),
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: true, //config.env === 'test' ? true : false
  logging: config.env === 'test' ? false : false,
  migrations: [__dirname + '/../migrations/*{.ts,.js}'], // migration 수행할 파일
  migrationsTableName: 'migrations', // migration 내용이 기록될 테이블명(default = migration)
};

export default new DataSource(AppDataSource);
