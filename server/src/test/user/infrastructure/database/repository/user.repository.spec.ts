import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '@infrastructure';
import { EntityManager } from 'typeorm';
import { UserFactory } from '@domain';
import { CreateUserDto } from '@interface';
import { UserEntity } from '@infrastructure/user/database/entity/cud/user.entity';

describe('UserRepository', () => {
  let repository: UserRepository;
  let manager: EntityManager;
  let userFactory: UserFactory;

  const mockManager = {
    transaction: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: EntityManager,
          useValue: mockManager,
        },
        {
          provide: UserFactory,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    manager = module.get<EntityManager>(EntityManager);
    userFactory = module.get<UserFactory>(UserFactory);
  });

  describe('save', () => {
    const createUserDto: CreateUserDto = {
      imgId: 1,
      urlId: 1,
      nickName: 'testUser',
    };

    const userEntity = {
      id: 1,
      imgId: 1,
      urlId: 1,
      nickName: 'testUser',
    } as any;

    const user = {
      getId: () => 1,
      getImgId: () => 1,
      getNickName: () => 'testUser',
      getUrlId: () => 1,
    } as any;

    it('새로운 사용자를 저장하고 사용자 데이터를 반환해야 합니다', async () => {
      mockManager.transaction.mockImplementation(async (callback) => {
        return await callback(mockManager);
      });

      const save = jest.spyOn(manager, 'save').mockResolvedValue(userEntity);
      const create = jest.spyOn(userFactory, 'create').mockReturnValue(user);

      const result = await repository.save(createUserDto);

      expect(mockManager.transaction).toHaveBeenCalled();
      expect(save).toHaveBeenCalledWith(expect.any(UserEntity));
      expect(create).toHaveBeenCalledWith({
        userId: userEntity.id,
        imgId: userEntity.imgId,
        urlId: userEntity.urlId,
        nickName: userEntity.nickName,
      });

      expect(result).toEqual({
        id: 1,
        imgId: 1,
        nickName: 'testUser',
        urlId: 1,
      });
    });

    it('트랜잭션이 실패하면 오류를 던져야 합니다', async () => {
      mockManager.transaction.mockImplementation(async (callback) => {
        return await callback(mockManager);
      });

      const save = jest
        .spyOn(manager, 'save')
        .mockRejectedValue(new Error('DB Error'));

      await expect(repository.save(createUserDto)).rejects.toThrow('DB Error');

      expect(mockManager.transaction).toHaveBeenCalled();
      expect(save).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});
