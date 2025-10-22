import axios from 'axios';

// ✅ CORREÇÃO: URL correta
const BASE_URL = import.meta.env.VITE_API_URL || 'https://sistema-pedidos-backend.onrender.com/api';

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

// ✅ CORREÇÃO MELHORADA: Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // ✅ CORREÇÃO: Verificar se é uma requisição que precisa de token
    if (token && !config.url.includes('/auth/')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('🔧 Fazendo requisição para:', config.url);
    console.log('🔧 Headers Authorization:', config.headers.Authorization ? 'PRESENTE' : 'AUSENTE');
    
    return config;
  },
  (error) => {
    console.error('❌ Erro no interceptor de request:', error);
    return Promise.reject(error);
  }
);

// ✅ CORREÇÃO MELHORADA: Interceptor de resposta
api.interceptors.response.use(
  (response) => {
    console.log('✅ Resposta recebida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log('❌ Erro na requisição:', error.response?.status, error.config?.url);
    console.log('❌ Detalhes do erro:', error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('🔐 Token inválido ou expirado - redirecionando para login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // ✅ CORREÇÃO: Só redirecionar se não estiver na página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // ✅ CORREÇÃO: Retornar erro formatado
    return Promise.reject({
      message: error.response?.data?.message || 'Erro de conexão',
      status: error.response?.status,
      data: error.response?.data
    });
  }
);