import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
  ArrowUp,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="w-full bg-[#0b1329] text-slate-300 border-t border-slate-800 mt-auto relative z-10">
      {/* Subtle top gradient accent */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        
        {/* Main Grid: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Brand Section (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              to="/"
              className="inline-block transition-opacity hover:opacity-90"
              aria-label="FixMate Home"
            >
              <div className="bg-white/95 rounded-xl p-2.5 inline-block shadow-sm">
                <img
                  src={logo}
                  alt="FixMate - PG & Hostel Maintenance Tracker"
                  className="h-9 w-auto object-contain"
                />
              </div>
            </Link>

            <div className="space-y-1">
              <p className="text-sm font-bold text-white tracking-wide">
                Maintenance Made Simple.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                A smarter way to manage PG and hostel maintenance requests, track complaints, and keep residents connected.
              </p>
            </div>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Hostel Maintenance Network Active</span>
              </div>
            </div>
          </div>

          {/* Quick Links (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/"
                  className="text-slate-400 hover:text-purple-400 transition flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-transform group-hover:translate-x-0.5" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-slate-400 hover:text-purple-400 transition flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-transform group-hover:translate-x-0.5" />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="text-slate-400 hover:text-purple-400 transition flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-transform group-hover:translate-x-0.5" />
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-400 hover:text-purple-400 transition flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-transform group-hover:translate-x-0.5" />
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-slate-400 hover:text-purple-400 transition flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-transform group-hover:translate-x-0.5" />
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-slate-400 hover:text-purple-400 transition flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-transform group-hover:translate-x-0.5" />
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Links (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/resident/dashboard"
                  className="text-slate-400 hover:text-purple-400 transition flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-transform group-hover:translate-x-0.5" />
                  Resident Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/staff/dashboard"
                  className="text-slate-400 hover:text-purple-400 transition flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-transform group-hover:translate-x-0.5" />
                  Staff Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/dashboard"
                  className="text-slate-400 hover:text-purple-400 transition flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-transform group-hover:translate-x-0.5" />
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/resident/new-complaint"
                  className="text-slate-400 hover:text-purple-400 transition flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-transform group-hover:translate-x-0.5" />
                  Submit a Complaint
                </Link>
              </li>
              <li>
                <Link
                  to="/resident/my-complaints"
                  className="text-slate-400 hover:text-purple-400 transition flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-transform group-hover:translate-x-0.5" />
                  Track Complaint
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Hostel Assistance
            </h3>
            
            <div className="space-y-2.5 text-xs">
              <a
                href="mailto:support@fixmate.com"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-purple-500/50 hover:text-white transition group"
              >
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Official Support</p>
                  <p className="font-semibold text-xs">support@fixmate.com</p>
                </div>
              </a>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Warden Helpdesk</p>
                  <p className="font-semibold text-xs">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Operations</p>
                  <p className="font-semibold text-xs">24/7 On-Call Maintenance</p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              Rapid technician dispatch for hostel residents.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>&copy; {currentYear} FixMate. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link
              to="/privacy"
              className="text-slate-400 hover:text-purple-400 transition"
            >
              Privacy Policy
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              to="/terms"
              className="text-slate-400 hover:text-purple-400 transition"
            >
              Terms &amp; Conditions
            </Link>
          </div>

          {/* Smooth Scroll Back to Top Button */}
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500 text-slate-300 hover:text-white transition text-xs font-semibold cursor-pointer group"
            title="Scroll to top of page"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform text-purple-400" />
          </button>

        </div>

      </div>
    </footer>
  );
};

export default PublicFooter;

