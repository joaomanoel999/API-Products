import api from './api';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types';

export const authService = {
  login: async (data: LoginRequest): Promise<void> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', response.data.role); // NOVO
  },

  register: async (data: RegisterRequest): Promise<void> => {
    await api.post('/auth/register', data);
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // NOVO
  },

  isLogged: (): boolean => {
    return localStorage.getItem('token') !== null;
  },

  // NOVO: diz se quem está logado é ADMIN
  isAdmin: (): boolean => {
    return localStorage.getItem('role') === 'ADMIN';
  },
};