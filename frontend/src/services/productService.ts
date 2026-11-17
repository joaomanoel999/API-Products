import api from './api';
import type { Product, ProductInput } from '../types';

export const productService = {
  list: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/api/products');
    return response.data;
  },

  create: async (data: ProductInput): Promise<Product> => {
    const response = await api.post<Product>('/api/products', data);
    return response.data;
  },

  // NOVO: atualiza um produto pelo id
  update: async (id: number, data: ProductInput): Promise<Product> => {
    const response = await api.put<Product>(`/api/products/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/api/products/${id}`);
  },
};