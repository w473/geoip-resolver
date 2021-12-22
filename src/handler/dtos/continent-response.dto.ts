import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { NamesResponseDto } from 'src/handler/dtos/names-response.dto';

export enum ContinentCode {
  'AF' = 'AF',
  'AN' = 'AN',
  'AS' = 'AS',
  'EU' = 'EU',
  'NA' = 'NA',
  'OC' = 'OC',
  'SA' = 'SA',
}
export class ContinentResponseDto {
  @ApiModelProperty()
  geoname_id: number;

  @ApiModelProperty({ enum: Object.keys(ContinentCode) })
  readonly code: ContinentCode;

  @ApiModelProperty()
  readonly names: NamesResponseDto;
}
