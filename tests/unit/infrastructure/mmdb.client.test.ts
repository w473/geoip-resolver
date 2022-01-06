import { MmdbClient } from 'src/infrastructure/mmdb.client';
import { FileDownloadClient } from 'src/infrastructure/file-download.client';
import { mock, mockReset } from 'jest-mock-extended';
import { Reader } from 'maxmind';
import { CityResponse } from 'mmdb-lib/lib/reader/response';
import { cityResponseMock } from '../../__mockdata__/city-response.mock';

describe('MmdbClient', () => {
  const fileDownloadClient: FileDownloadClient = mock<FileDownloadClient>();
  const reader = mock<Reader<CityResponse>>();
  const mmdbClient = new MmdbClient('key', 'file', fileDownloadClient);

  beforeEach(() => {
    mockReset(fileDownloadClient);
    mmdbClient.setReader(reader);
  });

  it('np reader return null', async () => {
    mmdbClient.setReader(null);
    expect(await mmdbClient.getByIP('192.168.1.1')).toEqual(null);
  });

  it('GET IP', async () => {
    const city = {
      geoname_id: 6666,
      names: {
        en: 'potato',
      },
    };
    reader.get.mockReturnValue({
      city,
      subdivisions: [
        {
          geoname_id: 3454,
          names: null,
          iso_code: 'sdsd',
        },
      ],
    });
    expect(await mmdbClient.getByIP('192.168.1.1')).toEqual(cityResponseMock);
  });

  // it('Boot', async () => {
  //   await mmdbClient.boot();
  // });
});
