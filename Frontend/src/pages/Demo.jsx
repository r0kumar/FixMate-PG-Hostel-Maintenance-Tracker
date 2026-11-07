import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDemoAuth } from '../context/DemoAuthContext';
import icon from '../assets/icon.png';
import PublicFooter from '../components/PublicFooter';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Wrench,
  Home,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

const Demo = () => {
  const { demoUser, isDemoAuthenticated, loginDemo, resetDemo, getDemoDashboard } = useDemoAuth();
  const navigate = useNavigate();

  const [loadingRole, setLoadingRole] = useState(null);
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleLaunchRole = async (role) => {
    setServerError('');
    setLoadingRole(role);
    try {
      const session = await loginDemo(role);
      const destination = getDemoDashboard(session.role);
      navigate(destination);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to initialize demo session. Please try again.');
    } finally {
      setLoadingRole(null);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset all demo complaints, rooms, and staff back to default sample records?')) {
      return;
    }
    setResetting(true);
    setServerError('');
    setResetSuccess(false);
    try {
      await resetDemo();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to reset demo dataset.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={icon} alt="FixMate" className="w-9 h-9 object-contain rounded-xl shadow-xs group-hover:scale-105 transition-transform" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900">
                Fix<span className="text-purple-600">Mate</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-md shadow-2xs">
                Demo Sandbox
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Real Sign In</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10 space-y-8">
        
        {/* Intro Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Interactive Recruiter &amp; Visitor Sandbox</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Explore FixMate <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-indigo-600 to-purple-600">Three-Role Demo</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Experience complete complaint workflows across Admin, Staff, and Resident perspectives.
          </p>
        </div>

        {/* Existing Active Session Alert */}
        {isDemoAuthenticated && demoUser && (
          <div className="max-w-2xl mx-auto p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-indigo-200/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                Active Demo Session: <strong className="capitalize text-indigo-700">{demoUser.role}</strong> ({demoUser.name})
              </span>
            </div>
            <Link
              to={getDemoDashboard(demoUser.role)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Server Error / Success Toasts */}
        {serverError && (
          <div className="max-w-2xl mx-auto p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {resetSuccess && (
          <div className="max-w-2xl mx-auto p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>Demo database successfully restored to fresh default sample fixtures!</span>
          </div>
        )}

        {/* Three Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Admin Demo Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-slate-200/90 hover:border-amber-400 shadow-xl shadow-slate-200/60 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform">
                  👑
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-200">
                  Master Control
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition">
                  Hostel Admin
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Manage hostel maintenance, track real-time operations, allocate complaints to technicians, and oversee room inventory.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>Operations overview &amp; statistics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>Assign complaints to staff</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>Manage rooms &amp; bed capacities</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>Staff &amp; technician roster</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => handleLaunchRole('admin')}
                disabled={Boolean(loadingRole)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 via-amber-700 to-indigo-700 hover:from-amber-700 hover:to-indigo-800 shadow-md shadow-amber-600/20 active:scale-[0.99] transition cursor-pointer disabled:opacity-50"
              >
                {loadingRole === 'admin' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Initializing Admin Session...</span>
                  </>
                ) : (
                  <>
                    <span>Explore as Admin</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. Staff Demo Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-slate-200/90 hover:border-blue-400 shadow-xl shadow-slate-200/60 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform">
                  🔧
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100/80 px-2.5 py-1 rounded-full border border-blue-200">
                  Field Service
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition">
                  Maintenance Staff
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Log in as field technician Ramesh to view assigned repair work orders, toggle status to In Progress / Resolved, and log remarks.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>Assigned repair orders queue</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>Update status: In Progress / Resolved</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>Record completion &amp; handover remarks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>Priority &amp; category filters</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => handleLaunchRole('staff')}
                disabled={Boolean(loadingRole)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md shadow-blue-600/20 active:scale-[0.99] transition cursor-pointer disabled:opacity-50"
              >
                {loadingRole === 'staff' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Initializing Staff Session...</span>
                  </>
                ) : (
                  <>
                    <span>Explore as Staff</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3. Resident Demo Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-slate-200/90 hover:border-purple-400 shadow-xl shadow-slate-200/60 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-800 flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform">
                  🏠
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-100/80 px-2.5 py-1 rounded-full border border-purple-200">
                  Hostel Resident
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition">
                  Hostel Resident
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Log in as Aarav Sharma (Room 101) to file live maintenance complaints, view room details, and monitor repair status in real time.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                  <span>Submit new maintenance complaints</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                  <span>Track status (Pending &rarr; Resolved)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                  <span>Room 101 details &amp; warden desk</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                  <span>View technician remarks upon repair</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => handleLaunchRole('resident')}
                disabled={Boolean(loadingRole)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md shadow-purple-600/20 active:scale-[0.99] transition cursor-pointer disabled:opacity-50"
              >
                {loadingRole === 'resident' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Initializing Resident Session...</span>
                  </>
                ) : (
                  <>
                    <span>Explore as Resident</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Shared Workflow Diagram & Reset Panel */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                Shared Data Pipeline
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                How the End-to-End Demo Workflow Operates
              </h3>
              <p className="text-xs text-slate-500">
                All three roles share the exact same isolated database in MongoDB Atlas. Test changes across different roles!
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetData}
              disabled={resetting}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-800 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 transition cursor-pointer disabled:opacity-50 flex-shrink-0"
              title="Flush and restore demo database back to clean starting fixtures"
            >
              {resetting ? <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" /> : <RotateCcw className="w-3.5 h-3.5 text-amber-600" />}
              <span>{resetting ? 'Resetting Data...' : 'Reset Demo Dataset'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/70 space-y-1">
              <span className="font-mono text-[10px] font-bold text-purple-700">STEP 1</span>
              <p className="font-bold text-slate-900">Resident Files Ticket</p>
              <p className="text-slate-500 text-[11px] leading-snug">Submit a complaint as Resident Demo. It is saved in Atlas demo collection.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-1">
              <span className="font-mono text-[10px] font-bold text-amber-700">STEP 2</span>
              <p className="font-bold text-slate-900">Admin Assigns Staff</p>
              <p className="text-slate-500 text-[11px] leading-snug">Switch to Admin Demo. View the ticket and assign it to Technician Ramesh.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/70 space-y-1">
              <span className="font-mono text-[10px] font-bold text-blue-700">STEP 3</span>
              <p className="font-bold text-slate-900">Staff Repairs &amp; Resolves</p>
              <p className="text-slate-500 text-[11px] leading-snug">Switch to Staff Demo. Set status to In Progress and mark Resolved with notes.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-1">
              <span className="font-mono text-[10px] font-bold text-emerald-700">STEP 4</span>
              <p className="font-bold text-slate-900">Resident Tracks Result</p>
              <p className="text-slate-500 text-[11px] leading-snug">Switch back to Resident Demo. See the ticket resolved with technician notes!</p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
};

export default Demo;

