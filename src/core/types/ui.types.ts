export interface UserCredentials {
  username: string;
  password: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface CartItem {
  name: string;
  price: string;
  quantity?: number;
}

export interface ProductItem {
  name: string;
  description: string;
  price: string;
}
