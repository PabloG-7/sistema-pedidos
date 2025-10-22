import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Crown, Sun, Moon } from 'lucide-react';
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
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-900 dark:via-amber-900/20 dark:to-yellow-900/20 transition-colors duration-500">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-800/40 transition-colors duration-300"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          ) : (
            <Moon className="h-5 w-5 text-amber-600" />
          )}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl animate-float">
            <Crown className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-4xl font-bold text-gradient bg-gradient-to-r from-amber-600 to-yellow-700 dark:from-amber-400 dark:to-yellow-500">
          RoyalSystem
        </h2>
        <p className="mt-2 text-center text-sm text-amber-600 dark:text-amber-400">
          Entre na sua conta premium
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card bg-white/90 backdrop-blur-sm border-amber-200 dark:bg-gray-800/90 dark:border-amber-700/30 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-700 dark:text-amber-300">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field border-amber-300 dark:border-amber-600"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-amber-700 dark:text-amber-300">
                Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field border-amber-300 dark:border-amber-600 pr-10"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-amber-400 hover:text-amber-600 dark:hover:text-amber-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 flex items-center justify-center py-3 text-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Entrando...
                  </>
                ) : (
                  'Entrar na Conta'
                )}
              </button>
            </div>

            <div className="text-center">
              <span className="text-sm text-amber-600 dark:text-amber-400">
                Não tem uma conta?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200"
                >
                  Crie uma conta
                </Link>
              </span>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <div className="text-xs text-amber-500 dark:text-amber-600 space-y-1">
            <p><strong>Admin:</strong> admin@sistema.com / admin123</p>
            <p><strong>Usuário:</strong> Crie uma conta para testar</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;