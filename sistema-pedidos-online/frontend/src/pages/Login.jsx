import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Package, Eye, EyeOff, Sparkles } from 'lucide-react';

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
    setLoading(true);
    setError('');

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
              <div className="p-2 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-gradient">PedidosOnline</h2>
                <p className="text-dark-500 text-sm">Sistema de Gestão</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-display font-bold text-dark-900">
              Bem-vindo de volta
            </h2>
            <p className="mt-2 text-dark-600">
              Entre na sua conta para continuar
            </p>
          </div>

          <div className="mt-8">
            <div className="card-glass">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-dark-700 mb-2">
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
                    className="input-field"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-dark-700 mb-2">
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
                      className="input-field pr-10"
                      placeholder="Sua senha"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-dark-400 hover:text-primary-600"
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
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Entrando...
                      </>
                    ) : (
                      'Entrar na conta'
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <span className="text-dark-500 text-sm">
                    Não tem uma conta?{' '}
                    <Link
                      to="/register"
                      className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
                    >
                      Crie uma agora
                    </Link>
                  </span>
                </div>
              </form>
            </div>

            {/* Demo credentials */}
            <div className="mt-6 text-center">
              <div className="card">
                <p className="text-sm text-dark-600 mb-2">👑 Credenciais de Demonstração</p>
                <div className="text-xs text-dark-500 space-y-1">
                  <p><strong>Admin:</strong> admin@sistema.com / admin123</p>
                  <p><strong>Usuário:</strong> Crie uma conta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-purple-500/10 to-pink-500/10"></div>
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-300/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative flex flex-col justify-center items-center w-full px-12">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-primary-500 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
                <Package className="h-16 w-16 text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl font-display font-bold text-dark-900 mb-4">
              Sistema de Pedidos Moderno
            </h3>
            <p className="text-dark-600 text-lg leading-relaxed">
              Gerencie seus pedidos de forma eficiente com nossa plataforma intuitiva e poderosa.
            </p>
            
            <div className="mt-8 flex justify-center space-x-3">
              {['🚀', '💫', '🎯'].map((emoji, index) => (
                <div 
                  key={index}
                  className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl shadow-lg animate-float"
                  style={{ animationDelay: `${index * 1}s` }}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;