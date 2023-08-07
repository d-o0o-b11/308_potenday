import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserUrlEntity } from './user-url/entities/user-url.entity';
import { UserInfoEntity } from './user-url/entities/user-info.entity';
import { AdjectiveExpressionEntity } from './game-kind/entities/adjective-expression.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserUrlEntity,
      UserInfoEntity,
      AdjectiveExpressionEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class EntitiesModule {}
