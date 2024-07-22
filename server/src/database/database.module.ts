import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource, AppReadDataSource } from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource),
    TypeOrmModule.forRoot(AppReadDataSource),
  ],
})
export class DataBaseModule {}
