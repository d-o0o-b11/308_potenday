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

jest.mock('@nestjs/swagger', () => {
  return {
    SwaggerModule: mockSwaggerModule,
    DocumentBuilder: jest.fn().mockImplementation(() => {
      return mockDocumentBuilder;
    }),
  };
});

import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { SetUpConfig } from '@config';

describe('SetUpConfig', () => {
  let setupConfig: SetUpConfig;
  let app: NestExpressApplication;

  beforeEach(async () => {
    app = {
      listen: jest.fn(),
      get: jest.fn(),
      use: jest.fn(),
      enableCors: jest.fn(),
    } as unknown as NestExpressApplication;
    setupConfig = new SetUpConfig(app);
  });

  describe('setUp', () => {
    it('swagger 와 cors를 설정합니다.', () => {
      const swaggerSpy = jest.spyOn(SwaggerModule, 'setup');
      const documentSpy = jest
        .spyOn(SwaggerModule, 'createDocument')
        .mockReturnValue({} as any);
      const enableCorsSpy = jest.spyOn(app, 'enableCors');

      setupConfig.setUp();

      expect(documentSpy).toHaveBeenCalled();
      expect(swaggerSpy).toHaveBeenCalledWith(
        'swagger/potenday308',
        app,
        expect.anything(),
        expect.objectContaining({
          swaggerOptions: expect.objectContaining({
            tagsSorter: 'alpha',
            persistAuthorization: true,
          }),
        }),
      );
      expect(enableCorsSpy).toHaveBeenCalledWith({
        origin: ['https://melting-point.vercel.app/*'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: 'Content-Type, Accept, Authorization',
      });
    });
  });

  describe('setListen', () => {
    it('SERVER_PORT에 따라 listen 합니다.', async () => {
      const listenSpy = jest.spyOn(app, 'listen');
      process.env.SERVER_PORT = '4000';

      await setupConfig.setListen();

      expect(listenSpy).toHaveBeenCalledWith('4000', '0.0.0.0');
    });

    it('SERVER_PORT가 정의되지 않았을 경우 3000을 사용합니다.', async () => {
      const listenSpy = jest.spyOn(app, 'listen');
      delete process.env.SERVER_PORT;

      await setupConfig.setListen();

      expect(listenSpy).toHaveBeenCalledWith(3000, '0.0.0.0');
    });
  });
});
