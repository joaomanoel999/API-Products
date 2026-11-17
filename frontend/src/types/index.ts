export type UserRole = 'ADMIN' | 'USER';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: UserRole; // NOVO
}

export interface RegisterRequest {
  username: string;
  password: string;
  role: UserRole;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string | null;
}

export type ProductInput = Omit<Product, 'id'>;

export interface Category {
  id: number;
  name: string;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  clientId: number;
}
export interface CartItem {
  product: Product;
  quantity: number;
}
export type ClientInput = Omit<Client, 'id'>;

export interface OrderInput {
  clientId: number;
  totalAmount: number;
}