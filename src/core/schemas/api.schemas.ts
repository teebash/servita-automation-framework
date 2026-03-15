import { z } from 'zod';

// ── Reusable wrapper schemas ────────────────────────────────────────

const supportSchema = z.object({
  url: z.string(),
  text: z.string(),
});

export function paginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    page: z.number(),
    per_page: z.number(),
    total: z.number(),
    total_pages: z.number(),
    data: z.array(itemSchema),
    support: supportSchema,
  });
}

export function singleSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    data: itemSchema,
    support: supportSchema,
  });
}

// ── Resource schemas ────────────────────────────────────────────────

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  avatar: z.string(),
});

export const resourceSchema = z.object({
  id: z.number(),
  name: z.string(),
  year: z.number(),
  color: z.string(),
  pantone_value: z.string(),
});

// ── Request/Response schemas ────────────────────────────────────────

export const createUserRequestSchema = z.object({
  name: z.string(),
  job: z.string(),
});

export const createUserResponseSchema = z.object({
  name: z.string(),
  job: z.string(),
  id: z.string(),
  createdAt: z.string(),
});

export const updateUserResponseSchema = z.object({
  name: z.string(),
  job: z.string(),
  updatedAt: z.string(),
});

export const registerRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const registerResponseSchema = z.object({
  id: z.number(),
  token: z.string(),
});

export const loginResponseSchema = z.object({
  token: z.string(),
});

// ── Composed schemas (used directly in tests) ───────────────────────

export const paginatedUsersSchema = paginatedSchema(userSchema);
export const singleUserSchema = singleSchema(userSchema);
export const paginatedResourcesSchema = paginatedSchema(resourceSchema);
export const singleResourceSchema = singleSchema(resourceSchema);
