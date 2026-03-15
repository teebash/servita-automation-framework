import { ApiClient, parseResponse } from '../../api/clients';
import {
  expectStatus,
  expectFieldEquals,
  expectPaginatedResponse,
} from '../../api/assertions';
import { API_ENDPOINTS } from '../../core/constants';
import {
  paginatedResourcesSchema,
  singleResourceSchema,
} from '../../core/schemas';

describe('Resources API', () => {
  const api = new ApiClient();

  describe('GET /api/unknown', () => {
    it('@smoke @regression should return a paginated list of resources', async () => {
      const raw = await api.get(API_ENDPOINTS.RESOURCES);
      expectStatus(raw.status, 200);

      const response = parseResponse(raw, paginatedResourcesSchema);
      expectPaginatedResponse(response.body);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('@regression should return resources with expected fields', async () => {
      const raw = await api.get(API_ENDPOINTS.RESOURCES);
      const response = parseResponse(raw, paginatedResourcesSchema);

      const firstResource = response.body.data[0];
      expect(firstResource.id).toBeDefined();
      expect(firstResource.name).toBeDefined();
      expect(firstResource.year).toBeDefined();
      expect(firstResource.color).toBeDefined();
      expect(firstResource.pantone_value).toBeDefined();
    });

    it('@regression should include support information in response', async () => {
      const raw = await api.get(API_ENDPOINTS.RESOURCES);
      const response = parseResponse(raw, paginatedResourcesSchema);

      expect(response.body.support).toBeDefined();
      expect(response.body.support.url).toBeDefined();
      expect(response.body.support.text).toBeDefined();
    });
  });

  describe('GET /api/unknown/:id', () => {
    it('@regression should return a single resource by ID', async () => {
      const raw = await api.get(API_ENDPOINTS.SINGLE_RESOURCE(2));
      expectStatus(raw.status, 200);

      const response = parseResponse(raw, singleResourceSchema);
      expectFieldEquals(response.body.data, 'id', 2);
      expect(response.body.data.name).toBeDefined();
      expect(response.body.data.year).toBeDefined();
      expect(response.body.data.color).toBeDefined();
      expect(response.body.data.pantone_value).toBeDefined();
    });

    it('@regression should return 404 for a non-existent resource', async () => {
      const response = await api.get(API_ENDPOINTS.SINGLE_RESOURCE(9999));
      expectStatus(response.status, 404);
    });
  });
});
