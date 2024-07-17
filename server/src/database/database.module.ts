import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './config';
import { AppReadDataSource } from './read-config';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...AppDataSource }),
    TypeOrmModule.forRoot({ ...AppReadDataSource }),
  ],
})
export class DataBaseModule {}
