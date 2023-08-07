import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import tokenConfig from './config/token.config';
import swaggerConfig from './config/swagger.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `src/envs/${
          process.env.NODE_ENV == 'dev' ? 'development' : 'production'
        }.env`,
      ],
      load: [databaseConfig, tokenConfig, swaggerConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('postgres'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class SettingModule {}
