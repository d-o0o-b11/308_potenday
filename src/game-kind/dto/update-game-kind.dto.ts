import { PartialType } from '@nestjs/swagger';
import { CreateGameKindDto } from './create-game-kind.dto';

export class UpdateGameKindDto extends PartialType(CreateGameKindDto) {}
