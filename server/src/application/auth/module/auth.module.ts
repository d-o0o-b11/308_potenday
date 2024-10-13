import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService, JwtStrategy } from '../service';
import { PassportModule } from '@nestjs/passport';
import { GenerateTokenCommandHandler } from '../command';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_SECRET_KEY_EXPIRE },
    }),
    // JwtModule.register({
    //   privateKey: 'privateKey', // 비대칭키 사용 시 개인키
    //   publicKey: 'publicKey', // 비대칭키 사용 시 공개키
    //   signOptions: {
    //     expiresIn: '1h',
    //     algorithm: 'RS256', // 비대칭 알고리즘
    //   },
    // }),
    /**
     *  JwtModule.registerAsync({
      imports: [ConfigModule], // ConfigModule에서 설정값 불러옴
      useFactory: async (configService: ConfigService) => ({
        privateKey: configService.get<string>('JWT_PRIVATE_KEY'),  // 환경변수에서 개인키 설정
        publicKey: configService.get<string>('JWT_PUBLIC_KEY'),    // 환경변수에서 공개키 설정
        signOptions: {
          expiresIn: '1h',
          algorithm: 'RS256',  // 비대칭 알고리즘 
        },
      }),
      inject: [ConfigService],
    }),
     */
  ],
  providers: [AuthService, JwtStrategy, GenerateTokenCommandHandler],
  exports: [AuthService],
})
export class AuthModule {}
