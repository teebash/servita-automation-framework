import { ApiClient, parseResponse } from '../../api/clients';
import { buildCreateUserPayload } from '../../api/builders';
import {
  expectStatus,
  expectFieldEquals,
  expectPaginatedResponse,
} from '../../api/assertions';
import { API_ENDPOINTS } from '../../core/constants';
import {
  paginatedUsersSchema,
  singleUserSchema,
  createUserResponseSchema,
  updateUserResponseSchema,
} from '../../core/schemas';
import { faker } from '@faker-js/faker';

describe('Users API', () => {
  const api = new ApiClient();

  describe('GET /api/users', () => {
    it('@smoke @regression should return a paginated list of users', async () => {
      const raw = await api.get(API_ENDPOINTS.USERS);
      expectStatus(raw.status, 200);

      const response = parseResponse(raw, paginatedUsersSchema);
      expectPaginatedResponse(response.body);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.per_page).toBe(6);
    });

    it('@regression should return users with expected fields', async () => {
      const raw = await api.get(API_ENDPOINTS.USERS);
      const response = parseResponse(raw, paginatedUsersSchema);

      const firstUser = response.body.data[0];
      // Schema validation already guarantees these fields exist and have correct types.
      // These explicit checks demonstrate the validated data is usable.
      expect(firstUser.id).toBeDefined();
      expect(firstUser.email).toBeDefined();
      expect(firstUser.first_name).toBeDefined();
      expect(firstUser.last_name).toBeDefined();
      expect(firstUser.avatar).toBeDefined();
    });

    it('@regression should support pagination via page query parameter', async () => {
      const raw1 = await api.get(`${API_ENDPOINTS.USERS}?page=1`);
      const raw2 = await api.get(`${API_ENDPOINTS.USERS}?page=2`);
      expectStatus(raw1.status, 200);
      expectStatus(raw2.status, 200);

      const page1 = parseResponse(raw1, paginatedUsersSchema);
      const page2 = parseResponse(raw2, paginatedUsersSchema);
      expect(page1.body.page).toBe(1);
      expect(page2.body.page).toBe(2);
      expect(page1.body.data[0].id).not.toBe(page2.body.data[0].id);
    });
  });

  describe('GET /api/users/:id', () => {
    it('@smoke @regression should return a single user by ID', async () => {
      const raw = await api.get(API_ENDPOINTS.SINGLE_USER(2));
      expectStatus(raw.status, 200);

      const response = parseResponse(raw, singleUserSchema);
      expectFieldEquals(response.body.data, 'id', 2);
      expect(response.body.data.email).toBeDefined();
      expect(response.body.data.first_name).toBeDefined();
      expect(response.body.data.last_name).toBeDefined();
      expect(response.body.data.avatar).toBeDefined();
    });

    it('@regression should return 404 for a non-existent user', async () => {
      const response = await api.get(API_ENDPOINTS.SINGLE_USER(9999));
      expectStatus(response.status, 404);
    });
  });

  describe('POST /api/users', () => {
    it('@smoke @regression should create a new user with generated data', async () => {
      const payload = buildCreateUserPayload();

      const raw = await api.post(API_ENDPOINTS.USERS, payload);
      expectStatus(raw.status, 201);

      const response = parseResponse(raw, createUserResponseSchema);
      expectFieldEquals(response.body, 'name', payload.name);
      expectFieldEquals(response.body, 'job', payload.job);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
    });

    it('@regression should create a user with custom values', async () => {
      const customName = faker.person.fullName();
      const customJob = faker.person.jobTitle();
      const payload = buildCreateUserPayload({ name: customName, job: customJob });

      const raw = await api.post(API_ENDPOINTS.USERS, payload);
      expectStatus(raw.status, 201);

      const response = parseResponse(raw, createUserResponseSchema);
      expectFieldEquals(response.body, 'name', customName);
      expectFieldEquals(response.body, 'job', customJob);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('@regression should update an existing user', async () => {
      const updatedName = faker.person.fullName();
      const updatedJob = faker.person.jobTitle();
      const payload = { name: updatedName, job: updatedJob };

      const raw = await api.put(API_ENDPOINTS.SINGLE_USER(2), payload);
      expectStatus(raw.status, 200);

      const response = parseResponse(raw, updateUserResponseSchema);
      expectFieldEquals(response.body, 'name', updatedName);
      expectFieldEquals(response.body, 'job', updatedJob);
      expect(response.body.updatedAt).toBeDefined();
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('@regression should delete a user and return 204', async () => {
      const response = await api.delete(API_ENDPOINTS.SINGLE_USER(2));
      expectStatus(response.status, 204);
    });
  });
});
