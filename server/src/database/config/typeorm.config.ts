import { SeederOptions } from 'typeorm-extension';
import config from './database.config';
import { DataSource, DataSourceOptions } from 'typeorm';
/**
 * @memo
 * cud 폴더 - appDataSource , read 폴더 - readAppDataSource 로 분리하기
 */
export const AppDataSource: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: config.db.host,
  port: Number(config.db.port),
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  entities: [__dirname + '/../../**/**/**/**/cud/*.entity{.ts,.js}'],
  synchronize: false, //config.env === 'test' ? true : false
  logging: config.env === 'test' ? false : false,
  migrations: [__dirname + '/../migrations/cud/*{.ts,.js}'], // migration 수행할 파일
  migrationsTableName: 'migrations', // migration 내용이 기록될 테이블명(default = migration)
  seeds: [__dirname + '/../seeder/*{.ts,.js}'],
};

export const appDataSource = new DataSource(AppDataSource);
