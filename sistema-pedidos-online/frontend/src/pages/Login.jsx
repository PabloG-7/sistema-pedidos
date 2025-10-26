// pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Cpu, Zap, Binary, Terminal } from 'lucide-react';

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
      setError('PREENCHA TODOS OS CAMPOS');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/', { replace: true });
      } else {
        setError(result.message.toUpperCase());
      }
    } catch (error) {
      setError('ERRO INESPERADO. TENTE NOVAMENTE.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-circuit">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-matrix"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl animate-morph"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-morph" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl animate-morph" style={{animationDelay: '4s'}}></div>

      {/* Terminal Header */}
      <div className="absolute top-8 left-8">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-neon-pink rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-neon-blue rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-neon-pink rounded-sm blur-lg animate-pulse-glow"></div>
            <div className="relative w-28 h-28 border-4 border-neon-pink flex items-center justify-center">
              <Cpu className="h-12 w-12 text-neon-pink" />
            </div>
          </div>
        </div>
        <h2 className="mt-8 text-center text-6xl font-orbitron font-bold rgb-text glitch-text" data-text="PGSYSTEM">
          PGSYSTEM
        </h2>
        <p className="mt-6 text-center text-xl font-rajdhani text-gray-300">
          ACESSE O SISTEMA
        </p>
      </div>

      <div className="relative mt-12 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card-cyber border-2 border-neon-blue hover:border-neon-green transition-all duration-500">
          <div className="flex items-center space-x-3 mb-8">
            <Terminal className="h-6 w-6 text-neon-green" />
            <span className="font-orbitron text-neon-green text-lg">TERMINAL DE ACESSO</span>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="border-2 border-neon-pink p-4">
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-neon-pink" />
                  <span className="font-orbitron text-neon-pink text-sm">{error}</span>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-orbitron text-neon-blue mb-4 uppercase tracking-wider">
                EMAIL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Binary className="h-5 w-5 text-neon-blue" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-cyber pl-12"
                  placeholder="USUARIO@DOMINIO.COM"
                  disabled={loading}
                  style={{textTransform: 'uppercase'}}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-orbitron text-neon-blue mb-4 uppercase tracking-wider">
                SENHA
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Zap className="h-5 w-5 text-neon-blue" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-cyber pl-12 pr-12"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neon-blue hover:text-neon-green transition-colors duration-300"
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
                className="w-full btn-cyber flex items-center justify-center py-4 text-lg font-orbitron disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="spinner-cyber h-6 w-6 border-2 mr-4"></div>
                    <span>ACESSANDO...</span>
                  </div>
                ) : (
                  <>
                    <span>INICIAR SESSÃO</span>
                    <Binary className="h-5 w-5 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-8 border-t border-neon-blue/30">
              <span className="text-sm font-rajdhani text-gray-400">
                NOVO USUÁRIO?{' '}
                <Link
                  to="/register"
                  className="font-orbitron text-neon-green hover:text-neon-blue transition-all duration-300 hover:underline"
                >
                  CRIAR CONTA
                </Link>
              </span>
            </div>

            {/* Credenciais de teste */}
            <div className="text-center">
              <div className="text-xs font-rajdhani text-gray-500 space-y-2 border-2 border-neon-purple/30 p-4">
                <p><strong className="text-neon-green">ADMIN:</strong> admin@sistema.com / admin123</p>
                <p><strong className="text-neon-blue">USUÁRIO:</strong> CRIE UMA CONTA</p>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Terminal */}
      <div className="absolute bottom-8 left-8 right-8">
        <div className="flex justify-between items-center">
          <div className="font-orbitron text-xs text-neon-blue">
            SYSTEM v2.0.4 | STATUS: <span className="text-neon-green">ONLINE</span>
          </div>
          <div className="font-rajdhani text-xs text-gray-500">
            {new Date().toLocaleString('pt-BR')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;