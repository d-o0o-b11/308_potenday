import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserUrlService } from './user-url.service';
import { CreateUserUrlDto } from './dto/create-user-url.dto';
import { UpdateUserUrlDto } from './dto/update-user-url.dto';

@Controller('user-url')
export class UserUrlController {
  constructor(private readonly userUrlService: UserUrlService) {}

  @Post()
  create(@Body() createUserUrlDto: CreateUserUrlDto) {
    return this.userUrlService.create(createUserUrlDto);
  }

  @Get()
  findAll() {
    return this.userUrlService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userUrlService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserUrlDto: UpdateUserUrlDto) {
    return this.userUrlService.update(+id, updateUserUrlDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userUrlService.remove(+id);
  }
}
