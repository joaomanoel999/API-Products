import api from './api';
import type { Client, ClientInput } from '../types';

export const clientService = {
  list: async (): Promise<Client[]> => {
    const response = await api.get<Client[]>('/api/clients');
    return response.data;
  },

  create: async (data: ClientInput): Promise<Client> => {
    const response = await api.post<Client>('/api/clients', data);
    return response.data;
  },
};