import React from 'react';
import { Link } from 'react-router-dom';
import icon from '../assets/icon.png';
import PublicFooter from '../components/PublicFooter';
import { FileText } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200/90 py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={icon} alt="FixMate" className="w-8 h-8 object-contain rounded-lg shadow-xs" />
            <span className="font-black text-slate-900 text-lg">Fix<span className="text-purple-600">Mate</span></span>
          </Link>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link to="/" className="text-slate-600 hover:text-blue-600">Home</Link>
            <Link to="/about" className="text-slate-600 hover:text-blue-600">About Us</Link>
            <Link to="/contact" className="text-slate-600 hover:text-blue-600">Contact</Link>
            <Link to="/login" className="bg-blue-600 text-white px-3 py-1.5 rounded-xl hover:bg-blue-700">Sign In</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            <FileText className="w-3.5 h-3.5" />
            <span>Facility Agreement</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Terms &amp; Conditions</h1>
          <p className="text-xs text-slate-500">Effective Date: January 1, 2026</p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-xs text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-bold text-sm text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and using FixMate, residents, technicians, and hostel administrators agree to abide by the facility maintenance policies and system terms set forth here.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-sm text-slate-900">2. Responsible Ticket Logging</h2>
            <p>
              Residents agree to report truthful, accurate repair details relating to electrical, plumbing, WiFi, or cleaning requirements. Intentional abuse or misleading reports may lead to temporary restriction of account privileges.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-sm text-slate-900">3. Resolution Service Level Agreement (SLA)</h2>
            <p>
              While hostel technicians aim to respond to urgent issues within 2 to 24 hours, resolution time may depend on parts availability, technician scheduling, and contractor access.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-sm text-slate-900">4. Amendments</h2>
            <p>
              Hostel administration reserves the right to update these terms as needed to ensure optimal facility management.
            </p>
          </section>
        </div>
      </main>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
};

export default Terms;

