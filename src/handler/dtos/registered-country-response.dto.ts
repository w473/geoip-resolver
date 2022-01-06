import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { NamesResponseDto } from 'src/handler/dtos/names-response.dto';

export class RegisteredCountryResponseDto {
  @ApiModelProperty()
  geoNameId: number;

  @ApiModelProperty()
  readonly isInEuropeanUnion: boolean;

  @ApiModelProperty()
  readonly isoCode: string;

  @ApiModelProperty()
  readonly names: NamesResponseDto;
}
