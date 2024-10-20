import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TestTokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(dto: { urlId: number; userId: number }) {
    const payload = {
      urlId: dto.urlId,
      userId: dto.userId,
    };

    return { token: this.jwtService.sign(payload) };
  }
}
