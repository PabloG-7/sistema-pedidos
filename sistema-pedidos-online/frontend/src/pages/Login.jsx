import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Shield, Sun, Moon } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 transition-colors duration-500">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 transition-colors duration-300"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <Moon className="h-5 w-5 text-blue-600" />
          )}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl animate-float">
            <Shield className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-4xl font-bold text-gradient bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500">
          SecureSystem
        </h2>
        <p className="mt-2 text-center text-sm text-blue-600 dark:text-blue-400">
          Entre na sua conta segura
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card bg-white/90 backdrop-blur-sm border-blue-200 dark:bg-gray-800/90 dark:border-blue-700/30 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-700 dark:text-blue-300">
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
                  className="input-field border-blue-300 dark:border-blue-600"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-700 dark:text-blue-300">
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
                  className="input-field border-blue-300 dark:border-blue-600 pr-10"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
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
                className="w-full btn-primary bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center py-3 text-lg"
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
              <span className="text-sm text-blue-600 dark:text-blue-400">
                Não tem uma conta?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
                >
                  Crie uma conta
                </Link>
              </span>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <div className="text-xs text-blue-500 dark:text-blue-600 space-y-1">
            <p><strong>Admin:</strong> admin@sistema.com / admin123</p>
            <p><strong>Usuário:</strong> Crie uma conta para testar</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;