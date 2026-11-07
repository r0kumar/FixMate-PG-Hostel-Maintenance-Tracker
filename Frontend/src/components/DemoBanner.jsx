import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoAuth } from '../context/DemoAuthContext';
import {
  Sparkles,
  RotateCcw,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const DemoBanner = () => {
  const { demoUser, isDemoAuthenticated, resetDemo, logoutDemo } = useDemoAuth();
  const navigate = useNavigate();
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isDemoAuthenticated || !demoUser) return null;

  const handleReset = async () => {
    if (!window.confirm('Reset all demo complaints, rooms, and technicians back to the clean default state?')) {
      return;
    }

    setResetting(true);
    setErrorMessage('');
    setResetSuccess(false);

    try {
      await resetDemo();
      setResetSuccess(true);
      setTimeout(() => {
        // Reload page to refresh all active dashboard data
        window.location.reload();
      }, 700);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to reset demo data.');
      setResetting(false);
    }
  };

  const handleExit = () => {
    logoutDemo();
    navigate('/demo');
  };

  return (
    <aside
      aria-label="Interactive Demo Sandbox Active"
      className="bg-gradient-to-r from-amber-600 via-indigo-700 to-purple-700 text-white shadow-md border-b border-amber-400/20 px-4 py-2 text-xs transition-all z-50 sticky top-0"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        
        {/* Left: Role and Scope Indicator */}
        <div className="flex items-center gap-2 text-center sm:text-left flex-wrap justify-center sm:justify-start">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/25 text-amber-200 border border-amber-300/30 font-bold uppercase tracking-wider text-[10px]">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Interactive Demo Mode
          </span>
          <span className="font-semibold text-slate-100 text-[11px] sm:text-xs">
            Exploring as <span className="underline font-bold capitalize text-amber-200">{demoUser.role}</span>. Real accounts &amp; resident data are isolated.
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          
          {resetSuccess && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> Data Reset!
            </span>
          )}

          {errorMessage && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-300 animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5" /> {errorMessage}
            </span>
          )}

          {/* Reset Demo Database Button */}
          <button
            type="button"
            onClick={handleReset}
            disabled={resetting}
            title="Reset demo complaints and rooms back to initial fixtures"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 text-white font-semibold text-[11px] transition border border-white/20 disabled:opacity-50 cursor-pointer"
          >
            {resetting ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RotateCcw className="w-3 h-3 text-amber-200" />
            )}
            <span>{resetting ? 'Resetting...' : 'Reset Demo Data'}</span>
          </button>

          {/* Exit Demo Button */}
          <button
            type="button"
            onClick={handleExit}
            title="Exit demo session and return to login"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/30 hover:bg-black/50 active:scale-95 text-slate-200 hover:text-white font-semibold text-[11px] transition border border-black/20 cursor-pointer"
          >
            <LogOut className="w-3 h-3 text-rose-300" />
            <span>Exit Demo</span>
          </button>

        </div>

      </div>
    </aside>
  );
};

export default DemoBanner;

