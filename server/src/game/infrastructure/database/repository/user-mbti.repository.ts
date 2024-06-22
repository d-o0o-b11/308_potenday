import { Injectable } from '@nestjs/common';
import { UserMbtiEntity } from '../entity';
import { EntityManager, Repository } from 'typeorm';
import { UserMbtiMapper } from '../mapper';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindUserMbtiByUrlIdDto,
  FindUserMbtiDto,
  SaveUserMbtiDto,
  UserMbtiRawDto,
} from '../../../interface';
import {
  IUserMbtiRepository,
  UserMbti,
  UserMbtiFactory,
} from '../../../domain';

@Injectable()
export class UserMbtiRepository implements IUserMbtiRepository {
  constructor(
    private manager: EntityManager,
    @InjectRepository(UserMbtiEntity)
    private readonly userMbtiRepository: Repository<UserMbtiEntity>,
    private readonly userMbtiFactory: UserMbtiFactory,
  ) {}

  async save(dto: SaveUserMbtiDto) {
    return await this.manager.transaction(async (manager) => {
      const entity = UserMbtiMapper.toEntity(
        dto.userId,
        dto.mbti,
        dto.toUserId,
      );

      manager.save(UserMbtiEntity, entity);
    });
  }

  async find(dto: FindUserMbtiDto) {
    const findResult = await this.userMbtiRepository.find({
      where: {
        toUserId: dto.toUserId,
      },
      relations: {
        user: true,
      },
      select: {
        userId: true,
        mbti: true,
        toUserId: true,
        user: {
          nickName: true,
          imgId: true,
        },
      },
    });

    const userMbtis = findResult.map((mbti) =>
      this.userMbtiFactory.reconstituteArray(
        mbti.userId,
        mbti.mbti,
        mbti.user.nickName,
        mbti.user.imgId,
        mbti.toUserId,
      ),
    );

    return userMbtis;
  }

  async findUserMbtiAnswer(dto: FindUserMbtiDto) {
    const userMbtis = await this.find({ toUserId: dto.toUserId });

    let answerUser: UserMbti | null = null;
    const guessingUsers: UserMbti[] = [];

    userMbtis.forEach((userMbti) => {
      if (userMbti.getUserId() === dto.toUserId) {
        answerUser = userMbti;
      } else {
        guessingUsers.push(userMbti);
      }
    });

    return {
      answerUser: answerUser,
      guessingUsers: guessingUsers,
    };
  }

  async findUserMbtiByUrlId(dto: FindUserMbtiByUrlIdDto) {
    const userMbtis: UserMbtiRawDto[] = await this.userMbtiRepository
      .createQueryBuilder('userMbti')
      .innerJoinAndSelect('userMbti.user', 'user')
      .where('user.urlId = :urlId', { urlId: dto.urlId })
      .andWhere('userMbti.userId = userMbti.toUserId')
      .select([
        'user.id AS "userId"',
        'userMbti.mbti AS "mbti"',
        'user.nickName AS "nickName"',
        'user.imgId AS "imgId"',
      ])
      .getRawMany();

    return this.userMbtiFactory.reconstituteArrayFromRaw(userMbtis);
  }
}
