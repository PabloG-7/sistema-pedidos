// services/api.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://sistema-pedidos-backend.onrender.com/api';

// Configuração otimizada com timeout reduzido
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000, // Reduzido para 8 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token && !config.url.includes('/auth/')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta otimizado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject({
      message: error.response?.data?.message || 'Erro de conexão',
      status: error.response?.status,
      data: error.response?.data
    });
  }
);