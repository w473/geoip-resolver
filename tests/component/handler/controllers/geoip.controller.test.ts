import { INestApplication } from '@nestjs/common';
import * as Request from 'supertest';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from 'src/app.module';
import {
  DEFAULT_AUTHORIZATION_HEADER,
  GEOIP_CLIENT_INTERFACE,
} from 'src/statics';
import { tokenNoRole, tokenSysRole } from '../../../__mockdata__/jwt.tokens';
import { GeoIPService } from 'src/application/services/geoip.service';
import { mock } from 'jest-mock-extended';
import { GeoIPResponseDto } from 'src/handler/dtos/geoip-response.dto';

describe('GeoipController', () => {
  const basicPath = '/api/v1/geoip';
  let app: INestApplication;
  let request: Request.SuperTest<Request.Test>;
  const geoIPServiceMock = {
    getByIP: jest.fn(),
    boot: jest.fn(),
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
      .overrideProvider(GEOIP_CLIENT_INTERFACE)
      .useValue(mock())
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

  it(`/GET geoip no token - forbidden`, () => {
    return request
      .get(basicPath + '/192.168.1.1')
      .expect(401)
      .expect({
        statusCode: 401,
        message: 'Unauthorized',
      });
  });

  it(`/GET geoip`, () => {
    const cityResponse: GeoIPResponseDto = {
      city: {
        geoNameId: 666,
        names: {
          en: 'potato',
        },
      },
    };
    geoIPServiceMock.getByIP = jest.fn().mockReturnValue(cityResponse);

    return request
      .get(basicPath + '/192.168.1.1')
      .set(DEFAULT_AUTHORIZATION_HEADER, tokenSysRole)
      .expect(200)
      .expect(cityResponse);
  });
});
