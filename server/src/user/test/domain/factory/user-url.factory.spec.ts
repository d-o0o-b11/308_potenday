import { Test, TestingModule } from '@nestjs/testing';
import { UserUrl, UserUrlFactory } from '../../../domain';
import {
  ReconstituteFactoryDto,
  ReconstituteWithUserFactoryDto,
} from '../../../interface';

describe('UserUrlFactory', () => {
  let factory: UserUrlFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserUrlFactory],
    }).compile();

    factory = module.get<UserUrlFactory>(UserUrlFactory);
  });

  describe('reconstitute', () => {
    it('사용자가 없는 UserUrl 엔티티를 생성해야 한다', () => {
      const dto: ReconstituteFactoryDto = {
        id: 1,
        url: 'http://example.com',
        status: true,
      };

      const userUrl = factory.reconstitute(dto);

      expect(userUrl).toBeInstanceOf(UserUrl);
      expect(userUrl.getId()).toBe(dto.id);
      expect(userUrl.getUrl()).toBe(dto.url);
      expect(userUrl.getStatus()).toBe(dto.status);
      expect(userUrl.getUserList()).toBeUndefined();
    });
  });

  describe('reconstituteWithUser', () => {
    it('사용자가 있는 UserUrl 엔티티를 생성해야 한다', () => {
      const dto: ReconstituteWithUserFactoryDto = {
        id: 1,
        url: 'http://example.com',
        status: true,
        users: [
          { id: 1, imgId: 1, nickName: 'user1', urlId: 1 },
          { id: 2, imgId: 2, nickName: 'user2', urlId: 1 },
        ] as any,
      };

      const userUrl = factory.reconstituteWithUser(dto);

      expect(userUrl).toBeInstanceOf(UserUrl);
      expect(userUrl.getId()).toBe(dto.id);
      expect(userUrl.getUrl()).toBe(dto.url);
      expect(userUrl.getStatus()).toBe(dto.status);
      expect(userUrl.getUserList()).toEqual(dto.users);
    });
  });
});
