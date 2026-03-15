import { faker } from '@faker-js/faker';
import type { CheckoutInfo } from '../types';

export function generateCheckoutInfo(): CheckoutInfo {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode('#####'),
  };
}

export function generateRandomEmail(): string {
  return faker.internet.email();
}

export function generateRandomName(): string {
  return faker.person.fullName();
}

export function generateRandomJob(): string {
  return faker.person.jobTitle();
}
