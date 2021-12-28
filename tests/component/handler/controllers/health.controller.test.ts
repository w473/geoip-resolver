import { INestApplication } from '@nestjs/common';
import { TypeOrmHealthIndicator } from '@nestjs/terminus';
import * as Request from 'supertest';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from 'src/app.module';

describe('HEALTH', () => {
  let app: INestApplication;
  let request: Request.SuperTest<Request.Test>;

  beforeAll(async () => {
    const testingModule = Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        AppModule,
      ],
    });
    const moduleRef = await testingModule
      .overrideProvider(TypeOrmHealthIndicator)
      .useValue({ pingCheck: () => null })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    request = Request(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  it(`/GET health`, () => {
    return request
      .get('/health')
      .expect(200)
      .expect({ status: 'ok', info: {}, error: {}, details: {} });
  });
});
