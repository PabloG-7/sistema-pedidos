import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, UserPlus, Shield, Sparkles } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData.name, formData.email, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-40 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="max-w-md w-full space-y-8 z-10">
        {/* Header */}
        <div className="text-center animate-fade-up">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl animate-glow">
              <UserPlus className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-5xl font-black gradient-text mb-4">
            Juntar-se
          </h2>
          <p className="text-xl text-white/80 font-medium">
            Ou{' '}
            <Link
              to="/login"
              className="font-bold text-white hover:text-purple-300 transition-all duration-300"
            >
              entre na sua conta
            </Link>
          </p>
        </div>

        {/* Register Form */}
        <div className="card animate-slide-in">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-6 py-4 rounded-2xl text-lg font-medium backdrop-blur-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-lg font-semibold text-white mb-3">
                Nome completo
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field text-lg pl-12"
                  placeholder="Seu nome completo"
                />
                <UserPlus className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/60" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-semibold text-white mb-3">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field text-lg pl-12"
                  placeholder="seu@email.com"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field text-lg pl-12 pr-12"
                  placeholder="Mínimo 6 caracteres"
                />
                <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/60" />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-lg font-semibold text-white mb-3">
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field text-lg pl-12 pr-12"
                  placeholder="Digite a senha novamente"
                />
                <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/60" />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center py-4 text-lg font-bold"
              >
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <div className="spinner-modern h-6 w-6"></div>
                    <span>Criando conta...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Sparkles className="h-6 w-6" />
                    <span>Começar Agora</span>
                    <UserPlus className="h-5 w-5" />
                  </div>
                )}
              </button>
            </div>

            <div className="text-center pt-6 border-t border-white/20">
              <p className="text-sm text-white/40">
                Ao criar uma conta, você concorda com nossos{' '}
                <a href="#" className="font-semibold text-white hover:text-purple-300 transition-colors duration-300">
                  Termos
                </a>{' '}
                e{' '}
                <a href="#" className="font-semibold text-white hover:text-purple-300 transition-colors duration-300">
                  Política de Privacidade
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;