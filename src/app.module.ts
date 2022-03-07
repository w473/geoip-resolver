import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './handler/controllers/health.controller';
import { GeoipController } from 'src/handler/controllers/geoip.controller';
import { LoggerMiddleware } from 'src/infrastructure/middlewares/logger.middleware';
import {
  DEFAULT_AUTHORIZATION_HEADER,
  GEOIP_CLIENT_INTERFACE,
  MMDB_FILE_PATH,
  MMDB_LICENSE_KEY,
} from 'src/statics';
import { GeoIPService } from 'src/application/services/geoip.service';
import { ConfigService } from '@nestjs/config';
import { BootstrapService } from 'src/application/services/bootstrap.service';
import { MmdbClient } from 'src/infrastructure/mmdb.client';
import { FileDownloadClient } from 'src/infrastructure/file-download.client';
import {
  AuthenticationMiddleware,
  AUTHORIZATION_HEADER_NAME,
  TOKEN_PARSER_INTERFACE,
} from 'nestjs-jwt-authorize';
import { TokenParser } from 'src/handler/controllers/auth/token.parser';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController, GeoipController],
  providers: [
    GeoIPService,
    BootstrapService,
    FileDownloadClient,
    {
      provide: GEOIP_CLIENT_INTERFACE,
      useFactory: async (
        configService: ConfigService,
        fileDownloadClient: FileDownloadClient,
      ) => {
        const mmdbFile = configService.get(MMDB_FILE_PATH);
        return new MmdbClient(
          configService.get(MMDB_LICENSE_KEY),
          mmdbFile,
          fileDownloadClient,
        );
      },
      inject: [ConfigService, FileDownloadClient],
    },
    {
      provide: AUTHORIZATION_HEADER_NAME,
      useValue: DEFAULT_AUTHORIZATION_HEADER,
    },
    {
      provide: TOKEN_PARSER_INTERFACE,
      useClass: TokenParser,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(AuthenticationMiddleware).exclude('/health').forRoutes('*');
  }
}
