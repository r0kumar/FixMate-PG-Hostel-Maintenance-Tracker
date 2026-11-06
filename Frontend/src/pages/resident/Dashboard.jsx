import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ComplaintCard from '../../components/ComplaintCard';
import logo from '../../assets/logo.png';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  Wrench,
  Home,
  ArrowRight,
  ClipboardList,
  AlertCircle,
  Loader2,
  Tag,
} from 'lucide-react';

const ResidentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/complaints');
      setComplaints(data);
    } catch (err) {
      console.error('Failed to load complaints', err);
      setError('Unable to load your maintenance requests. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  // Metrics
  const total = complaints.length;
  const pending = complaints.filter(
    (c) => c.status === 'pending' || c.status === 'assigned'
  ).length;
  const inProgress = complaints.filter((c) => c.status === 'in_progress').length;
  const resolved = complaints.filter((c) => c.status === 'resolved').length;

  const residentRoom =
    user?.room?.roomNumber ||
    complaints.find((c) => c.roomNumber)?.roomNumber ||
    'Not Assigned';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-blue-500/10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-3 py-0.5 rounded-full text-blue-100">
              Resident Portal
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-blue-100 bg-white/10 px-2.5 py-0.5 rounded-full">
              <Home className="w-3 h-3" /> Room: <strong>{residentRoom}</strong>
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Resident'}!
          </h1>
          <p className="text-blue-100 text-sm max-w-xl">
            Track and report PG & hostel issues effortlessly. Our maintenance team is on standby to help.
          </p>
        </div>

        <div className="z-10 flex-shrink-0 flex items-center gap-3">
          <div className="hidden sm:flex bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-2xl shadow-sm border border-white/20">
            <img src={logo} alt="FixMate" className="h-8 w-auto object-contain" />
          </div>
          <Link
            to="/resident/new-complaint"
            className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 active:scale-[0.98] font-bold px-5 py-3 rounded-2xl text-sm transition shadow-md shadow-slate-900/10"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            Submit New Complaint
          </Link>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Complaints */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Complaints
            </span>
            <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-700">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900">{total}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Tickets logged by you</p>
          </div>
        </div>

        {/* Pending Complaints */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Pending Action
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-amber-600">{pending}</div>
            <p className="text-[11px] text-amber-700/70 mt-0.5">Awaiting resolution</p>
          </div>
        </div>

        {/* In Progress Complaints */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              In Progress
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-blue-600">{inProgress}</div>
            <p className="text-[11px] text-blue-700/70 mt-0.5">Technician active</p>
          </div>
        </div>

        {/* Resolved Complaints */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Resolved
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-emerald-600">{resolved}</div>
            <p className="text-[11px] text-emerald-700/70 mt-0.5">Completed fixes</p>
          </div>
        </div>
      </div>

      {/* Error State Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchComplaints}
            className="font-semibold text-rose-800 hover:underline ml-3"
          >
            Retry
          </button>
        </div>
      )}

      {/* Recent Complaints Section */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Complaints</h2>
            <p className="text-xs text-slate-500">Latest updates on repairs and maintenance for your unit</p>
          </div>
          <Link
            to="/resident/my-complaints"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition"
          >
            View All ({complaints.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-slate-500 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span>Loading your complaints...</span>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-blue-600 mb-3 border border-slate-200/70">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No issues reported</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Everything in Room {residentRoom} looks good! If you ever face an issue with plumbing, electrical, WiFi, or cleaning, submit a complaint here.
            </p>
            <Link
              to="/resident/new-complaint"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Submit a Request
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complaints.slice(0, 4).map((item) => (
              <ComplaintCard key={item._id} complaint={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentDashboard;
