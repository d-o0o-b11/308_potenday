import { Injectable } from '@nestjs/common';
import { CreateGameKindDto } from './dto/create-game-kind.dto';
import { UpdateGameKindDto } from './dto/update-game-kind.dto';

@Injectable()
export class GameKindService {
  create(createGameKindDto: CreateGameKindDto) {
    return 'This action adds a new gameKind';
  }

  findAll() {
    return `This action returns all gameKind`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gameKind`;
  }

  update(id: number, updateGameKindDto: UpdateGameKindDto) {
    return `This action updates a #${id} gameKind`;
  }

  remove(id: number) {
    return `This action removes a #${id} gameKind`;
  }
}
