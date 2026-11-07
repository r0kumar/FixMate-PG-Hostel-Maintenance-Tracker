import React from 'react';
import { Link } from 'react-router-dom';
import icon from '../assets/icon.png';
import PublicFooter from '../components/PublicFooter';
import { Zap, ShieldCheck, Clock, Users, DoorClosed } from 'lucide-react';

const Features = () => {
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
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Platform Capabilities
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            FixMate Core Features
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Everything your hostel needs to manage maintenance operations, resident complaints, and room inventory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Instant Ticket Submission</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Residents can file electrical, plumbing, WiFi, or cleaning issues with custom descriptions and image attachments.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Real-Time Status Lifecycle</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automated state transitions: Pending &rarr; Assigned &rarr; In Progress &rarr; Resolved, giving full transparency.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Technician Staff Management</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hostel administrators can create technician staff accounts, allocate jobs, and view resolution performance.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <DoorClosed className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Room &amp; Occupancy Tracking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Map rooms, wings, bed capacities, and associate complaints to specific hostel units accurately.
            </p>
          </div>
        </div>
      </main>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
};

export default Features;

