import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import databaseConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataBaseConfig } from './validation';
import { AppDataSource } from '../database';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`envs/${process.env.NODE_ENV}.env`],
      load: [dataBaseConfig],
      isGlobal: true,
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     ...configService.get('postgres'),
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
})
export class SettingModule {}
