import { SeederOptions } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';
import config from './database.config';

export const AppReadDataSource: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  name: 'read',
  host: config.db.readHost,
  port: Number(config.db.readPort),
  username: config.db.readUsername,
  password: config.db.readPassword,
  database: config.db.readDatabase,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: false, //config.env === 'test' ? true : false
  logging: config.env === 'test' ? false : false,
  migrations: [__dirname + '/../../**/**/**/**/read/*.entity{.ts,.js}'], // migration 수행할 파일
  migrationsTableName: 'migrations', // migration 내용이 기록될 테이블명(default = migration)
  seeds: [__dirname + '/../seeder/*{.ts,.js}'],
};

export const readDataSource = new DataSource(AppReadDataSource);
