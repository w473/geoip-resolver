import maxmind, { Reader } from 'maxmind';
import { CityResponse } from 'mmdb-lib/lib/reader/response';
import { Inject, Injectable } from '@nestjs/common';
import { MMDB_FILE_PATH, MMDB_LICENSE_KEY } from 'src/statics';
import { copyFileSync, readdirSync, renameSync } from 'fs';
import { GeoipClientInterface } from 'src/domain/geoip.client';
import { GeoIPResponseDto } from 'src/handler/dtos/geoip-response.dto';
import { FileDownloadClient } from 'src/infrastructure/file-download.client';
import { existsSync } from 'fs';
import { SubdivisionResponseDto } from 'src/handler/dtos/subdivision-response.dto';
import { ContinentCode } from 'src/handler/dtos/continent-response.dto';

@Injectable()
export class MmdbClient implements GeoipClientInterface {
  private reader: Reader<CityResponse>;

  constructor(
    @Inject(MMDB_LICENSE_KEY) private readonly licenseKey: string,
    @Inject(MMDB_FILE_PATH) private readonly mmdbFile: string,
    private readonly fileDownloadClient: FileDownloadClient,
  ) {}

  public getByIP(ip: string): GeoIPResponseDto {
    if (this.reader) {
      const response = this.reader.get(ip);
      return {
        city: {
          confidence: response.city?.confidence,
          names: response.city?.names,
          geoNameId: response.city?.geoname_id,
        },
        country: {
          confidence: response.country?.confidence,
          names: response.country?.names,
          geoNameId: response.country?.geoname_id,
          isInEuropeanUnion: response.country?.is_in_european_union,
          isoCode: response.country?.iso_code,
        },
        location: {
          accuracyRadius: response.location?.accuracy_radius,
          averageIncome: response.location?.average_income,
          latitude: response.location?.latitude,
          longitude: response.location?.longitude,
          metroCode: response.location?.metro_code,
          populationDensity: response.location?.population_density,
          timeZone: response.location?.time_zone,
        },
        continent: {
          names: response.continent?.names,
          code: <ContinentCode>response?.continent?.code.toString(),
          geoNameId: response.continent?.geoname_id,
        },
        postal: response?.postal,
        registeredCountry: {
          names: response.country?.names,
          geoNameId: response.country?.geoname_id,
          isInEuropeanUnion: response.country?.is_in_european_union,
          isoCode: response.country?.iso_code,
        },
        subdivisions: response.subdivisions?.map(
          (subdivision): SubdivisionResponseDto => {
            return {
              names: subdivision.names,
              isoCode: subdivision.iso_code,
              confidence: subdivision.confidence,
              geoNameId: subdivision.geoname_id,
            };
          },
        ),
      };
    }
    return null;
  }

  public setReader(reader: Reader<CityResponse>): void {
    this.reader = reader;
  }

  /* istanbul ignore next */
  private async initReader(): Promise<void> {
    this.reader = await maxmind.open(this.mmdbFile);
  }

  /* istanbul ignore next */
  public async boot(): Promise<void> {
    if (!existsSync(this.mmdbFile)) {
      const tmpDir = '/tmp';

      const filePath = `${tmpDir}/${this.mmdbFile}.tar.gz`;

      await this.fileDownloadClient.downloadFile(
        this.getDatabaseUrl(),
        filePath,
      );

      await this.fileDownloadClient.decompress(filePath, tmpDir);

      const hash = await this.fileDownloadClient.getFileHash(
        this.getDatabaseHashUrl(),
      );

      if (!this.fileDownloadClient.checkHash(filePath, hash)) {
        throw new Error('Invalid download!');
      }

      await this.installNewestMMDB(tmpDir);
    }
    await this.initReader();
  }

  /* istanbul ignore next */
  private async installNewestMMDB(tmpDir: string): Promise<void> {
    const files = readdirSync(tmpDir, { withFileTypes: true });
    const dir = files.filter((file) => {
      if (file.isDirectory() && file.name.startsWith('GeoLite2-City_')) {
        return file;
      }
    });

    copyFileSync(
      `${tmpDir}/${dir.reverse()[0].name}/GeoLite2-City.mmdb`,
      this.mmdbFile,
    );
  }

  /* istanbul ignore next */
  private getDatabaseUrl(): string {
    return `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=${this.licenseKey}&suffix=tar.gz`;
  }

  /* istanbul ignore next */
  private getDatabaseHashUrl(): string {
    return this.getDatabaseUrl() + '.sha256';
  }
}
