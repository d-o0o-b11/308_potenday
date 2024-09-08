import { GetUsersInRoomQuery, GetUsersInRoomQueryHandler } from '@application';
import { URL_SERVICE_TOKEN } from '@infrastructure';
import { IUrlService } from '@interface';
import { Test, TestingModule } from '@nestjs/testing';

describe('GetUsersInRoomQueryHandler', () => {
  let handler: GetUsersInRoomQueryHandler;
  let urlService: IUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUsersInRoomQueryHandler,
        {
          provide: URL_SERVICE_TOKEN,
          useValue: {
            getUserInfoInUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetUsersInRoomQueryHandler>(
      GetUsersInRoomQueryHandler,
    );
    urlService = module.get<IUrlService>(URL_SERVICE_TOKEN);
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(urlService).toBeDefined();
  });

  describe('execute', () => {
    const query = new GetUsersInRoomQuery(111, 2);
    const userList = [
      {
        getUserId: () => 126,
        getImgId: () => 1,
        getNickname: () => 'd_o0o_b',
      },
      {
        getUserId: () => 127,
        getImgId: () => 2,
        getNickname: () => 'd_o0o_b2',
      },
    ] as any;

    it('해당 라운드 순서의 유저 정보를 조회합니다.', async () => {
      const getUserInfoInUrl = jest
        .spyOn(urlService, 'getUserInfoInUrl')
        .mockResolvedValue(userList);

      const result = await handler.execute(query);

      expect(getUserInfoInUrl).toBeCalledTimes(1);
      expect(getUserInfoInUrl).toBeCalledWith(query.urlId);
      expect(result).toStrictEqual({
        userId: userList[query.roundId - 1].getUserId(),
        imgId: userList[query.roundId - 1].getImgId(),
        nickName: userList[query.roundId - 1].getNickname(),
      });
    });
  });
});
