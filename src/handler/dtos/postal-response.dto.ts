import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { RegisteredCountryResponseDto } from 'src/handler/dtos/registered-country-response.dto';

export class PostalResponseDto {
  @ApiModelPropertyOptional()
  readonly confidence?: number;
  @ApiModelProperty()
  readonly code: string;
}
