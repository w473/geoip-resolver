import { Controller, Get, Param } from '@nestjs/common';

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GeoIPService } from 'src/application/services/geoip.service';
import { IpDto } from 'src/handler/dtos/ip.dto';
import { GeoIPResponseDto } from 'src/handler/dtos/geoip-response.dto';

@Controller('api/v1/geoip')
@ApiTags('geoip')
export class GeoipController {
  constructor(private readonly geoIPService: GeoIPService) {}

  @Get(':ip')
  @ApiResponse({
    type: GeoIPResponseDto,
    description: 'returns raw data from MMDB',
  })
  async send(@Param() ipDto: IpDto): Promise<GeoIPResponseDto> {
    return this.geoIPService.getByIP(ipDto.ip);
  }
}
