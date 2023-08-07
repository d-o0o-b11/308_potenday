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

@Controller('user-url')
export class UserUrlController {
  constructor(private readonly userUrlService: UserUrlService) {}
}
