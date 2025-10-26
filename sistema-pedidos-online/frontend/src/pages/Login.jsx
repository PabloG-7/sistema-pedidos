// pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, BarChart3, Sun, Moon, Sparkles, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/', { replace: true });
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Erro inesperado. Tente novamente.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 opacity-50"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={toggleTheme}
          className="p-3 bg-white/80 backdrop-blur-sm border-2 border-white/50 text-slate-600 hover:text-slate-900 dark:bg-slate-800/80 dark:border-slate-700/50 dark:text-slate-400 dark:hover:text-slate-100 rounded-2xl transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-3xl"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl animate-glow">
            <Sparkles className="h-12 w-12 text-white" />
          </div>
        </div>
        <h2 className="mt-8 text-center text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          PGSystem
        </h2>
        <p className="mt-4 text-center text-lg text-slate-600 dark:text-slate-400 font-medium">
          Entre na sua conta
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="card bg-white/80 backdrop-blur-sm border-2 border-white/50 dark:bg-slate-800/80 dark:border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border-2 border-red-400/30 text-red-700 dark:text-red-400 px-5 py-4 rounded-2xl text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full text-lg"
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full text-lg pr-12"
                  placeholder="Sua senha"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {loading ? (
                  <div className="flex items-center space-x-3 relative z-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 relative z-10">
                    <Zap className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>Entrar</span>
                  </div>
                )}
              </button>
            </div>

            <div className="text-center pt-6 border-t-2 border-slate-200/80 dark:border-slate-700/50">
              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Não tem uma conta?{' '}
                <Link
                  to="/register"
                  className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 hover:underline"
                >
                  Criar conta
                </Link>
              </span>
            </div>

            {/* Credenciais de teste */}
            <div className="text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2 bg-slate-100/80 dark:bg-slate-700/50 backdrop-blur-sm p-4 rounded-2xl border-2 border-slate-200/50 dark:border-slate-600/50">
                <p className="font-semibold"><strong>Admin:</strong> admin@sistema.com / admin123</p>
                <p className="font-semibold"><strong>Usuário:</strong> Crie uma conta</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;