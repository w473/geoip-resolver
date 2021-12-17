import maxmind, { Reader } from 'maxmind';
import { Logger, Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { Response } from 'mmdb-lib/lib/reader/response';
import { MMDB_FILE_PATH, MMDB_LICENSE_KEY } from 'src/statics';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { createHash } from 'crypto';
import { createWriteStream, readFileSync, writeFileSync } from 'fs';
import { get, IncomingMessage } from 'http';
import { finished } from 'stream/promises';

@Injectable()
export class GeoIPService implements OnModuleInit {
  private readonly logger = new Logger(GeoIPService.name);
  reader?: Reader<Response>;

  constructor(
    @Inject(MMDB_LICENSE_KEY) private readonly licenseKey: string,
    @Inject(MMDB_FILE_PATH) private readonly mmdbFile: string,
    private readonly httpService: HttpService,
  ) {}

  private async getReader(): Promise<Reader<Response>> {
    if (!this.reader) {
      this.reader = await maxmind.open<Response>(this.mmdbFile);
    }
    return this.reader;
  }

  async getByIP(ip: string): Promise<Response> {
    try {
      return (await this.getReader()).get(ip);
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async downloadMMDB(): Promise<void> {
    const filePath = `${this.mmdbFile}.tar.gz`;
    const writer = createWriteStream(filePath);

    const observable = this.httpService.get(this.getDatabaseUrl(), {
      responseType: 'stream',
    });

    observable.subscribe(async (response) => {
      const incomingMessage = <IncomingMessage>response.data;
      incomingMessage.pipe(writer);
      await finished(writer);
      const file = readFileSync(filePath);

      const fileHash = await firstValueFrom(
        this.httpService.get(this.getDatabaseHashUrl(), {
          responseType: 'blob',
        }),
      );
      const hashFromNet = (<string>fileHash.data).split(' ')[0];
      const localHash = createHash('sha256').update(file).digest('hex');
      if (hashFromNet !== localHash) {
        throw new Error('Invalid download!');
      }
    });
  }

  private getDatabaseUrl(): string {
    return `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=${this.licenseKey}&suffix=tar.gz`;
  }

  private getDatabaseHashUrl(): string {
    return this.getDatabaseUrl() + '.sha256';
  }

  async onModuleInit(): Promise<void> {
    await this.downloadMMDB();
  }
}
