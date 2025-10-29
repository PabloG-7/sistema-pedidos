import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Rocket, Sparkles, Zap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-md w-full space-y-8 z-10">
        {/* Header */}
        <div className="text-center animate-fade-up">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl animate-glow">
              <Rocket className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-5xl font-black gradient-text mb-4">
            PGSystem
          </h2>
          <p className="text-xl text-white/80 font-medium">
            Entre no futuro dos pedidos
          </p>
        </div>

        {/* Login Form */}
        <div className="card animate-slide-in">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-6 py-4 rounded-2xl text-lg font-medium backdrop-blur-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-lg font-semibold text-white mb-3">
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
                className="input-field text-lg"
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-semibold text-white mb-3">
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
                  className="input-field text-lg pr-12"
                  placeholder="Sua senha"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white transition-colors duration-300"
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
                className="w-full btn-primary flex items-center justify-center py-4 text-lg font-bold disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <div className="spinner-modern h-6 w-6"></div>
                    <span>Iniciando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Zap className="h-6 w-6" />
                    <span>Acessar Sistema</span>
                    <Sparkles className="h-5 w-5" />
                  </div>
                )}
              </button>
            </div>

            <div className="text-center pt-6 border-t border-white/20">
              <span className="text-lg text-white/60">
                Novo aqui?{' '}
                <Link
                  to="/register"
                  className="font-bold text-white hover:text-purple-300 transition-all duration-300"
                >
                  Criar conta
                </Link>
              </span>
            </div>

            {/* Credenciais de teste */}
            <div className="text-center">
              <div className="text-sm text-white/40 space-y-2 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10">
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