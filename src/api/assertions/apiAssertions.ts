export function expectStatus(actual: number, expected: number): void {
  expect(actual).toBe(expected);
}

export function expectFieldExists<T>(body: T, field: keyof T): void {
  expect(body[field]).toBeDefined();
}

export function expectFieldEquals<T>(body: T, field: keyof T, expected: T[keyof T]): void {
  expect(body[field]).toBe(expected);
}

export function expectArrayNotEmpty<T>(arr: T[]): void {
  expect(arr.length).toBeGreaterThan(0);
}

export function expectArrayLength<T>(arr: T[], expectedLength: number): void {
  expect(arr).toHaveLength(expectedLength);
}

export function expectPaginatedResponse<T>(body: {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: T[];
}): void {
  expect(body.page).toBeDefined();
  expect(body.per_page).toBeDefined();
  expect(body.total).toBeDefined();
  expect(body.total_pages).toBeDefined();
  expect(Array.isArray(body.data)).toBe(true);
}
