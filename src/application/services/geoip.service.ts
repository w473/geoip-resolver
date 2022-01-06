import { Logger, Injectable, Inject } from '@nestjs/common';
import { GeoipClientInterface } from 'src/domain/geoip.client';
import { GeoIPResponseDto } from 'src/handler/dtos/geoip-response.dto';

@Injectable()
export class GeoIPService {
  private readonly logger = new Logger(GeoIPService.name);

  constructor(
    @Inject('GeoipClientInterface')
    private readonly geoipClient: GeoipClientInterface,
  ) {}

  getByIP(ip: string): GeoIPResponseDto {
    try {
      return this.geoipClient.getByIP(ip);
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
}
