import { Test, TestingModule } from '@nestjs/testing';
import { GetUsersInRoomQueryHandler } from '../../../application';
import { IUserUrlRepository, User } from '../../../domain';
import { GetUsersInRoomQuery } from '../../../application/query/get-users-in-room.query';
import { USER_URL_REPOSITORY_TOKEN } from '../../../infrastructure';

describe('GetUsersInRoomQueryHandler', () => {
  let handler: GetUsersInRoomQueryHandler;
  let userUrlRepository: IUserUrlRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUsersInRoomQueryHandler,
        {
          provide: USER_URL_REPOSITORY_TOKEN,
          useValue: {
            findOneWithUser: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetUsersInRoomQueryHandler>(
      GetUsersInRoomQueryHandler,
    );
    userUrlRepository = module.get<IUserUrlRepository>(
      USER_URL_REPOSITORY_TOKEN,
    );
  });

  describe('execute', () => {
    it('url에 참여한 유저의 정보를 반환해야 합니다.', async () => {
      const query = new GetUsersInRoomQuery(1, 2);

      const findOneWithUser = jest
        .spyOn(userUrlRepository, 'findOneWithUser')
        .mockResolvedValue({
          getUserList: (): User[] => [
            new User(1, 1, 'User 1', 1),
            new User(2, 2, 'User 2', 1),
            new User(3, 3, 'User 3', 1),
          ],
        } as any);

      const result = await handler.execute(query);

      expect(result).toBeInstanceOf(User);
      expect(result.getId()).toStrictEqual(2);
      expect(findOneWithUser).toHaveBeenCalledWith({
        urlId: 1,
      });
    });
  });
});
