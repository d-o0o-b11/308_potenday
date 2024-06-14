/**
 * @memo_for_me 생성자를 포함한 커스텀 목킹시 주의사항
 * jest.mock(...) 구문 사용시 테스트 대상 코드에서 실행할 import 모듈을 목킹한다.
 * 따라서 커스텀 mock 을 제공하고자 할 때 import 구문보다 위에 있어야 순서상 참조가 가능하다.
 */

// 스웨거 모듈 목킹
const mockSwaggerModule = {
  setup: jest.fn(),
  createDocument: jest.fn().mockReturnValue(null as any),
};

// 스웨거 문서 빌더 목킹
const mockDocumentBuilder = {
  setTitle: jest.fn().mockReturnThis(),
  setDescription: jest.fn().mockReturnThis(),
  setVersion: jest.fn().mockReturnThis(),
  addBearerAuth: jest.fn().mockReturnThis(),
  build: jest.fn().mockReturnThis(),
};

const mockExpressBasicAuth = jest
  .fn()
  .mockReturnValue('TEST_EXPRESS_BASIC_AUTH');

import { NestExpressApplication } from '@nestjs/platform-express';
import { SetUpConfig } from '../config/setup.config';

jest.mock('@nestjs/swagger', () => {
  return {
    SwaggerModule: mockSwaggerModule,
    DocumentBuilder: jest.fn().mockImplementation(() => {
      return mockDocumentBuilder;
    }),
  };
});

jest.mock('express-basic-auth', () => mockExpressBasicAuth);

class TestConfigService extends SetUpConfig {
  public override setCORS(): void {
    super.setCORS();
  }

  public override swaggerConfig(): void {
    super.swaggerConfig();
  }
}

describe('SetUpConfig', () => {
  let app: NestExpressApplication;
  let setUpConfig: TestConfigService;

  beforeEach(async () => {
    app = {
      listen: jest.fn(),
      get: jest.fn(),
      use: jest.fn(),
      enableCors: jest.fn(),
    } as unknown as NestExpressApplication;
  });

  describe('swaggerConfig', () => {
    const mockSwaggerConfig = 'MOCK_SWAGGER_CONFIG';
    const mockDocument = 'MOCK_DOCUMENT';

    it('스웨거 설정', () => {
      setUpConfig = new TestConfigService(app);
      jest
        .spyOn(mockDocumentBuilder, 'build')
        .mockReturnValue(mockSwaggerConfig);

      const createDocument = jest
        .spyOn(mockSwaggerModule, 'createDocument')
        .mockReturnValue(mockDocument);

      const setup = jest.spyOn(mockSwaggerModule, 'setup');

      setUpConfig.swaggerConfig();

      expect(createDocument).toBeCalledTimes(1);
      expect(createDocument).toBeCalledWith(app, mockSwaggerConfig);

      // 문서 적용 검증
      expect(setup).toBeCalledTimes(1);
      expect(setup).toBeCalledWith(`swagger/potenday306`, app, mockDocument, {
        swaggerOptions: {
          tagsSorter: 'alpha',
          syntaxHighlight: true,
          persistAuthorization: true,
          displayRequestDuration: true,
          docExpansion: 'none',
        },
      });
    });
  });

  describe('setCORS', () => {
    it('cors 해결', () => {
      setUpConfig = new TestConfigService(app);

      const enableCors = jest.spyOn(app, 'enableCors');

      setUpConfig.setCORS();

      expect(enableCors).toBeCalledWith({
        origin: [
          'https://melting-point.vercel.app/',
          'https://melting-point.vercel.app/*',
          'https://melting-point.vercel.app',
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: 'Content-Type, Accept, Authorization',
      });
    });
  });
});
