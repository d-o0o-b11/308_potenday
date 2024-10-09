import { SaveUserMbtiDto, UserMbtiRawDto } from '@application';
import { DeleteMbtiException } from '@common';
import { MbtiFactory } from '@domain';
import {
  MbtiRepository,
  UserMbtiEntity,
  UserMbtiMapper,
} from '@infrastructure';
import { MockEntityManager } from '@mock';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('MbtiRepository', () => {
  let repository: MbtiRepository;
  let manager: EntityManager;
  let mbtiFactory: MbtiFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MbtiRepository,
        {
          provide: MbtiFactory,
          useValue: {
            reconstitute: jest.fn(),
          },
        },
        {
          provide: getEntityManagerToken(),
          useValue: MockEntityManager(),
        },
      ],
    }).compile();

    repository = module.get<MbtiRepository>(MbtiRepository);
    manager = module.get<EntityManager>(getEntityManagerToken());
    mbtiFactory = module.get<MbtiFactory>(MbtiFactory);
  });

  it('IsDefined', () => {
    expect(repository).toBeDefined();
    expect(manager).toBeDefined();
    expect(mbtiFactory).toBeDefined();
  });

  describe('create', () => {
    const dto: SaveUserMbtiDto = {
      userId: 126,
      mbti: 'ISTJ',
      toUserId: 127,
      urlId: 111,
    };
    const result = {
      id: 1,
      userId: dto.userId,
      mbti: dto.mbti,
      toUserId: dto.toUserId,
    };

    it('MBTI를 저장합니다.', async () => {
      const transaction = jest
        .spyOn(manager, 'transaction')
        .mockImplementation(async (cb: any) => {
          return await cb(manager);
        });
      const save = jest.spyOn(manager, 'save').mockResolvedValue(result);
      const reconstitute = jest.spyOn(mbtiFactory, 'reconstitute');

      await repository.create(dto);

      expect(transaction).toBeCalledTimes(1);
      expect(save).toBeCalledTimes(1);
      expect(save).toBeCalledWith(
        UserMbtiEntity,
        UserMbtiMapper.toEntity(dto.userId, dto.mbti, dto.toUserId),
      );
      expect(reconstitute).toBeCalledTimes(1);
      expect(reconstitute).toBeCalledWith(
        new UserMbtiRawDto(
          result.id,
          result.userId,
          result.mbti,
          result.toUserId,
          null,
          null,
        ),
      );
    });
  });

  describe('delete', () => {
    const id = 111;

    it('MBTI를 삭제합니다.', async () => {
      const softDelete = jest.spyOn(manager, 'softDelete').mockResolvedValue({
        affected: 1,
      } as any);

      await repository.delete(id, manager);

      expect(softDelete).toBeCalledTimes(1);
      expect(softDelete).toBeCalledWith(UserMbtiEntity, id);
    });

    it('MBTI 삭제 시 오류가 발생할 경우 오류를 반환합니다.', async () => {
      const softDelete = jest.spyOn(manager, 'softDelete').mockResolvedValue({
        affected: 0,
      } as any);

      await expect(repository.delete(id, manager)).rejects.toThrowError(
        new DeleteMbtiException(),
      );

      expect(softDelete).toBeCalledTimes(1);
      expect(softDelete).toBeCalledWith(UserMbtiEntity, id);
    });
  });
});
