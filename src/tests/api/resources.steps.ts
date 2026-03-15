import { loadFeature, defineFeature } from 'jest-cucumber';
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

const feature = loadFeature('./src/tests/api/features/resources.feature');

defineFeature(feature, (test) => {
  let api: ApiClient;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let response: any;

  test('Retrieve a paginated list of resources', ({ given, when, then, and }) => {
    given('the API client is initialised', () => {
      api = new ApiClient();
    });

    when('I send a GET request to the resources endpoint', async () => {
      response = await api.get(API_ENDPOINTS.RESOURCES);
    });

    then('the response status should be 200', () => {
      expectStatus(response.status, 200);
    });

    and('the response should be a valid paginated list of resources', () => {
      const parsed = parseResponse(response, paginatedResourcesSchema);
      expectPaginatedResponse(parsed.body);
      expect(parsed.body.data.length).toBeGreaterThan(0);
    });
  });

  test('Resources response contains expected fields', ({ given, when, then }) => {
    given('the API client is initialised', () => {
      api = new ApiClient();
    });

    when('I send a GET request to the resources endpoint', async () => {
      response = await api.get(API_ENDPOINTS.RESOURCES);
    });

    then('each resource should have id, name, year, color, and pantone_value fields', () => {
      const parsed = parseResponse(response, paginatedResourcesSchema);
      const firstResource = parsed.body.data[0];
      expect(firstResource.id).toBeDefined();
      expect(firstResource.name).toBeDefined();
      expect(firstResource.year).toBeDefined();
      expect(firstResource.color).toBeDefined();
      expect(firstResource.pantone_value).toBeDefined();
    });
  });

  test('Resources response includes support information', ({ given, when, then }) => {
    given('the API client is initialised', () => {
      api = new ApiClient();
    });

    when('I send a GET request to the resources endpoint', async () => {
      response = await api.get(API_ENDPOINTS.RESOURCES);
    });

    then('the response should contain support url and text', () => {
      const parsed = parseResponse(response, paginatedResourcesSchema);
      expect(parsed.body.support).toBeDefined();
      expect(parsed.body.support.url).toBeDefined();
      expect(parsed.body.support.text).toBeDefined();
    });
  });

  test('Retrieve a single resource by ID', ({ given, when, then, and }) => {
    given('the API client is initialised', () => {
      api = new ApiClient();
    });

    when('I send a GET request for resource with ID 2', async () => {
      response = await api.get(API_ENDPOINTS.SINGLE_RESOURCE(2));
    });

    then('the response status should be 200', () => {
      expectStatus(response.status, 200);
      response = parseResponse(response, singleResourceSchema);
    });

    and('the resource ID should be 2', () => {
      expectFieldEquals(response.body.data, 'id', 2);
    });

    and('the resource should have name, year, color, and pantone_value fields', () => {
      expect(response.body.data.name).toBeDefined();
      expect(response.body.data.year).toBeDefined();
      expect(response.body.data.color).toBeDefined();
      expect(response.body.data.pantone_value).toBeDefined();
    });
  });

  test('Return 404 for a non-existent resource', ({ given, when, then }) => {
    given('the API client is initialised', () => {
      api = new ApiClient();
    });

    when('I send a GET request for resource with ID 9999', async () => {
      response = await api.get(API_ENDPOINTS.SINGLE_RESOURCE(9999));
    });

    then('the response status should be 404', () => {
      expectStatus(response.status, 404);
    });
  });
});
