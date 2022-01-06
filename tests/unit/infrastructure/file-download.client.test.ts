import { FileDownloadClient } from 'src/infrastructure/file-download.client';
import { mock, mockReset } from 'jest-mock-extended';
import { HttpService } from '@nestjs/axios';
import { createWriteStream, readFileSync } from 'fs';
import { mocked } from 'jest-mock';
import { of } from 'rxjs';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { IncomingMessage } from 'http';
import { Socket } from 'net';
jest.mock('fs');

describe('FileDownloadClient', () => {
  const httpServiceMock = mock<HttpService>();
  const fileDownloadClient = new FileDownloadClient(httpServiceMock);

  beforeEach(() => {
    mockReset(httpServiceMock);
  });

  it('checkHash ok', async () => {
    const filePath = 'potato';
    const hash =
      '07f5937c9760f50867a78fa68982b1096cec0798448abf9395cd778fcded6f8d';

    mocked(readFileSync).mockReturnValue('eeee');
    expect(fileDownloadClient.checkHash(filePath, hash)).toEqual(true);
  });

  it('checkHash not ok', async () => {
    const filePath = 'potato';
    const hash = 'asfdadfa';

    mocked(readFileSync).mockReturnValue('eeee');
    expect(fileDownloadClient.checkHash(filePath, hash)).toEqual(false);
  });

  it('getFileHash ok', async () => {
    const hash = 'somehazSDASDASD';
    const response: AxiosResponse<any> = {
      data: hash + ' asdasd',
      config: {},
      headers: {},
      request: {},
      status: 200,
      statusText: 'dd',
    };

    jest
      .spyOn(httpServiceMock, 'get')
      .mockImplementationOnce(() => of(response));

    const hashFileUrl = 'sadsd';
    expect(await fileDownloadClient.getFileHash(hashFileUrl)).toEqual(hash);
  });
});
