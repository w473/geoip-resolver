import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'nestjs-keycloak-authorize/lib/decorators/is-public.decorator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  @IsPublic()
  check() {
    return this.health.check([]);
  }
}
