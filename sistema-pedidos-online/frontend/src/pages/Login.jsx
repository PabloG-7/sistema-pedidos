import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Rocket, Eye, EyeOff, Sparkles, Package } from 'lucide-react';

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
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-pattern"></div>
      
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center text-white px-16">
          <div className="text-center space-y-6">
            <div className="flex justify-center items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Rocket className="h-12 w-12" />
              </div>
              <div>
                <h1 className="text-5xl font-bold">Orion</h1>
                <p className="text-indigo-100 text-lg">Sistema de Pedidos</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-white/80">
                <Sparkles className="h-5 w-5" />
                <span className="text-lg">Experiência moderna e intuitiva</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <Package className="h-5 w-5" />
                <span className="text-lg">Gestão completa de pedidos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Branding */}
          <div className="lg:hidden flex justify-center items-center space-x-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Orion</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Sistema de Pedidos</p>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Bem-vindo de volta
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Entre na sua conta para continuar
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
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
                    className="input-field pl-11 focus-ring"
                    placeholder="seu@email.com"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="h-5 w-5 text-slate-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
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
                    className="input-field pl-11 pr-10 focus-ring"
                    placeholder="Sua senha"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="h-5 w-5 text-slate-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center space-x-2 focus-ring"
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="h-5 w-5" />
                    <span>Entrar na Plataforma</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Não tem uma conta?{' '}
                  <Link
                    to="/register"
                    className="font-semibold gradient-text hover:underline transition-all duration-300"
                  >
                    Criar conta agora
                  </Link>
                </span>
              </div>
            </form>

            {/* Demo Accounts */}
            <div className="border-t border-slate-200 dark:border-gray-700 pt-6">
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2 text-center">
                <p><strong>Admin Demo:</strong> admin@sistema.com / admin123</p>
                <p><strong>Usuário:</strong> Crie uma conta para testar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;