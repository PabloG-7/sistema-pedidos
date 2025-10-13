import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Eye, EyeOff, Shield, Sparkles } from 'lucide-react';

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

  // Generate floating particles
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    style: {
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 6}s`,
      animationDuration: `${3 + Math.random() * 4}s`
    }
  }));

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0 binary-bg"></div>
      
      {/* Floating Particles */}
      <div className="particles">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={particle.style}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 px-4">
        {/* Animated Logo */}
        <div className="text-center mb-12 animate-float3d">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/50 neon-glow">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-2xl blur-xl opacity-30"></div>
            </div>
            <div>
              <h1 className="text-6xl font-black neon-text mb-2">NEXUS</h1>
              <p className="text-gray-400 text-lg font-light tracking-widest">
                PREMIUM SYSTEM
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-md">
          <div className="luxury-card p-12 relative overflow-hidden">
            {/* Holographic Effect */}
            <div className="absolute -inset-1 holographic rounded-3xl"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Shield className="h-6 w-6 text-cyan-400" />
                  <h2 className="text-3xl font-bold text-white">ACESSO SEGURO</h2>
                </div>
                <p className="text-gray-400">Entre no sistema premium</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm backdrop-blur-sm shadow-lg shadow-red-500/20">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-cyan-300">
                    EMAIL
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-premium pl-12"
                      placeholder="seu@email.com"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <div className="h-5 w-5 text-cyan-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-cyan-300">
                    SENHA
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-premium pl-12 pr-12"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <div className="h-5 w-5 text-cyan-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-neon-primary flex items-center justify-center space-x-3 mt-8"
                >
                  {loading ? (
                    <>
                      <div className="spinner-premium"></div>
                      <span>INICIANDO SISTEMA...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      <span>ACESSAR PLATAFORMA</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-6 border-t border-gray-800">
                  <span className="text-gray-400 text-sm">
                    Não tem acesso?{' '}
                    <Link
                      to="/register"
                      className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors neon-text"
                    >
                      SOLICITAR CONTA
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </div>

          {/* Demo Info */}
          <div className="text-center mt-8">
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong className="text-cyan-400">ADMIN:</strong> admin@sistema.com / admin123</p>
              <p><strong className="text-pink-400">USUÁRIO:</strong> Crie uma conta premium</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 text-center">
          <p className="text-gray-600 text-sm tracking-widest">
            NEXUS SYSTEM ® 2024 | PREMIUM EDITION
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;