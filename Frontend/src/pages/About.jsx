import React from 'react';
import { Link } from 'react-router-dom';
import icon from '../assets/icon.png';
import PublicFooter from '../components/PublicFooter';
import { ShieldCheck, Users, Wrench, Heart, ArrowLeft, ArrowRight } from 'lucide-react';

const About = () => {
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
            <Link to="/features" className="text-slate-600 hover:text-blue-600">Features</Link>
            <Link to="/contact" className="text-slate-600 hover:text-blue-600">Contact</Link>
            <Link to="/login" className="bg-blue-600 text-white px-3 py-1.5 rounded-xl hover:bg-blue-700">Sign In</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            About FixMate
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Empowering Hostel Living Through Technology
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            FixMate is a dedicated PG and hostel maintenance tracker designed to streamline complaint logging, staff dispatch, and repair resolutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Our Mission</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              To eliminate maintenance frustration for students and working professionals staying in PGs and hostels.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Transparency First</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every maintenance request is timestamped, categorized, assigned to a technician, and verified upon fix.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Fast Turnaround</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our automated workflow reduces repair resolution delays by over 70% compared to paper registries.
            </p>
          </div>
        </div>
      </main>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
};

export default About;

