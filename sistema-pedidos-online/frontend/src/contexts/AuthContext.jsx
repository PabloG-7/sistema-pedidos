import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
        
        // Verificar com backend em segundo plano
        try {
          await api.get('/auth/me', { timeout: 5000 });
        } catch (error) {
          console.log('Token verification failed, using cached user');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email, password) => {
    try {
      setIsAuthenticating(true);
      const response = await api.post('/auth/login', { 
        email, 
        password 
      }, {
        timeout: 10000
      });
      
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 
                     error.code === 'ECONNABORTED' ? 'Servidor demorou para responder' : 
                     'Erro ao fazer login. Tente novamente.';
      return { success: false, message };
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      setIsAuthenticating(true);
      const response = await api.post('/auth/register', { 
        name, 
        email, 
        password 
      }, {
        timeout: 10000
      });
      
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      const message = error.response?.data?.message || 
                     error.code === 'ECONNABORTED' ? 'Servidor demorou para responder' : 
                     'Erro ao criar conta. Tente novamente.';
      return { success: false, message };
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticating,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};