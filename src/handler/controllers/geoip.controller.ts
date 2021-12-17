import { Controller, Get, Param } from '@nestjs/common';

import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { HasRole } from 'nestjs-keycloak-authorize';
import { GeoIPService } from 'src/application/services/geoip.service';
import { IpDto } from 'src/handler/dtos/ip.dto';
import { Response } from 'mmdb-lib/lib/reader/response';

@Controller('api/v1/geoip')
@ApiTags('geoip')
export class GeoipController {
  constructor(private readonly geoIPService: GeoIPService) {}

  @Get(':ip')
  @HasRole('SYS')
  @ApiCreatedResponse()
  async send(@Param() ipDto: IpDto): Promise<Response> {
    return this.geoIPService.getByIP(ipDto.ip);
  }
}
