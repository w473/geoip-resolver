import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { RegisteredCountryResponseDto } from 'src/handler/dtos/registered-country-response.dto';

export class CountryResponseDto extends RegisteredCountryResponseDto {
  @ApiModelPropertyOptional()
  readonly confidence?: number;
}
