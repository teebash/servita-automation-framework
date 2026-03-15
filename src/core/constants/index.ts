export const URLS = {
  LOGIN: '/',
  INVENTORY: '/inventory.html',
  CART: '/cart.html',
  CHECKOUT_STEP_ONE: '/checkout-step-one.html',
  CHECKOUT_STEP_TWO: '/checkout-step-two.html',
  CHECKOUT_COMPLETE: '/checkout-complete.html',
} as const;

export const USERS = {
  STANDARD: { username: 'standard_user', password: 'secret_sauce' },
  LOCKED_OUT: { username: 'locked_out_user', password: 'secret_sauce' },
  PROBLEM: { username: 'problem_user', password: 'secret_sauce' },
  PERFORMANCE_GLITCH: { username: 'performance_glitch_user', password: 'secret_sauce' },
  ERROR: { username: 'error_user', password: 'secret_sauce' },
  VISUAL: { username: 'visual_user', password: 'secret_sauce' },
} as const;

export const MESSAGES = {
  ORDER_COMPLETE_HEADER: 'Thank you for your order!',
  ORDER_COMPLETE_TEXT: 'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
  CHECKOUT_COMPLETE_TITLE: 'Checkout: Complete!',
} as const;

export const API_ENDPOINTS = {
  USERS: '/api/users',
  SINGLE_USER: (id: number) => `/api/users/${id}`,
  REGISTER: '/api/register',
  LOGIN: '/api/login',
  RESOURCES: '/api/unknown',
  SINGLE_RESOURCE: (id: number) => `/api/unknown/${id}`,
} as const;
