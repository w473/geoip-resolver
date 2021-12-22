import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class NamesResponseDto {
  @ApiModelPropertyOptional()
  readonly de?: string;
  @ApiModelProperty()
  readonly en: string;
  @ApiModelPropertyOptional()
  readonly es?: string;
  @ApiModelPropertyOptional()
  readonly fr?: string;
  @ApiModelPropertyOptional()
  readonly ja?: string;
  @ApiModelPropertyOptional()
  readonly 'pt-BR'?: string;
  @ApiModelPropertyOptional()
  readonly ru?: string;
  @ApiModelPropertyOptional()
  readonly 'zh-CN'?: string;
}
