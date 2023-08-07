import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserUrlService } from './user-url.service';
import { CreateUserUrlDto } from './dto/create-user-url.dto';
import { UpdateUserUrlDto } from './dto/update-user-url.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('URL 생성, 입장 API')
@Controller('user-url')
export class UserUrlController {
  constructor(private readonly userUrlService: UserUrlService) {}

  @Get()
  async getRandomUrl() {
    return 'gd';
  }
}
