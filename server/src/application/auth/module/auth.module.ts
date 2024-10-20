import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard, JwtStrategy } from '../service';
import { PassportModule } from '@nestjs/passport';
import { GenerateTokenCommandHandler } from '../command';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secretKey'),
        signOptions: {
          expiresIn: configService.get('jwt.secretKeyExpire'),
        },
      }),
    }),
  ],
  providers: [JwtAuthGuard, JwtStrategy, GenerateTokenCommandHandler],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
