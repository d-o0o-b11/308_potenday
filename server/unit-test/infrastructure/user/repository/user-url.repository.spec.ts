import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { UrlFactory } from '@domain';
import { DeleteUrlException, UpdateUrlException } from '@common';
import {
  CreateUserUrlDto,
  UpdateUserUrlDto,
  ReconstituteFactoryDto,
} from '@application';
import { MockEntityManager } from '@mock';
import {
  UserUrlEntity,
  UserUrlMapper,
  UserUrlRepository,
} from '@infrastructure';

describe('UserUrlRepository', () => {
  let repository: UserUrlRepository;
  let manager: EntityManager;
  let urlFactory: UrlFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserUrlRepository,
        {
          provide: UrlFactory,
          useValue: {
            reconstitute: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<UserUrlRepository>(UserUrlRepository);
    manager = MockEntityManager();
    urlFactory = module.get<UrlFactory>(UrlFactory);
  });

  it('IsDefined', () => {
    expect(repository).toBeDefined();
    expect(urlFactory).toBeDefined();
  });

  describe('save', () => {
    const dto = new CreateUserUrlDto('http://naver.com');

    const mockUserUrlEntity = {
      id: 1,
      url: 'http://naver.com',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    it('url을 저장합니다.', async () => {
      const save = jest
        .spyOn(manager, 'save')
        .mockResolvedValue(mockUserUrlEntity);
      const reconstitute = jest.spyOn(urlFactory, 'reconstitute');

      await repository.save(dto, manager);

      expect(save).toBeCalledTimes(1);
      expect(save).toHaveBeenCalledWith(UserUrlMapper.toEntity(dto.url));
      expect(reconstitute).toBeCalledTimes(1);
      expect(reconstitute).toHaveBeenCalledWith(
        new ReconstituteFactoryDto(
          mockUserUrlEntity.id,
          mockUserUrlEntity.url,
          mockUserUrlEntity.status,
          mockUserUrlEntity.createdAt,
          mockUserUrlEntity.updatedAt,
          mockUserUrlEntity.deletedAt,
        ),
      );
    });
  });

  describe('update', () => {
    const urlId = 1;
    const dto = new UpdateUserUrlDto(false);

    it('url의 상태를 업데이트합니다.', async () => {
      const update = jest
        .spyOn(manager, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      await repository.update(urlId, dto, manager);

      expect(update).toBeCalledTimes(1);
      expect(update).toHaveBeenCalledWith(UserUrlEntity, urlId, {
        status: dto.status,
      });
    });

    it('url의 상태를 업데이트 실패 시 오류를 반환합니다.', async () => {
      const update = jest
        .spyOn(manager, 'update')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(repository.update(urlId, dto, manager)).rejects.toThrowError(
        new UpdateUrlException(),
      );

      expect(update).toBeCalledTimes(1);
      expect(update).toHaveBeenCalledWith(UserUrlEntity, urlId, {
        status: dto.status,
      });
    });
  });

  describe('delete', () => {
    const urlId = 1;

    it('url을 삭제합니다.', async () => {
      const delete2 = jest
        .spyOn(manager, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await repository.delete(urlId, manager);

      expect(delete2).toBeCalledTimes(1);
      expect(delete2).toHaveBeenCalledWith(UserUrlEntity, urlId);
    });

    it('url 삭제 실패 시 오류를 반환합니다.', async () => {
      const delete2 = jest
        .spyOn(manager, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(repository.delete(urlId, manager)).rejects.toThrowError(
        new DeleteUrlException(),
      );

      expect(delete2).toBeCalledTimes(1);
      expect(delete2).toHaveBeenCalledWith(UserUrlEntity, urlId);
    });
  });
});
