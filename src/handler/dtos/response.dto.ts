import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { CityResponseDto } from 'src/handler/dtos/city-response.dto';
import { ContinentResponseDto } from 'src/handler/dtos/continent-response.dto';
import { CountryResponseDto } from 'src/handler/dtos/country-response.dto';
import { RegisteredCountryResponseDto } from 'src/handler/dtos/registered-country-response.dto';
import { LocationResponseDto } from 'src/handler/dtos/location-response.dto';
import { PostalResponseDto } from 'src/handler/dtos/postal-response.dto';
import { SubdivisionResponseDto } from 'src/handler/dtos/subdivision-response.dto';
import { TraitsResponseDto } from 'src/handler/dtos/traits-response.dto';

export class ResponseDto {
  @ApiModelPropertyOptional()
  city?: CityResponseDto;

  @ApiModelPropertyOptional()
  continent?: ContinentResponseDto;

  @ApiModelPropertyOptional()
  country?: CountryResponseDto;

  @ApiModelPropertyOptional()
  location?: LocationResponseDto;

  @ApiModelPropertyOptional()
  postal?: PostalResponseDto;

  @ApiModelPropertyOptional()
  registered_country?: RegisteredCountryResponseDto;

  @ApiModelPropertyOptional()
  represented_country?: RegisteredCountryResponseDto;

  @ApiModelPropertyOptional({ type: SubdivisionResponseDto, isArray: true })
  subdivisions?: SubdivisionResponseDto[];

  @ApiModelPropertyOptional()
  traits?: TraitsResponseDto;
}
