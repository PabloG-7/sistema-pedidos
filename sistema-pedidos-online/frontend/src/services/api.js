// services/api.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://sistema-pedidos-backend.onrender.com/api';

// Cache simples para evitar requests duplicados
const requestCache = new Map();

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 segundos
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
    
    // Adicionar timestamp para evitar cache
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta otimizado
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Só redirecionar se não estiver já na página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject({
      message: error.response?.data?.message || 
              error.code === 'ECONNABORTED' ? 'Timeout - servidor não respondeu' : 
              'Erro de conexão',
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

// Função para limpar cache
export const clearApiCache = () => {
  requestCache.clear();
};