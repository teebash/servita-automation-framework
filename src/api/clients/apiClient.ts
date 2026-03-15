import { testConfig } from '../../config';
import { z } from 'zod';

interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

interface ApiResult<T> {
  status: number;
  body: T;
  headers: Headers;
}

/**
 * Validates an ApiResult body against a Zod schema at runtime.
 * Returns the same result with a fully validated and typed body.
 * Throws a ZodError with clear field-level messages if the response
 * shape doesn't match the schema.
 */
export function parseResponse<T>(
  result: ApiResult<unknown>,
  schema: z.ZodType<T>,
): ApiResult<T> {
  return {
    ...result,
    body: schema.parse(result.body),
  };
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly timeout: number;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? testConfig.api.baseUrl;

    const apiKey = testConfig.api.apiKey;
    if (!apiKey) {
      throw new Error(
        'REQRES_API_KEY is not set. Get a free key at https://reqres.in/ and export REQRES_API_KEY=<your-key>',
      );
    }

    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-api-key': apiKey,
      'User-Agent': testConfig.api.userAgent,
    };
    this.timeout = testConfig.api.timeout;
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResult<T>> {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  async post<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<ApiResult<T>> {
    return this.request<T>('POST', endpoint, body, options);
  }

  async put<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<ApiResult<T>> {
    return this.request<T>('PUT', endpoint, body, options);
  }

  async patch<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<ApiResult<T>> {
    return this.request<T>('PATCH', endpoint, body, options);
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResult<T>> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResult<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = { ...this.defaultHeaders, ...options?.headers };
    const timeout = options?.timeout ?? this.timeout;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      let responseBody: T;
      if (response.status === 204) {
        responseBody = {} as T;
      } else {
        const contentType = response.headers.get('content-type') ?? '';
        if (contentType.includes('application/json')) {
          responseBody = (await response.json()) as T;
        } else {
          const text = await response.text();
          throw new Error(
            `Expected JSON response but received ${contentType}. Status: ${response.status}. Body: ${text.substring(0, 200)}`,
          );
        }
      }

      return {
        status: response.status,
        body: responseBody,
        headers: response.headers,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
