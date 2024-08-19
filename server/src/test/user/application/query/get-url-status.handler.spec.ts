import { Test, TestingModule } from '@nestjs/testing';
import { GetUrlStatusHandler, GetUrlStatusQuery } from '@application';
import { IUrlRepository } from '@domain';
import { USER_URL_REPOSITORY_TOKEN } from '@infrastructure';
import { GetUrlStatusResponseDto } from '@interface';

describe('GetUrlStatusHandler', () => {
  let handler: GetUrlStatusHandler;
  let userUrlRepository: IUrlRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUrlStatusHandler,
        {
          provide: USER_URL_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetUrlStatusHandler>(GetUrlStatusHandler);
    userUrlRepository = module.get<IUrlRepository>(USER_URL_REPOSITORY_TOKEN);
  });

  it('해당 url의 상태를 반환해야합니다.', async () => {
    const urlId = 1;
    const expectedResult: GetUrlStatusResponseDto = {
      status: true,
    };

    const findOne = jest.spyOn(userUrlRepository, 'findOne').mockResolvedValue({
      getStatus: () => expectedResult.status,
    } as any);

    const result = await handler.execute(new GetUrlStatusQuery(urlId));

    expect(result).toStrictEqual(expectedResult);
    expect(findOne).toHaveBeenCalledTimes(1);
    expect(findOne).toHaveBeenCalledWith({ urlId });
  });
});
