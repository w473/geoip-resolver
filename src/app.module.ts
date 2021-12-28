import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { HealthController } from './handler/controllers/health.controller';
import { GeoipController } from 'src/handler/controllers/geoip.controller';
import { LoggerMiddleware } from 'src/infrastructure/middlewares/logger.middleware';
import {
  AuthenticationMiddleware,
  AUTHORIZATION_HEADER_NAME,
  RolesGuard,
} from 'nestjs-keycloak-authorize';
import {
  DEFAULT_AUTHORIZATION_HEADER,
  MMDB_FILE_PATH,
  MMDB_LICENSE_KEY,
} from 'src/statics';
import { GeoIPService } from 'src/application/services/geoip.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController, GeoipController],
  providers: [
    GeoIPService,
    {
      provide: AUTHORIZATION_HEADER_NAME,
      useValue: DEFAULT_AUTHORIZATION_HEADER,
    },
    {
      provide: MMDB_FILE_PATH,
      useFactory: (configService: ConfigService) => {
        return configService.get(MMDB_FILE_PATH);
      },
      inject: [ConfigService],
    },
    {
      provide: MMDB_LICENSE_KEY,
      useFactory: (configService: ConfigService) => {
        return configService.get(MMDB_LICENSE_KEY);
      },
      inject: [ConfigService],
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(AuthenticationMiddleware).exclude('/health').forRoutes('*');
  }
}
