import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Calendar, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../api/client';
import { PasswordStrength } from '../../components/shared';

type AuthTab = 'login' | 'register';

interface FormErrors {
  email?: string;
  password?: string;
  fullName?: string;
  confirmPassword?: string;
  age?: string;
}

export const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    sex: 'Prefer not to say' as 'Male' | 'Female' | 'Prefer not to say',
    role: 'patient' as 'patient' | 'doctor',
  });

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLoginForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!loginData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!registerData.fullName) {
      newErrors.fullName = 'Full name is required';
    }

    if (!registerData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(registerData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!registerData.password) {
      newErrors.password = 'Password is required';
    } else if (registerData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (registerData.age) {
      const age = parseInt(registerData.age);
      if (isNaN(age) || age < 18 || age > 100) {
        newErrors.age = 'Age must be between 18 and 100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateLoginForm()) return;

    setIsLoading(true);
    try {
      const response = await authAPI.login(loginData.email, loginData.password, loginData.rememberMe);

      if (response.success && response.data) {
        login(response.data.user, response.data.tokens);
        toast.success('Login successful!');
        navigate('/upload');
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRegisterForm()) return;

    setIsLoading(true);
    try {
      const response = await authAPI.register({
        fullName: registerData.fullName,
        email: registerData.email,
        password: registerData.password,
        age: registerData.age ? parseInt(registerData.age) : undefined,
        sex: registerData.sex,
        role: registerData.role,
      });

      if (response.success && response.data) {
        login(response.data.user, response.data.tokens);
        toast.success('Account created successfully!');
        navigate('/upload');
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4">
        <Link to="/" className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity">
          <div className="p-1.5 rounded-lg bg-primary-100">
            <Eye className="h-5 w-5 text-primary-600" />
          </div>
          <span className="font-bold text-xl text-gray-900">
            Cataract<span className="text-primary-500">AI</span>
          </span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
              <p className="text-gray-600 mb-6">Enter your credentials to access your account</p>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500/20 ${
                        errors.email ? 'border-danger-500' : 'border-gray-200'
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-danger-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500/20 ${
                        errors.password ? 'border-danger-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-danger-600">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={loginData.rememberMe}
                      onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toast('Feature coming soon', { icon: 'ℹ️' })}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => setActiveTab('register')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Register
                </button>
              </p>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 text-center">
                  <strong>Demo credentials:</strong> admin@cataractai.com / Admin1234!
                </p>
              </div>
            </div>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create an account</h2>
              <p className="text-gray-600 mb-6">Get started with cataract screening</p>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={registerData.fullName}
                      onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500/20 ${
                        errors.fullName ? 'border-danger-500' : 'border-gray-200'
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.fullName && <p className="mt-1 text-sm text-danger-600">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500/20 ${
                        errors.email ? 'border-danger-500' : 'border-gray-200'
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-danger-600">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500/20 ${
                          errors.password ? 'border-danger-500' : 'border-gray-200'
                        }`}
                        placeholder="Min 8 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <PasswordStrength password={registerData.password} />
                    {errors.password && <p className="mt-1 text-sm text-danger-600">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500/20 ${
                          errors.confirmPassword ? 'border-danger-500' : 'border-gray-200'
                        }`}
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-danger-600">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age (optional)</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={registerData.age}
                        onChange={(e) => setRegisterData({ ...registerData, age: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500/20 ${
                          errors.age ? 'border-danger-500' : 'border-gray-200'
                        }`}
                        placeholder="25"
                        min="18"
                        max="100"
                      />
                    </div>
                    {errors.age && <p className="mt-1 text-sm text-danger-600">{errors.age}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sex</label>
                    <select
                      value={registerData.sex}
                      onChange={(e) => setRegisterData({ ...registerData, sex: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRegisterData({ ...registerData, role: 'patient' })}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${
                        registerData.role === 'patient'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <User className="h-5 w-5" />
                      Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegisterData({ ...registerData, role: 'doctor' })}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${
                        registerData.role === 'doctor'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Users className="h-5 w-5" />
                      Doctor
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 mt-6 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
