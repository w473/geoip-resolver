import { INestApplication } from '@nestjs/common';
import * as Request from 'supertest';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from 'src/app.module';
import { DEFAULT_AUTHORIZATION_HEADER } from 'src/statics';
import {
  tokenAdminRole,
  tokenNoRole,
  tokenSysRole,
} from '../../../__mockdata__/jwt.tokens';
import { GeoIPService } from 'src/application/services/geoip.service';
import { CityResponse } from 'mmdb-lib/lib/reader/response';

describe('GeoipController', () => {
  const basicPath = '/api/v1/geoip';
  let app: INestApplication;
  let request: Request.SuperTest<Request.Test>;
  const geoIPServiceMock = {
    getByIP: jest.fn(),
  };

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
      .overrideProvider(GeoIPService)
      .useValue(geoIPServiceMock)
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

  it(`/GET geoip/raw no token - forbidden`, () => {
    return request
      .get(basicPath + '/192.168.1.1/raw')
      .expect(401)
      .expect({
        statusCode: 401,
        message: 'Unauthorized',
      });
  });

  it(`/GET emails no proper roles`, () => {
    return request
      .get(basicPath + '/192.168.1.1/raw')
      .set(DEFAULT_AUTHORIZATION_HEADER, tokenNoRole)
      .expect(403)
      .expect({
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      });
  });

  it(`/GET geoip`, () => {
    const cityResponse: CityResponse = {
      city: {
        geoname_id: 666,
        names: {
          en: 'potato',
        },
      },
    };
    geoIPServiceMock.getByIP = jest.fn().mockReturnValue(cityResponse);

    return request
      .get(basicPath + '/192.168.1.1/raw')
      .set(DEFAULT_AUTHORIZATION_HEADER, tokenSysRole)
      .expect(200)
      .expect(cityResponse);
  });
});
