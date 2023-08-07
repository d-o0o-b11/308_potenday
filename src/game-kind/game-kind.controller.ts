import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GameKindService } from './game-kind.service';
import { CreateGameKindDto } from './dto/create-game-kind.dto';
import { UpdateGameKindDto } from './dto/update-game-kind.dto';

@Controller('game-kind')
export class GameKindController {
  constructor(private readonly gameKindService: GameKindService) {}

  @Post()
  create(@Body() createGameKindDto: CreateGameKindDto) {
    return this.gameKindService.create(createGameKindDto);
  }

  @Get()
  findAll() {
    return this.gameKindService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameKindService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameKindDto: UpdateGameKindDto) {
    return this.gameKindService.update(+id, updateGameKindDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameKindService.remove(+id);
  }
}
