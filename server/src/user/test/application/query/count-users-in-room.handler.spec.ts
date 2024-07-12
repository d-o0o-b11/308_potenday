import { Test, TestingModule } from '@nestjs/testing';
import { CountUsersInRoomQueryHandler } from '../../../application';
import {
  IUserUrlService,
  CountUsersInRoomResponseDto,
} from '../../../interface';
import { CountUsersInRoomQuery } from '../../../application/query/count-users-in-room.query';
import { USER_URL_SERVICE_TOKEN } from '../../../infrastructure';

describe('CountUsersInRoomQueryHandler', () => {
  let handler: CountUsersInRoomQueryHandler;
  let urlService: IUserUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountUsersInRoomQueryHandler,
        {
          provide: USER_URL_SERVICE_TOKEN,
          useValue: {
            countUsersInRoom: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CountUsersInRoomQueryHandler>(
      CountUsersInRoomQueryHandler,
    );
    urlService = module.get<IUserUrlService>(USER_URL_SERVICE_TOKEN);
  });

  describe('execute', () => {
    const CountUsersInRoomResponseDto = [
      {
        id: 1,
        imgId: 1,
        nickName: 'TEST1',
        urlId: 1,
      } as any,
      {
        id: 2,
        imgId: 2,
        nickName: 'TEST2',
        urlId: 1,
      } as any,
      {
        id: 3,
        imgId: 3,
        nickName: 'TEST3',
        urlId: 1,
      } as any,
      {
        id: 4,
        imgId: 4,
        nickName: 'TEST4',
        urlId: 1,
      } as any,
    ];

    it('해당 url에 존재하는 유저 수/ 유저 정보를 반환해야 합니다.', async () => {
      const query: CountUsersInRoomQuery = new CountUsersInRoomQuery(1);

      const countUsersInRoom = jest
        .spyOn(urlService, 'countUsersInRoom')
        .mockResolvedValue({
          userCount: CountUsersInRoomResponseDto.length,
          userInfo: CountUsersInRoomResponseDto,
        });
      const result: CountUsersInRoomResponseDto = await handler.execute(query);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        userCount: CountUsersInRoomResponseDto.length,
        userInfo: CountUsersInRoomResponseDto,
      });
      expect(countUsersInRoom).toHaveBeenCalledWith(query.urlId);
    });
  });
});
