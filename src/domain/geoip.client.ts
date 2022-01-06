import { GeoIPResponseDto } from 'src/handler/dtos/geoip-response.dto';

export interface GeoipClientInterface {
  boot(): Promise<void>;
  getByIP(ip: string): GeoIPResponseDto;
}
