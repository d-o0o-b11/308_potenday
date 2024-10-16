import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService, JwtAuthGuard, JwtStrategy } from '../service';
import { PassportModule } from '@nestjs/passport';
import { GenerateTokenCommandHandler } from '../command';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_SECRET_KEY_EXPIRE },
    }),
  ],
  providers: [
    JwtAuthGuard,
    AuthService,
    JwtStrategy,
    GenerateTokenCommandHandler,
  ],
  exports: [AuthService, PassportModule, JwtModule],
})
export class AuthModule {}
