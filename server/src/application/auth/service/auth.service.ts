import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: { userId: number; urlId: number }): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }
}

/**
 * 서비스 코드 지우고 그냥,,,commandBus 이용해서 토큰 발급 시 쿠키 set해주는걸로 하자!
 * verifyToken 이거는 그냥 strategy 로직에 넣어버리자!
 */
