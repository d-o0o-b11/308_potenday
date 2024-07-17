import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dataBaseConfig, readDataBaseConfig } from './validation';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`envs/${process.env.NODE_ENV}.env`],
      load: [dataBaseConfig, readDataBaseConfig],
      isGlobal: true,
    }),
  ],
})
export class SettingModule {}
