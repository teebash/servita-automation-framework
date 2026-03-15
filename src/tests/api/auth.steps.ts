import { loadFeature, defineFeature } from 'jest-cucumber';
import { ApiClient, parseResponse } from '../../api/clients';
import { expectStatus } from '../../api/assertions';
import { API_ENDPOINTS } from '../../core/constants';
import { registerResponseSchema, loginResponseSchema } from '../../core/schemas';
import { faker } from '@faker-js/faker';

const feature = loadFeature('./src/tests/api/features/auth.feature');

defineFeature(feature, (test) => {
  let api: ApiClient;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let response: any;

  test('Register a user with valid credentials', ({ given, when, then, and }) => {
    given('the API client is initialised', () => {
      api = new ApiClient();
    });

    when(/^I send a POST request to register with email "(.*)" and password "(.*)"$/, async (email: string, password: string) => {
      response = await api.post(API_ENDPOINTS.REGISTER, { email, password });
    });

    then('the response status should be 200', () => {
      expectStatus(response.status, 200);
    });

    and('the response should contain a numeric id and a token string', () => {
      const parsed = parseResponse(response, registerResponseSchema);
      expect(typeof parsed.body.id).toBe('number');
      expect(typeof parsed.body.token).toBe('string');
    });
  });

  test('Registration fails when password is missing', ({ given, when, then, and }) => {
    given('the API client is initialised', () => {
      api = new ApiClient();
    });

    when(/^I send a POST request to register with email "(.*)" and no password$/, async (email: string) => {
      response = await api.post<{ error: string }>(API_ENDPOINTS.REGISTER, { email });
    });

    then('the response status should be 400', () => {
      expectStatus(response.status, 400);
    });

    and('the response should contain an error message', () => {
      expect(response.body.error).toBeDefined();
    });
  });

  test('Registration fails for an unsupported user', ({ given, when, then, and }) => {
    given('the API client is initialised', () => {
      api = new ApiClient();
    });

    when('I send a POST request to register with a random email and password', async () => {
      const payload = { email: faker.internet.email(), password: faker.internet.password() };
      response = await api.post<{ error: string }>(API_ENDPOINTS.REGISTER, payload);
    });

    then('the response status should be 400', () => {
      expectStatus(response.status, 400);
    });

    and('the response should contain an error message', () => {
      expect(response.body.error).toBeDefined();
    });
  });

  test('Login with valid credentials', ({ given, when, then, and }) => {
    given('the API client is initialised', () => {
      api = new ApiClient();
    });

    when(/^I send a POST request to login with email "(.*)" and password "(.*)"$/, async (email: string, password: string) => {
      response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
    });

    then('the response status should be 200', () => {
      expectStatus(response.status, 200);
    });

    and('the response should contain a token string', () => {
      const parsed = parseResponse(response, loginResponseSchema);
      expect(typeof parsed.body.token).toBe('string');
    });
  });

  test('Login fails when password is missing', ({ given, when, then, and }) => {
    given('the API client is initialised', () => {
      api = new ApiClient();
    });

    when(/^I send a POST request to login with email "(.*)" and no password$/, async (email: string) => {
      response = await api.post<{ error: string }>(API_ENDPOINTS.LOGIN, { email });
    });

    then('the response status should be 400', () => {
      expectStatus(response.status, 400);
    });

    and('the response should contain an error message', () => {
      expect(response.body.error).toBeDefined();
    });
  });
});
