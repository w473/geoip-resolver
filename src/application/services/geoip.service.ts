import maxmind, { Reader } from 'maxmind';
import {
  Logger,
  Injectable,
  Inject,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Response } from 'mmdb-lib/lib/reader/response';
import { MMDB_FILE_PATH, MMDB_LICENSE_KEY } from 'src/statics';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { createHash } from 'crypto';
import {
  createWriteStream,
  existsSync,
  readdirSync,
  readFileSync,
  renameSync,
} from 'fs';
import { IncomingMessage } from 'http';
import { finished } from 'stream/promises';
import { decompress } from 'targz';

@Injectable()
export class GeoIPService implements OnApplicationBootstrap {
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
    const tmpDir = '/tmp';

    const filePath = `${tmpDir}/${this.mmdbFile}.tar.gz`;

    await this.downloadFile(filePath);

    await this.decompress(filePath, tmpDir);

    await this.checkHash(filePath);

    await this.installNewestMMDB(tmpDir);

    await this.getReader();
  }

  async installNewestMMDB(tmpDir: string): Promise<void> {
    const files = readdirSync(tmpDir, { withFileTypes: true });
    const dir = files.filter((file) => {
      if (file.isDirectory() && file.name.startsWith('GeoLite2-City_')) {
        return file;
      }
    });

    renameSync(
      `${tmpDir}/${dir.reverse()[0].name}/GeoLite2-City.mmdb`,
      this.mmdbFile,
    );
  }

  async checkHash(filePath: string): Promise<void> {
    const file = readFileSync(filePath);
    const hashFromNet = await this.getFileHash();
    const localHash = createHash('sha256').update(file).digest('hex');
    if (hashFromNet !== localHash) {
      throw new Error('Invalid download!');
    }
  }

  async getFileHash(): Promise<string> {
    const fileHash = await firstValueFrom(
      this.httpService.get(this.getDatabaseHashUrl(), {
        responseType: 'blob',
      }),
    );
    return (<string>fileHash.data).split(' ')[0];
  }

  async downloadFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const writer = createWriteStream(filePath);
      const observable = this.httpService.get(this.getDatabaseUrl(), {
        responseType: 'stream',
      });
      const observer = {
        error: reject,
        next: async (response) => {
          const incomingMessage = <IncomingMessage>response.data;
          incomingMessage.pipe(writer);
          await finished(writer);
          resolve();
        },
      };
      observable.subscribe(observer);
    });
  }

  async decompress(src: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
      decompress(
        {
          src,
          dest,
        },
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }

  private getDatabaseUrl(): string {
    return `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=${this.licenseKey}&suffix=tar.gz`;
  }

  private getDatabaseHashUrl(): string {
    return this.getDatabaseUrl() + '.sha256';
  }

  async onApplicationBootstrap(): Promise<void> {
    if (!existsSync(this.mmdbFile)) {
      this.logger.log('Fetching MMDB');
      await this.downloadMMDB();
    } else {
      this.logger.log('MMDB already exists - not fetching needed');
    }
  }
}
