import React from 'react';
import { Link } from 'react-router-dom';
import icon from '../assets/icon.png';
import logo from '../assets/logo.png';
import PublicFooter from '../components/PublicFooter';
import {
  Wrench,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  Users,
  DoorClosed,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  Building2,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, getRoleDashboard } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      
      {/* Public Navigation Bar */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={icon} alt="FixMate" className="w-9 h-9 object-contain rounded-xl shadow-xs" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900">
                Fix<span className="text-purple-600">Mate</span>
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                Hostel Hub
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link to="/" className="text-blue-600 font-bold transition">Home</Link>
            <Link to="/about" className="hover:text-blue-600 transition">About Us</Link>
            <Link to="/features" className="hover:text-blue-600 transition">Features</Link>
            <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to={getRoleDashboard(user.role)}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs"
                >
                  <span>Register</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Modern PG &amp; Hostel Maintenance Management</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Maintenance <span className="text-blue-600">Made Simple.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A smarter way to manage PG and hostel maintenance requests, track complaints, and keep residents connected.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-2xl text-sm transition shadow-md shadow-blue-500/20 active:scale-[0.98]"
            >
              <span>Get Started as Resident</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold px-6 py-3.5 rounded-2xl text-sm transition border border-slate-200 shadow-xs"
            >
              <span>Sign In to Portal</span>
            </Link>
          </div>
        </section>

        {/* Features Highlights */}
        <section id="features" className="py-16 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Features</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Designed for Hassle-Free Hostel Living
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Replace unorganized WhatsApp messages and register books with a transparent tracking workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Quick Issue Logging</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Log electrical, plumbing, WiFi, or cleaning issues with room details and optional photos in seconds.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Technician Dispatch</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Admins assign complaints directly to staff technicians who update job progress and mark fixes complete.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Real-Time Status</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Stay updated from Pending to In Progress to Resolved with full accountability at every step.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-blue-200">
                About FixMate
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Empowering PG Owners, Technicians &amp; Residents
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                FixMate was created to solve maintenance bottlenecks in modern student hostels and paying guest accommodations. With clear roles for Residents, Technicians, and Hostel Administrators, every room issue is resolved promptly.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center space-y-3 flex-shrink-0">
              <p className="text-3xl font-black text-white">100%</p>
              <p className="text-xs text-blue-200 font-semibold uppercase tracking-wider">Automated Issue Pipeline</p>
              <Link
                to="/register"
                className="inline-block bg-white text-blue-900 font-bold px-4 py-2 rounded-xl text-xs hover:bg-blue-50 transition shadow-sm"
              >
                Join FixMate
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-white border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Get In Touch</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Have Questions or Need Assistance?
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our hostel administration team is here to help with facility queries, onboarding, or emergency repairs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="mailto:support@fixmate.com"
                className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-blue-500 px-5 py-3 rounded-2xl text-xs font-bold text-slate-800 transition"
              >
                <Mail className="w-4 h-4 text-blue-600" />
                <span>support@fixmate.com</span>
              </a>

              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-blue-500 px-5 py-3 rounded-2xl text-xs font-bold text-slate-800 transition"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>+91 98765 43210</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
};

export default Home;

