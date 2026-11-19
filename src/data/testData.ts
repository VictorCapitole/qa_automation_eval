import path from 'node:path';

export interface Credentials {
  username: string;
  password: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface Product {
  name: string;
  price: string;
}

/** Credenciales públicas de demostración publicadas en la página de login de SauceDemo. */
export const users = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
  wrongPassword: { username: 'standard_user', password: 'not_the_password' },
} satisfies Record<string, Credentials>;

export const products = {
  backpack: { name: 'Sauce Labs Backpack', price: '$29.99' },
} satisfies Record<string, Product>;

export const customer: CustomerInfo = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  postalCode: '28001',
};

/** Sesión autenticada generada por tests/auth.setup.ts y reutilizada por el proyecto frontend. */
export const STORAGE_STATE = path.resolve(__dirname, '../../.auth/user.json');
