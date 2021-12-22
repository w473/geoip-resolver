import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { RegisteredCountryResponseDto } from 'src/handler/dtos/registered-country-response.dto';

export class LocationResponseDto extends RegisteredCountryResponseDto {
  @ApiModelProperty()
  readonly accuracy_radius: number;
  @ApiModelPropertyOptional()
  readonly average_income?: number;
  @ApiModelProperty()
  readonly latitude: number;
  @ApiModelProperty()
  readonly longitude: number;
  @ApiModelPropertyOptional()
  readonly metro_code?: number;
  @ApiModelPropertyOptional()
  readonly population_density?: number;
  @ApiModelPropertyOptional()
  readonly time_zone?: string;
}
