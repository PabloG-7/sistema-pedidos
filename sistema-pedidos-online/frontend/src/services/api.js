import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// DEBUG - Verificar a URL configurada
console.log('🚀 =================================');
console.log('🚀 SISTEMA DE PEDIDOS - DEBUG');
console.log('🚀 VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('🚀 BASE_URL:', BASE_URL);
console.log('🚀 =================================');

export const authAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('🔧 Fazendo requisição para:', config.url);
    console.log('🔧 Headers:', config.headers);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => {
    console.log('✅ Resposta recebida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log('❌ Erro na requisição:', error.response?.status, error.config?.url);
    console.log('❌ Detalhes do erro:', error.response?.data);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);