import { loadFeature, defineFeature } from 'jest-cucumber';
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

const feature = loadFeature('./src/tests/api/features/users.feature');

defineFeature(feature, (test) => {
  let api: ApiClient;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let response: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let response2: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let payload: any;
  let customName: string;
  let customJob: string;

  test('Retrieve a paginated list of users', ({ given, when, then, and }) => {
    given('the API client is initialised', () => {
      api = new ApiClient();
    });

    when('I send a GET request to the users endpoint', async () => {
      response = await api.get(API_ENDPOINTS.USERS);
    });

    then('the response status should be 200', () => {
      expectStatus(response.status, 200);
    });

    and('the response should be a valid paginated list', () => {
      const parsed = parseResponse(response, paginatedUsersSchema);
      expectPaginatedResponse(parsed.body);
      response = parsed;
    });

    and('the list should contain users with 6 per page', () => {
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.per_page).toBe(6);
    });
  });

  test('Users response contains expected fields', ({ given, when, then }) => {
    given('the API client is initialised', () => {
      api = new ApiClient();
    });

    when('I send a GET request to the users endpoint', async () => {
      response = await api.get(API_ENDPOINTS.USERS);
    });

    then('each user should have id, email, first_name, last_name, and avatar fields', () => {
      const parsed = parseResponse(response, paginatedUsersSchema);
      const firstUser = parsed.body.data[0];
      expect(firstUser.id).toBeDefined();
      expect(firstUser.email).toBeDefined();
      expect(firstUser.first_name).toBeDefined();
      expect(firstUser.last_name).toBeDefined();
      expect(firstUser.avatar).toBeDefined();
    });
  });

  test('Paginate through users', ({ given, when, then, and }) => {
    given('the API client is initialised', () => {
      api = new ApiClient();
    });

    when('I send a GET request to users page 1', async () => {
      response = await api.get(`${API_ENDPOINTS.USERS}?page=1`);
      expectStatus(response.status, 200);
      response = parseResponse(response, paginatedUsersSchema);
    });

    and('I send a GET request to users page 2', async () => {
      response2 = await api.get(`${API_ENDPOINTS.USERS}?page=2`);
      expectStatus(response2.status, 200);
      response2 = parseResponse(response2, paginatedUsersSchema);
    });

    then('the pages should return different users', () => {
      expect(response.body.page).toBe(1);
      expect(response2.body.page).toBe(2);
      expect(response.body.data[0].id).not.toBe(response2.body.data[0].id);
    });
  });

  test('Retrieve a single user by ID', ({ given, when, then, and }) => {
    given('the API client is initialised', () => {
      api = new ApiClient();
    });

    when('I send a GET request for user with ID 2', async () => {
      response = await api.get(API_ENDPOINTS.SINGLE_USER(2));
    });

    then('the response status should be 200', () => {
      expectStatus(response.status, 200);
      response = parseResponse(response, singleUserSchema);
    });

    and('the user ID should be 2', () => {
      expectFieldEquals(response.body.data, 'id', 2);
    });

    and('the user should have email, first_name, last_name, and avatar fields', () => {
      expect(response.body.data.email).toBeDefined();
      expect(response.body.data.first_name).toBeDefined();
      expect(response.body.data.last_name).toBeDefined();
      expect(response.body.data.avatar).toBeDefined();
    });
  });

  test('Return 404 for a non-existent user', ({ given, when, then }) => {
    given('the API client is initialised', () => {
      api = new ApiClient();
    });

    when('I send a GET request for user with ID 9999', async () => {
      response = await api.get(API_ENDPOINTS.SINGLE_USER(9999));
    });

    then('the response status should be 404', () => {
      expectStatus(response.status, 404);
    });
  });

  test('Create a new user with generated data', ({ given, when, then, and }) => {
    given('the API client is initialised', () => {
      api = new ApiClient();
    });

    and('a user payload is built with generated data', () => {
      payload = buildCreateUserPayload();
    });

    when('I send a POST request to create the user', async () => {
      response = await api.post(API_ENDPOINTS.USERS, payload);
    });

    then('the response status should be 201', () => {
      expectStatus(response.status, 201);
      response = parseResponse(response, createUserResponseSchema);
    });

    and('the response should contain the submitted name and job', () => {
      expectFieldEquals(response.body, 'name', payload.name);
      expectFieldEquals(response.body, 'job', payload.job);
    });

    and('the response should include an id and createdAt timestamp', () => {
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
    });
  });

  test('Create a user with custom values', ({ given, when, then, and }) => {
    given('the API client is initialised', () => {
      api = new ApiClient();
    });

    and('a user payload is built with custom name and job', () => {
      customName = faker.person.fullName();
      customJob = faker.person.jobTitle();
      payload = buildCreateUserPayload({ name: customName, job: customJob });
    });

    when('I send a POST request to create the user', async () => {
      response = await api.post(API_ENDPOINTS.USERS, payload);
    });

    then('the response status should be 201', () => {
      expectStatus(response.status, 201);
      response = parseResponse(response, createUserResponseSchema);
    });

    and('the response should contain the submitted name and job', () => {
      expectFieldEquals(response.body, 'name', customName);
      expectFieldEquals(response.body, 'job', customJob);
    });
  });

  test('Update an existing user', ({ given, when, then, and }) => {
    given('the API client is initialised', () => {
      api = new ApiClient();
    });

    and('an update payload is built with a new name and job', () => {
      customName = faker.person.fullName();
      customJob = faker.person.jobTitle();
      payload = { name: customName, job: customJob };
    });

    when('I send a PUT request to update user with ID 2', async () => {
      response = await api.put(API_ENDPOINTS.SINGLE_USER(2), payload);
    });

    then('the response status should be 200', () => {
      expectStatus(response.status, 200);
      response = parseResponse(response, updateUserResponseSchema);
    });

    and('the response should contain the updated name and job', () => {
      expectFieldEquals(response.body, 'name', customName);
      expectFieldEquals(response.body, 'job', customJob);
    });

    and('the response should include an updatedAt timestamp', () => {
      expect(response.body.updatedAt).toBeDefined();
    });
  });
});
