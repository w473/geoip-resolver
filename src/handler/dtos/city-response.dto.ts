import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { NamesResponseDto } from 'src/handler/dtos/names-response.dto';

export class CityResponseDto {
  @ApiModelProperty()
  geoNameId: number;

  @ApiModelProperty()
  readonly confidence?: number;

  @ApiModelProperty()
  readonly names: NamesResponseDto;
}
