import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { RegisteredCountryResponseDto } from 'src/handler/dtos/registered-country-response.dto';

export class RepresentedCountryResponseDto extends RegisteredCountryResponseDto {
  @ApiModelProperty()
  readonly type: number;
}
