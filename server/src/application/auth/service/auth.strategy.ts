import { UserTokenDto } from '@interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req.cookies[configService.get<string>('jwt.cookieHeader')]; // 쿠키에서 설정된 헤더로 토큰을 추출
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secretKey'),
    });
  }

  async validate(payload: { userId: number; urlId: number }) {
    return new UserTokenDto(payload.userId, payload.urlId);
  }
}
