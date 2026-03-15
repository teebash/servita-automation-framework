import type { CreateUserRequest } from '../../core/types';
import { generateRandomName, generateRandomJob } from '../../core/utils';

export function buildCreateUserPayload(overrides?: Partial<CreateUserRequest>): CreateUserRequest {
  return {
    name: overrides?.name ?? generateRandomName(),
    job: overrides?.job ?? generateRandomJob(),
  };
}
