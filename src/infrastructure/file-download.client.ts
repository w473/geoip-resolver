import { createWriteStream, readFileSync } from 'fs';
import { createHash } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { IncomingMessage } from 'http';
import { finished } from 'stream/promises';
import { HttpService } from '@nestjs/axios';
import { decompress } from 'targz';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileDownloadClient {
  constructor(private readonly httpService: HttpService) {}

  checkHash(filePath: string, hash: string): boolean {
    const file = readFileSync(filePath);
    const localHash = createHash('sha256').update(file).digest('hex');
    return hash === localHash;
  }

  async getFileHash(hashFileUrl: string): Promise<string> {
    const fileHash = await firstValueFrom(
      this.httpService.get(hashFileUrl, {
        responseType: 'blob',
      }),
    );
    return (<string>fileHash.data).split(' ')[0];
  }

  /* istanbul ignore next */
  async downloadFile(fileUrl: string, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const writer = createWriteStream(filePath);
      const observable = this.httpService.get(fileUrl, {
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

  /* istanbul ignore next */
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
}
