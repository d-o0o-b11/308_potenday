import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserCommand, CreateUserHandler } from '@application';
import { IUserRepository } from '@domain';
import { IUrlService, UserResponseDto } from '@interface';
import { USER_REPOSITORY_TOKEN, USER_URL_SERVICE_TOKEN } from '@infrastructure';

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;
  let userRepository: IUserRepository;
  let urlService: IUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: USER_URL_SERVICE_TOKEN,
          useValue: {
            checkUserLimitForUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateUserHandler>(CreateUserHandler);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY_TOKEN);
    urlService = module.get<IUrlService>(USER_URL_SERVICE_TOKEN);
  });

  describe('execute', () => {
    const command = new CreateUserCommand(1, 1, 'testUser');
    const userResponse: UserResponseDto = {
      id: 1,
      imgId: 1,
      nickName: 'testUser',
      urlId: 1,
    };

    it('유저 객체를 생성하고 UserResponseDto를 반환해야 합니다', async () => {
      const checkUserLimitForUrl = jest.spyOn(
        urlService,
        'checkUserLimitForUrl',
      );

      const save = jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue(userResponse);

      const result = await handler.execute(command);

      expect(checkUserLimitForUrl).toHaveBeenCalledWith({ urlId: 1 });
      expect(save).toHaveBeenCalledWith({
        urlId: command.urlId,
        imgId: command.imgId,
        nickName: command.nickName,
      });
      expect(result).toEqual(userResponse);
    });

    it('유저 생성 시 사용자 제한 초과 검사를 실행해야 합니다', async () => {
      const checkUserLimitForUrl = jest
        .spyOn(urlService, 'checkUserLimitForUrl')
        .mockRejectedValue(new Error('4명 초과'));

      const save = jest.spyOn(userRepository, 'save');

      await expect(handler.execute(command)).rejects.toThrow('4명 초과');

      expect(checkUserLimitForUrl).toHaveBeenCalledWith({
        urlId: 1,
      });
      expect(save).toHaveBeenCalledTimes(0);
    });
  });
});
