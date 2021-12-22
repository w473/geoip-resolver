import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { RegisteredCountryResponseDto } from 'src/handler/dtos/registered-country-response.dto';
import { NamesResponseDto } from 'src/handler/dtos/names-response.dto';

export class SubdivisionResponseDto {
  @ApiModelPropertyOptional()
  readonly confidence?: number;
  @ApiModelProperty()
  readonly geoname_id: number;
  @ApiModelProperty()
  readonly iso_code: string;
  @ApiModelProperty()
  readonly names: NamesResponseDto;
}
