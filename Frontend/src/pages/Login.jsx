import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import icon from '../assets/icon.png';
import PublicFooter from '../components/PublicFooter';
import {
  Wrench,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Loader2,
  Building2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
} from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState(null);

  const { login, getRoleDashboard } = useAuth();
  const navigate = useNavigate();

  // Validate form before submit
  const validate = () => {
    const errors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
    if (serverError) setServerError('');
    setActiveRole(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setServerError('');
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      const destination = getRoleDashboard(user.role);
      navigate(destination, { replace: true });
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
        'Failed to authenticate. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email, password, role) => {
    setFormData({ email, password });
    setActiveRole(role);
    setFormErrors({});
    if (serverError) setServerError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between relative overflow-hidden">
      
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Floating Decorative Elements (Desktop) */}
      <div className="hidden xl:flex items-center gap-2.5 absolute top-28 left-12 p-3.5 bg-white/80 backdrop-blur-md rounded-2xl border border-white/80 shadow-lg shadow-blue-500/5 animate-float z-10">
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
          <Zap className="w-4 h-4" />
        </div>
        <div className="text-left text-xs">
          <p className="font-bold text-slate-800">Quick Issue Logging</p>
          <p className="text-[11px] text-slate-400">Instant technician alerts</p>
        </div>
      </div>

      <div className="hidden xl:flex items-center gap-2.5 absolute top-36 right-12 p-3.5 bg-white/80 backdrop-blur-md rounded-2xl border border-white/80 shadow-lg shadow-purple-500/5 animate-float-reverse z-10">
        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
          <Clock className="w-4 h-4" />
        </div>
        <div className="text-left text-xs">
          <p className="font-bold text-slate-800">Live Repair Tracking</p>
          <p className="text-[11px] text-slate-400">Pending &rarr; In Progress &rarr; Resolved</p>
        </div>
      </div>

      {/* Main Login Card Area */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md animate-in fade-in slide-in-from-bottom-3 duration-500">
          
          {/* Brand Header */}
          <div className="text-center mb-6">
            <Link
              to="/"
              className="inline-block transition-transform hover:scale-105 active:scale-95 group"
              aria-label="FixMate Home"
            >
              <div className="relative inline-block mb-3">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 rounded-3xl blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative p-2.5 bg-white rounded-3xl shadow-md border border-slate-100">
                  <img
                    src={icon}
                    alt="FixMate Icon"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-sm rounded-2xl"
                  />
                </div>
              </div>
            </Link>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Fix<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">Mate</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
              Maintenance Made Simple.
            </p>
          </div>

          {/* Frosted Glass Card Container */}
          <div className="bg-white/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl shadow-slate-200/70 border border-white/80 rounded-3xl transition-all">
            
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900">Sign in to your account</h2>
              <p className="text-xs text-slate-500 mt-1">
                Select your role below or enter your credentials
              </p>
            </div>

            {/* Quick Demo Role Selector with Smooth Active States */}
            <div className="mb-6 p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 transition-all">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-2.5 tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Quick Demo Switcher
                </span>
                <span className="text-blue-600 font-semibold">1-Click Auto Fill</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('admin@fixmate.com', 'password123', 'admin')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 border ${
                    activeRole === 'admin'
                      ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-sm ring-2 ring-amber-500/20 scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span>👑</span>
                  <span>Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo('staff@fixmate.com', 'password123', 'staff')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 border ${
                    activeRole === 'staff'
                      ? 'bg-blue-50 text-blue-900 border-blue-300 shadow-sm ring-2 ring-blue-500/20 scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span>🔧</span>
                  <span>Staff</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo('resident@fixmate.com', 'password123', 'resident')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 border ${
                    activeRole === 'resident'
                      ? 'bg-purple-50 text-purple-900 border-purple-300 shadow-sm ring-2 ring-purple-500/20 scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span>🏠</span>
                  <span>Resident</span>
                </button>
              </div>

              {/* Satisfying Confirmation Notice */}
              {activeRole && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] animate-in fade-in duration-200">
                  <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Demo credentials loaded
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    {formData.email}
                  </span>
                </div>
              )}
            </div>

            {/* Server Error Notification */}
            {serverError && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">{serverError}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              
              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-slate-50/50 focus:bg-white ${
                      formErrors.email
                        ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                        : 'border-slate-200'
                    }`}
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <span>{formErrors.email}</span>
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-slate-50/50 focus:bg-white ${
                      formErrors.password
                        ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                        : 'border-slate-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <span>{formErrors.password}</span>
                  </p>
                )}
              </div>

              {/* Gradient Submit Button with Satisfying Micro-interaction */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-md shadow-blue-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Registration Redirect Link */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                New resident at the hostel?{' '}
                <Link
                  to="/register"
                  className="font-bold text-blue-600 hover:text-purple-600 hover:underline transition"
                >
                  Register your account
                </Link>
              </p>
            </div>
          </div>

          {/* Feature Highlights Pills under Card */}
          <div className="mt-8 text-center text-xs text-slate-500 flex justify-center items-center gap-4">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Fast Resolution
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" /> PG &amp; Hostels
            </span>
            <span className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-purple-600" /> Real-time Tracking
            </span>
          </div>

        </div>
      </div>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
};

export default Login;
