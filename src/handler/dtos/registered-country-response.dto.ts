import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { NamesResponseDto } from 'src/handler/dtos/names-response.dto';

export class RegisteredCountryResponseDto {
  @ApiModelProperty()
  geoname_id: number;

  @ApiModelProperty()
  readonly is_in_european_union: boolean;

  @ApiModelProperty()
  readonly iso_code: string;

  @ApiModelProperty()
  readonly names: NamesResponseDto;
}
