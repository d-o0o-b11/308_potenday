import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './config';

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource)],
})
export class DataBaseModule {}
