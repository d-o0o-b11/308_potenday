import {
  CountUsersInRoomQuery,
  CountUsersInRoomQueryHandler,
  FindOneUserUrlDto,
} from '@application';
import { URL_SERVICE_TOKEN } from '@infrastructure';
import { IUrlService } from '@interface';
import { Test, TestingModule } from '@nestjs/testing';

describe('CountUsersInRoomQueryHandler', () => {
  let handler: CountUsersInRoomQueryHandler;
  let urlService: IUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountUsersInRoomQueryHandler,
        {
          provide: URL_SERVICE_TOKEN,
          useValue: {
            checkUserLimitForUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CountUsersInRoomQueryHandler>(
      CountUsersInRoomQueryHandler,
    );
    urlService = module.get<IUrlService>(URL_SERVICE_TOKEN);
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(urlService).toBeDefined();
  });

  describe('execute', () => {
    const query = new CountUsersInRoomQuery(111);

    it('해당 url에 존재하는 유저 정보, 인원 수를 반환합니다.', async () => {
      const checkUserLimitForUrl = jest
        .spyOn(urlService, 'checkUserLimitForUrl')
        .mockResolvedValue({
          userInfo: [
            {
              getUserId: () => 11,
              getImgId: () => 1,
              getName: () => 'd_o0o_b',
            },
          ],
        } as any);

      await handler.execute(query);

      expect(checkUserLimitForUrl).toBeCalledTimes(1);
      expect(checkUserLimitForUrl).toBeCalledWith(
        new FindOneUserUrlDto(query.urlId),
      );
    });
  });
});
