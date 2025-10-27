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
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 transition-colors duration-500 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={toggleTheme}
          className="p-3 bg-white/80 backdrop-blur-sm border border-white/20 text-slate-600 hover:text-slate-900 dark:bg-slate-800/80 dark:border-slate-700/20 dark:text-slate-400 dark:hover:text-slate-100 rounded-2xl transition-all duration-500 hover:scale-110 shadow-2xl hover:shadow-3xl"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl glow-effect relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 rounded-3xl transform rotate-45 scale-150"></div>
            <BarChart3 className="h-12 w-12 text-white relative z-10" />
          </div>
        </div>
        <h2 className="mt-8 text-center text-5xl font-bold gradient-text">
          PGSystem
        </h2>
        <p className="mt-4 text-center text-xl text-slate-600 dark:text-slate-400 font-medium">
          Entre na sua conta
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/20 dark:border-slate-700/20 shadow-2xl hover:shadow-3xl transition-all duration-500">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 px-6 py-4 rounded-2xl text-lg font-medium backdrop-blur-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">
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
                className="input-field w-full text-lg py-4"
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">
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
                  className="input-field w-full text-lg py-4 pr-12"
                  placeholder="Sua senha"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-300"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500"
              >
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <div className="spinner-premium h-6 w-6 border-2"></div>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Zap className="h-6 w-6" />
                    <span>Entrar</span>
                    <Sparkles className="h-5 w-5" />
                  </div>
                )}
              </button>
            </div>

            <div className="text-center pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
              <span className="text-lg text-slate-600 dark:text-slate-400">
                Não tem uma conta?{' '}
                <Link
                  to="/register"
                  className="font-bold gradient-text hover:bg-pos-100 transition-all duration-500"
                >
                  Criar conta
                </Link>
              </span>
            </div>

            {/* Credenciais de teste */}
            <div className="text-center">
              <div className="text-sm text-slate-500 dark:text-slate-400 space-y-2 bg-slate-100/50 dark:bg-slate-700/50 p-4 rounded-2xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50">
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