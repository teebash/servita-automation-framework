import { z } from 'zod';
import {
  userSchema,
  resourceSchema,
  createUserRequestSchema,
  createUserResponseSchema,
  updateUserResponseSchema,
  registerRequestSchema,
  registerResponseSchema,
  loginResponseSchema,
  paginatedUsersSchema,
  singleUserSchema,
  paginatedResourcesSchema,
  singleResourceSchema,
} from '../schemas';

// ── Generic wrappers (structural — not tied to a specific schema) ───
export interface PaginatedResponse<T> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: T[];
  support: { url: string; text: string };
}

export interface SingleResponse<T> {
  data: T;
  support: { url: string; text: string };
}

// ── Types inferred from Zod schemas (single source of truth) ────────
export type UserResponse = z.infer<typeof userSchema>;
export type ResourceResponse = z.infer<typeof resourceSchema>;
export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
export type CreateUserResponse = z.infer<typeof createUserResponseSchema>;
export type UpdateUserResponse = z.infer<typeof updateUserResponseSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;

// ── Composed types (paginated/single wrappers with specific data) ───
export type PaginatedUsersResponse = z.infer<typeof paginatedUsersSchema>;
export type SingleUserResponse = z.infer<typeof singleUserSchema>;
export type PaginatedResourcesResponse = z.infer<typeof paginatedResourcesSchema>;
export type SingleResourceResponse = z.infer<typeof singleResourceSchema>;
