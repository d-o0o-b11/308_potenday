import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TestJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('토큰이 제공되지 않았습니다.');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      request.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }

  private extractTokenFromCookie(request): string | null {
    const cookie = request.cookies['test_token'];
    return cookie || null;
  }
}
