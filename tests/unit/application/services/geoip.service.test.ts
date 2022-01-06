import { MmdbClient } from 'src/infrastructure/mmdb.client';
import { FileDownloadClient } from 'src/infrastructure/file-download.client';
import { mock, mockReset } from 'jest-mock-extended';
import { Reader } from 'maxmind';
import { CityResponse } from 'mmdb-lib/lib/reader/response';
import { GeoIPService } from 'src/application/services/geoip.service';
import { GeoipClientInterface } from 'src/domain/geoip.client';
import { cityResponseMock } from '../../../__mockdata__/city-response.mock';

describe('GEOIP SERVICE', () => {
  const geoIPClient = mock<GeoipClientInterface>();
  const geoIPService = new GeoIPService(geoIPClient);

  beforeEach(() => {
    mockReset(geoIPClient);
  });

  it('GET IP null', async () => {
    geoIPClient.getByIP.mockReturnValue(null);
    expect(geoIPService.getByIP('192.168.1.1')).toEqual(null);
  });

  it('GET IP ok', async () => {
    geoIPClient.getByIP.mockReturnValue(cityResponseMock);
    expect(geoIPService.getByIP('192.168.1.1')).toEqual(cityResponseMock);
  });

  it('GET IP throw exception', async () => {
    geoIPClient.getByIP.mockImplementationOnce(() => {
      throw new Error();
    });
    expect(geoIPService.getByIP('192.168.1.1')).toEqual(null);
  });
});
