import { DatabaseType } from 'typeorm';

export interface IDataBase {
  type: DatabaseType;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}
