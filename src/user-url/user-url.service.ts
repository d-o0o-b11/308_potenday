import { Injectable } from '@nestjs/common';
import { CreateUserUrlDto } from './dto/create-user-url.dto';
import { UpdateUserUrlDto } from './dto/update-user-url.dto';

@Injectable()
export class UserUrlService {
  create(createUserUrlDto: CreateUserUrlDto) {
    return 'This action adds a new userUrl';
  }

  findAll() {
    return `This action returns all userUrl`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userUrl`;
  }

  update(id: number, updateUserUrlDto: UpdateUserUrlDto) {
    return `This action updates a #${id} userUrl`;
  }

  remove(id: number) {
    return `This action removes a #${id} userUrl`;
  }
}
