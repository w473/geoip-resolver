import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { RegisteredCountryResponseDto } from 'src/handler/dtos/registered-country-response.dto';

export class LocationResponseDto {
  @ApiModelProperty()
  readonly accuracyRadius: number;
  @ApiModelPropertyOptional()
  readonly averageIncome?: number;
  @ApiModelProperty()
  readonly latitude: number;
  @ApiModelProperty()
  readonly longitude: number;
  @ApiModelPropertyOptional()
  readonly metroCode?: number;
  @ApiModelPropertyOptional()
  readonly populationDensity?: number;
  @ApiModelPropertyOptional()
  readonly timeZone?: string;
}
