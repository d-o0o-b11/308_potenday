import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserUrlEntity } from './user-url/entities/user-url.entity';
import { UserInfoEntity } from './user-url/entities/user-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserUrlEntity, UserInfoEntity])],
  exports: [TypeOrmModule],
})
export class EntitiesModule {}
