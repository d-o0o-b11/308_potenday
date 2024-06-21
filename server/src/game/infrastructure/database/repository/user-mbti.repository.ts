import { Injectable } from '@nestjs/common';
import { UserMbtiEntity } from '../entity';
import { EntityManager, Repository } from 'typeorm';
import { UserMbtiMapper } from '../mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveUserMbtiDto, UserMbtiRawDto } from '../../../interface';
import { IUserMbtiRepository, UserMbtiFactory } from '../../../domain';

@Injectable()
export class UserMbtiRepository implements IUserMbtiRepository {
  constructor(
    private manager: EntityManager,
    @InjectRepository(UserMbtiEntity)
    private readonly userMbtiRepository: Repository<UserMbtiEntity>,
    private readonly userMbtiFactory: UserMbtiFactory,
  ) {}

  //유저 추측하기
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

  async find(toUserId: number) {
    const findResult = await this.userMbtiRepository.find({
      where: {
        toUserId: toUserId,
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

  async findUserMbtiAnswer(toUserId: number) {
    const userMbtis = await this.find(toUserId);

    let answerUser = null;
    const guessingUsers = [];

    userMbtis.forEach((userMbti) => {
      if (userMbti.getUserId() === toUserId) {
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

  async findUserMbtiByUrlId(urlId: number) {
    const userMbtis: UserMbtiRawDto[] = await this.userMbtiRepository
      .createQueryBuilder('userMbti')
      .innerJoinAndSelect('userMbti.user', 'user')
      .where('user.urlId = :urlId', { urlId })
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
