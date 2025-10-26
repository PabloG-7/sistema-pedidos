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
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-animated relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      {/* Theme Toggle Premium */}
      <div className="absolute top-8 right-8">
        <button
          onClick={toggleTheme}
          className="p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:text-white rounded-2xl transition-all duration-500 hover:scale-110 shadow-2xl hover:shadow-3xl"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-lg opacity-75 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <BarChart3 className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
        <h2 className="mt-8 text-center text-4xl font-bold gradient-text">
          PGSystem
        </h2>
        <p className="mt-4 text-center text-lg text-white/60">
          Entre na sua conta
        </p>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card border-0 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl shadow-2xl hover:shadow-3xl transition-all duration-500">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-6 py-4 rounded-2xl text-sm backdrop-blur-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-3">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12"
                  placeholder="seu@email.com"
                  disabled={loading}
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Zap className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-3">
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
                  className="input-field pl-12 pr-12"
                  placeholder="Sua senha"
                  disabled={loading}
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </div>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/60 transition-colors duration-300"
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
                className="w-full btn-primary flex items-center justify-center py-4 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="spinner-premium h-5 w-5 border-2 mr-3"></div>
                    Entrando...
                  </div>
                ) : (
                  <>
                    <span>Entrar</span>
                    <Sparkles className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-6 border-t border-white/10">
              <span className="text-sm text-white/60">
                Não tem uma conta?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-300 hover:to-purple-300 transition-all duration-300"
                >
                  Criar conta
                </Link>
              </span>
            </div>

            {/* Credenciais de teste premium */}
            <div className="text-center">
              <div className="text-xs text-white/40 space-y-2 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <p><strong className="text-white/80">Admin:</strong> admin@sistema.com / admin123</p>
                <p><strong className="text-white/80">Usuário:</strong> Crie uma conta</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;