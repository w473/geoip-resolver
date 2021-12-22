import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class TraitsResponseDto {
  @ApiModelPropertyOptional()
  readonly autonomous_system_number?: number;
  @ApiModelPropertyOptional()
  readonly autonomous_system_organization?: string;
  @ApiModelPropertyOptional()
  readonly connection_type?: string;
  @ApiModelPropertyOptional()
  readonly domain?: string;
  @ApiModelPropertyOptional()
  ip_address?: string;
  @ApiModelPropertyOptional()
  readonly is_anonymous?: boolean;
  @ApiModelPropertyOptional()
  readonly is_anonymous_proxy?: boolean;
  @ApiModelPropertyOptional()
  readonly is_anonymous_vpn?: boolean;
  @ApiModelPropertyOptional()
  readonly is_hosting_provider?: boolean;
  @ApiModelPropertyOptional()
  readonly is_legitimate_proxy?: boolean;
  @ApiModelPropertyOptional()
  readonly is_public_proxy?: boolean;
  @ApiModelPropertyOptional()
  readonly is_satellite_provider?: boolean;
  @ApiModelPropertyOptional()
  readonly is_tor_exit_node?: boolean;
  @ApiModelPropertyOptional()
  readonly isp?: string;
  @ApiModelPropertyOptional()
  readonly organization?: string;
  @ApiModelPropertyOptional({
    enum: [
      'business',
      'cafe',
      'cellular',
      'college',
      'content_delivery_network',
      'dialup',
      'government',
      'hosting',
      'library',
      'military',
      'residential',
      'router',
      'school',
      'search_engine_spider',
      'traveler',
    ],
  })
  readonly user_type?:
    | 'business'
    | 'cafe'
    | 'cellular'
    | 'college'
    | 'content_delivery_network'
    | 'dialup'
    | 'government'
    | 'hosting'
    | 'library'
    | 'military'
    | 'residential'
    | 'router'
    | 'school'
    | 'search_engine_spider'
    | 'traveler';
}
