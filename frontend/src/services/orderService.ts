import api from './api';
import type { Order, OrderInput } from '../types';

export const orderService = {
  create: async (data: OrderInput): Promise<Order> => {
    const response = await api.post<Order>('/api/orders', data);
    return response.data;
  },
};