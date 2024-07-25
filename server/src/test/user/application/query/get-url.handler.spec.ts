import { Test, TestingModule } from '@nestjs/testing';
import { GetUrlQueryHandler } from '@application';
import { IUserUrlService, SetUrlResponseDto } from '@interface';
import { USER_URL_SERVICE_TOKEN } from '@infrastructure';

describe('GetUrlQueryHandler', () => {
  let handler: GetUrlQueryHandler;
  let urlService: IUserUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUrlQueryHandler,
        {
          provide: USER_URL_SERVICE_TOKEN,
          useValue: {
            setUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetUrlQueryHandler>(GetUrlQueryHandler);
    urlService = module.get<IUserUrlService>(USER_URL_SERVICE_TOKEN);
  });

  it('생성한 url 데이터를 반환해야 합니다.', async () => {
    const expectedResult: SetUrlResponseDto = {
      id: 1,
      url: 'http://example.com',
    };

    const setUrl = jest
      .spyOn(urlService, 'setUrl')
      .mockResolvedValue(expectedResult);

    const result = await handler.execute();

    expect(result).toStrictEqual(expectedResult);
    expect(setUrl).toHaveBeenCalledTimes(1);
  });
});
