import {
  Logger,
  Injectable,
  Inject,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { GeoipClientInterface } from 'src/domain/geoip.client';
import { GEOIP_CLIENT_INTERFACE } from 'src/statics';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(
    @Inject(GEOIP_CLIENT_INTERFACE)
    private readonly geoipClient: GeoipClientInterface,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('GEOIP BOOT START');
    await this.geoipClient.boot();
    this.logger.log('GEOIP BOOT FINISHED');
  }
}
