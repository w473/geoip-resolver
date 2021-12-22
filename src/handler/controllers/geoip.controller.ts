import { Controller, Get, Param } from '@nestjs/common';

import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HasRole } from 'nestjs-keycloak-authorize';
import { GeoIPService } from 'src/application/services/geoip.service';
import { IpDto } from 'src/handler/dtos/ip.dto';
import { Response } from 'mmdb-lib/lib/reader/response';
import { ResponseDto } from 'src/handler/dtos/response.dto';

@Controller('api/v1/geoip')
@ApiTags('geoip')
export class GeoipController {
  constructor(private readonly geoIPService: GeoIPService) {}

  @Get(':ip')
  @HasRole('SYS')
  @ApiResponse({ type: ResponseDto })
  async send(@Param() ipDto: IpDto): Promise<Response> {
    return this.geoIPService.getByIP(ipDto.ip);
  }
}