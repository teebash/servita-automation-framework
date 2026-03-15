import { ApiClient, parseResponse } from '../../api/clients';
import { expectStatus } from '../../api/assertions';
import { API_ENDPOINTS } from '../../core/constants';
import { registerResponseSchema, loginResponseSchema } from '../../core/schemas';
import { faker } from '@faker-js/faker';

describe('Auth API', () => {
  const api = new ApiClient();

  describe('POST /api/register', () => {
    it('@smoke @regression should register a user with valid credentials', async () => {
      const payload = { email: 'eve.holt@reqres.in', password: 'pistol' };

      const raw = await api.post(API_ENDPOINTS.REGISTER, payload);
      expectStatus(raw.status, 200);

      const response = parseResponse(raw, registerResponseSchema);
      expect(typeof response.body.id).toBe('number');
      expect(typeof response.body.token).toBe('string');
    });

    it('@regression should return 400 when password is missing', async () => {
      const payload = { email: 'eve.holt@reqres.in' };

      const response = await api.post<{ error: string }>(API_ENDPOINTS.REGISTER, payload);

      expectStatus(response.status, 400);
      expect(response.body.error).toBeDefined();
    });

    it('@regression should return 400 for an unsupported user', async () => {
      const payload = { email: faker.internet.email(), password: faker.internet.password() };

      const response = await api.post<{ error: string }>(API_ENDPOINTS.REGISTER, payload);

      expectStatus(response.status, 400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/login', () => {
    it('@smoke @regression should login with valid credentials', async () => {
      const payload = { email: 'eve.holt@reqres.in', password: 'cityslicka' };

      const raw = await api.post(API_ENDPOINTS.LOGIN, payload);
      expectStatus(raw.status, 200);

      const response = parseResponse(raw, loginResponseSchema);
      expect(typeof response.body.token).toBe('string');
    });

    it('@regression should return 400 when password is missing', async () => {
      const payload = { email: 'eve.holt@reqres.in' };

      const response = await api.post<{ error: string }>(API_ENDPOINTS.LOGIN, payload);

      expectStatus(response.status, 400);
      expect(response.body.error).toBeDefined();
    });
  });
});
