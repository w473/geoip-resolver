import { CityResponseDto } from 'src/handler/dtos/city-response.dto';
import { LocationResponseDto } from 'src/handler/dtos/location-response.dto';
import { PostalResponseDto } from 'src/handler/dtos/postal-response.dto';
import { CountryResponseDto } from 'src/handler/dtos/country-response.dto';
import { RegisteredCountryResponseDto } from 'src/handler/dtos/registered-country-response.dto';
import { SubdivisionResponseDto } from 'src/handler/dtos/subdivision-response.dto';
import { ContinentResponseDto } from 'src/handler/dtos/continent-response.dto';
import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class GeoIPResponseDto {
  @ApiModelPropertyOptional()
  city?: CityResponseDto;

  @ApiModelPropertyOptional()
  country?: CountryResponseDto;

  @ApiModelPropertyOptional()
  registeredCountry?: RegisteredCountryResponseDto;

  @ApiModelPropertyOptional()
  location?: LocationResponseDto;

  @ApiModelPropertyOptional()
  postal?: PostalResponseDto;

  @ApiModelPropertyOptional({ type: SubdivisionResponseDto, isArray: true })
  subdivisions?: SubdivisionResponseDto[];

  @ApiModelPropertyOptional()
  continent?: ContinentResponseDto;
}
