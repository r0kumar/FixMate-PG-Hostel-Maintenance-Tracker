import React from 'react';
import icon from '../assets/icon.png';
import { useAuth } from '../context/AuthContext';

const DashboardFooter = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-slate-200/80 py-3.5 px-4 sm:px-6 lg:px-8 mt-auto z-10 transition-colors">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500">
        
        {/* Left: Brand mark & tagline */}
        <div className="flex items-center gap-2">
          <img
            src={icon}
            alt="FixMate"
            className="w-5 h-5 object-contain rounded"
          />
          <span className="font-bold text-slate-800 tracking-tight">
            Fix<span className="text-purple-600">Mate</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 text-[11px] font-medium hidden sm:inline">
            Maintenance Made Simple.
          </span>
        </div>

        {/* Right: Operational Status & Copyright */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-[10px] font-semibold text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{user?.role ? `${user.role.toUpperCase()} SESSION` : 'SYSTEM ONLINE'}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            &copy; {currentYear} FixMate. All rights reserved.
          </span>
        </div>

      </div>
    </footer>
  );
};

export default DashboardFooter;

