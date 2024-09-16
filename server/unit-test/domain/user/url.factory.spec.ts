import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateUserUrlReadDto,
  ReconstituteFactoryDto,
  ReconstituteFindFactoryDto,
} from '@application';
import { Url, UrlFactory, UrlRead } from '@domain';

describe('UrlFactory', () => {
  let factory: UrlFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlFactory],
    }).compile();

    factory = module.get<UrlFactory>(UrlFactory);
  });

  it('IsDefined', () => {
    expect(factory).toBeDefined();
  });

  describe('reconstitute', () => {
    it('Url 객체를 반환합니다.', () => {
      const raw: ReconstituteFactoryDto = {
        id: 1,
        url: 'https://naver.com',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const result = factory.reconstitute(raw);

      expect(result).toBeInstanceOf(Url);
      expect(result.getId()).toBe(raw.id);
      expect(result.getUrl()).toBe(raw.url);
      expect(result.getStatus()).toBe(raw.status);
      expect(result.getCreatedAt()).toBe(raw.createdAt);
      expect(result.getUpdatedAt()).toBe(raw.updatedAt);
      expect(result.getDeletedAt()).toBe(raw.deletedAt);
    });
  });

  describe('reconstituteRead', () => {
    it('UrlRead 객체를 반환합니다.', () => {
      const dto: CreateUserUrlReadDto = {
        urlId: 1,
        url: 'https://naver.com',
        status: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const result = factory.reconstituteRead(dto);

      expect(result).toBeInstanceOf(UrlRead);
      expect(result.getUrlId()).toBe(dto.urlId);
      expect(result.getUrl()).toBe(dto.url);
      expect(result.getStatus()).toBe(dto.status);
      expect(result.getCreatedAt()).toBe(dto.createdAt);
      expect(result.getUpdatedAt()).toBe(dto.updatedAt);
      expect(result.getDeletedAt()).toBe(dto.deletedAt);
    });
  });

  describe('reconstituteFind', () => {
    it('UrlRead 객체를 반환합니다. (with userIdList)', () => {
      const raw: ReconstituteFindFactoryDto = {
        urlId: 1,
        url: 'https://naver.com',
        status: false,
        userIdList: [1, 2, 3],
      };

      const result = factory.reconstituteFind(raw);

      expect(result).toBeInstanceOf(UrlRead);
      expect(result.getUrlId()).toBe(raw.urlId);
      expect(result.getUrl()).toBe(raw.url);
      expect(result.getStatus()).toBe(raw.status);
      expect(result.getUserIdList()).toEqual(raw.userIdList);
    });
  });
});
