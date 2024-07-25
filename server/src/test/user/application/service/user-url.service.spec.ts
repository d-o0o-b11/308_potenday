import { Test, TestingModule } from '@nestjs/testing';
import { UserUrlService } from '@application';
import { IUserUrlRepository } from '@domain';
import { USER_URL_REPOSITORY_TOKEN } from '@infrastructure';
import * as crypto from 'crypto';
import { FindOneUserUrlDto } from '@interface';
import {
  UrlAlreadyClickButtonException,
  UrlMaximumUserAlreadyClickButtonException,
  UrlNotFoundException,
  UrlStatusFalseException,
} from '@common';

describe('UserUrlService', () => {
  let service: UserUrlService;
  let urlRepository: IUserUrlRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserUrlService,
        {
          provide: USER_URL_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            findOneWithUser: jest.fn(),
            findOneWithUrl: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserUrlService>(UserUrlService);
    urlRepository = module.get<IUserUrlRepository>(USER_URL_REPOSITORY_TOKEN);
  });

  describe('setUrl', () => {
    it('새로운 URL을 생성하고 저장해야 한다.', async () => {
      const mockUrl = 'http://example.com' as any;
      const mockSaveResult = {
        getId: jest.fn().mockReturnValue(1),
        getUrl: jest.fn().mockReturnValue(mockUrl),
      } as any;

      jest.spyOn(crypto, 'randomBytes').mockReturnValue(mockUrl);

      const findOneWithUrl = jest
        .spyOn(urlRepository, 'findOneWithUrl')
        .mockResolvedValue(null);

      const save = jest
        .spyOn(urlRepository, 'save')
        .mockResolvedValue(mockSaveResult);

      const result = await service.setUrl();

      expect(result).toEqual({ id: 1, url: mockUrl });
      expect(findOneWithUrl).toHaveBeenCalledWith({ url: mockUrl });
      expect(save).toHaveBeenCalledWith({ url: mockUrl });
    });

    it('중복된 URL이 있는 경우 새로운 URL을 생성해야 한다.', async () => {
      const mockUrl1 = 'http://example.com' as any;
      const mockUrl2 = 'http://example2.com' as any;
      const mockSaveResult = {
        getId: jest.fn().mockReturnValue(1),
        getUrl: jest.fn().mockReturnValue(mockUrl2),
      } as any;

      jest
        .spyOn(crypto, 'randomBytes')
        .mockReturnValueOnce(mockUrl1)
        .mockReturnValueOnce(mockUrl2);

      const findOneWithUrl = jest
        .spyOn(urlRepository, 'findOneWithUrl')
        .mockResolvedValueOnce({} as any)
        .mockResolvedValueOnce(null);

      const save = jest
        .spyOn(urlRepository, 'save')
        .mockResolvedValue(mockSaveResult);

      const result = await service.setUrl();

      expect(result).toEqual({ id: 1, url: mockUrl2 });
      expect(findOneWithUrl).toHaveBeenCalledTimes(2);
      expect(save).toHaveBeenCalledWith({ url: mockUrl2 });
    });
  });

  describe('checkUserLimitForUrl', () => {
    it('URL을 찾지 못하면 UrlNotFoundException을 반환해야 한다.', async () => {
      const dto: FindOneUserUrlDto = { urlId: 1 };

      const findOne = jest
        .spyOn(urlRepository, 'findOne')
        .mockResolvedValue(null);

      await expect(service.checkUserLimitForUrl(dto)).rejects.toThrow(
        UrlNotFoundException,
      );

      expect(findOne).toHaveBeenCalledWith({
        urlId: dto.urlId,
      });
    });

    it('URL 상태가 false면 UrlStatusFalseException을 반환해야 한다.', async () => {
      const dto: FindOneUserUrlDto = { urlId: 1 };
      const mockFindResult = {
        getStatus: jest.fn().mockReturnValue(false),
        getId: jest.fn(),
      } as any;

      const findOne = jest
        .spyOn(urlRepository, 'findOne')
        .mockResolvedValue(mockFindResult);

      await expect(service.checkUserLimitForUrl(dto)).rejects.toThrow(
        UrlStatusFalseException,
      );

      expect(findOne).toHaveBeenCalledWith({
        urlId: dto.urlId,
      });
    });

    it('사용자가 4명 이상이면 UrlMaximumUserAlreadyClickButtonException을 반환해야 한다.', async () => {
      const dto: FindOneUserUrlDto = { urlId: 1 };
      const mockFindResult = {
        getStatus: jest.fn().mockReturnValue(true),
        getId: jest.fn().mockReturnValue(1),
      } as any;

      const findOne = jest
        .spyOn(urlRepository, 'findOne')
        .mockResolvedValue(mockFindResult);

      const countUsersInRoom = jest
        .spyOn(service, 'countUsersInRoom')
        .mockResolvedValue({ userCount: 4 } as any);

      await expect(service.checkUserLimitForUrl(dto)).rejects.toThrow(
        UrlMaximumUserAlreadyClickButtonException,
      );

      expect(findOne).toHaveBeenCalledWith({
        urlId: dto.urlId,
      });
      expect(countUsersInRoom).toHaveBeenCalledWith(dto.urlId);
    });

    it('모든 조건을 통과하면 URL ID를 반환해야 한다.', async () => {
      const dto: FindOneUserUrlDto = { urlId: 1 };
      const mockFindResult = {
        getStatus: jest.fn().mockReturnValue(true),
        getId: jest.fn().mockReturnValue(1),
      } as any;

      const findOne = jest
        .spyOn(urlRepository, 'findOne')
        .mockResolvedValue(mockFindResult);

      const countUsersInRoom = jest
        .spyOn(service, 'countUsersInRoom')
        .mockResolvedValue({ userCount: 3 } as any);

      const result = await service.checkUserLimitForUrl(dto);

      expect(findOne).toHaveBeenCalledWith({
        urlId: dto.urlId,
      });
      expect(countUsersInRoom).toHaveBeenCalledWith(dto.urlId);
      expect(result).toBe(1);
    });
  });

  describe('countUsersInRoom', () => {
    it('유저 목록이 없으면 유저 수 0과 빈 배열을 반환해야 한다.', async () => {
      const urlId = 1;
      const mockFindResult = {
        getUserList: jest.fn().mockReturnValue(null),
      } as any;

      const findOneWithUser = jest
        .spyOn(urlRepository, 'findOneWithUser')
        .mockResolvedValue(mockFindResult);

      const result = await service.countUsersInRoom(urlId);

      expect(result).toEqual({ userCount: 0, userInfo: [] });
      expect(findOneWithUser).toHaveBeenCalledWith({ urlId });
    });

    it('유저 목록이 있으면 유저 수와 유저 정보를 반환해야 한다.', async () => {
      const urlId = 1;
      const mockUserList = [{ id: 1 }, { id: 2 }];
      const mockFindResult = {
        getUserList: jest.fn().mockReturnValue(mockUserList),
      } as any;

      const findOneWithUser = jest
        .spyOn(urlRepository, 'findOneWithUser')
        .mockResolvedValue(mockFindResult);

      const result = await service.countUsersInRoom(urlId);

      expect(result).toEqual({
        userCount: mockUserList.length,
        userInfo: mockUserList,
      });
      expect(findOneWithUser).toHaveBeenCalledWith({ urlId });
    });
  });

  describe('updateStatusFalse', () => {
    it('URL을 찾지 못하면 UrlNotFoundException을 반환해야 한다.', async () => {
      const urlId = 1;
      const findOne = jest
        .spyOn(urlRepository, 'findOne')
        .mockResolvedValue(null);

      await expect(service.updateStatusFalse(urlId)).rejects.toThrow(
        UrlNotFoundException,
      );

      expect(findOne).toHaveBeenCalledWith({ urlId });
    });

    it('URL 상태가 false면 UrlAlreadyClickButtonException을 반환해야 한다.', async () => {
      const urlId = 1;
      const mockFindResult = {
        getStatus: jest.fn().mockReturnValue(false),
      } as any;

      const findOne = jest
        .spyOn(urlRepository, 'findOne')
        .mockResolvedValue(mockFindResult);

      await expect(service.updateStatusFalse(urlId)).rejects.toThrow(
        UrlAlreadyClickButtonException,
      );

      expect(findOne).toHaveBeenCalledWith({ urlId });
    });

    it('URL 상태를 false로 업데이트 해야 한다.', async () => {
      const urlId = 1;
      const mockFindResult = {
        getStatus: jest.fn().mockReturnValue(true),
        getId: jest.fn().mockReturnValue(1),
      } as any;
      const findOne = jest
        .spyOn(urlRepository, 'findOne')
        .mockResolvedValue(mockFindResult);

      const update = jest.spyOn(urlRepository, 'update');

      await service.updateStatusFalse(urlId);

      expect(update).toHaveBeenCalledWith({ urlId });
      expect(findOne).toHaveBeenCalledWith({ urlId });
    });
  });
});
