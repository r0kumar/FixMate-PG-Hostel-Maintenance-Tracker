import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import logo from '../../assets/logo.png';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Users,
  DoorClosed,
  ArrowRight,
  Wrench,
  AlertCircle,
  Loader2,
  UserPlus,
  Plus,
  Tag,
} from 'lucide-react';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [staff, setStaff] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [cRes, sRes, rRes] = await Promise.all([
        api.get('/complaints'),
        api.get('/complaints/staff'),
        api.get('/rooms'),
      ]);
      setComplaints(cRes.data);
      setStaff(sRes.data);
      setRooms(rRes.data);
    } catch (err) {
      console.error('Failed to load admin metrics', err);
      setError('Failed to fetch dashboard metrics. Please reload the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAssign = async (complaintId, staffId) => {
    try {
      await api.patch(`/complaints/${complaintId}/assign`, { staffId: staffId || null });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign staff');
    }
  };

  // Metrics calculations
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(
    (c) => c.status === 'pending' || c.status === 'assigned'
  ).length;
  const inProgressComplaints = complaints.filter(
    (c) => c.status === 'in_progress' || c.status === 'in-progress'
  ).length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'resolved').length;

  const totalBeds = rooms.reduce((acc, r) => acc + (r.capacity || 0), 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + (r.occupants?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-slate-900/10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-1.5 z-10">
          <span className="text-xs font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full">
            Admin Master Control
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Hostel Operations & Maintenance
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Live overview of maintenance requests, technician workload, and hostel room capacity.
          </p>
        </div>

        <div className="z-10 flex flex-wrap items-center gap-3">
          <div className="hidden sm:flex bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-2xl shadow-sm border border-white/20">
            <img src={logo} alt="FixMate" className="h-8 w-auto object-contain" />
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/admin/complaints"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow-sm"
            >
              <ClipboardList className="w-4 h-4" /> All Complaints
            </Link>
            <Link
              to="/admin/staff"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition backdrop-blur-sm"
            >
              <UserPlus className="w-4 h-4" /> Add Staff
            </Link>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-72 h-72 bg-blue-500/5 rounded-full pointer-events-none" />
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchData} className="font-semibold underline">
            Retry
          </button>
        </div>
      )}

      {/* Statistic Cards Grid */}
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
            <div className="text-3xl font-extrabold text-slate-900">{totalComplaints}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Logged across all rooms</p>
          </div>
        </div>

        {/* Pending Complaints */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Pending Tickets
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-amber-600">{pendingComplaints}</div>
            <p className="text-[11px] text-amber-700/70 mt-0.5">Needs action or assignment</p>
          </div>
        </div>

        {/* Resolved Complaints */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Resolved Tickets
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-emerald-600">{resolvedComplaints}</div>
            <p className="text-[11px] text-emerald-700/70 mt-0.5">Closed successfully</p>
          </div>
        </div>

        {/* Staff & Rooms Summary */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Staff & Rooms
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-extrabold text-slate-900">{staff.length}</span>
              <span className="text-xs text-slate-500 ml-1">Staff</span>
            </div>
            <span className="text-slate-300">•</span>
            <div>
              <span className="text-2xl font-extrabold text-slate-900">{rooms.length}</span>
              <span className="text-xs text-slate-500 ml-1">Rooms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Complaints Queue</h2>
            <p className="text-xs text-slate-500">Live feed of reported maintenance issues requiring allocation</p>
          </div>
          <Link
            to="/admin/complaints"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition w-fit"
          >
            <span>Manage All Tickets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-slate-500 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span>Loading complaints feed...</span>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No complaints logged yet in the system.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Complaint Title</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Room</th>
                  <th className="px-6 py-3.5">Resident</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Assigned Staff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {complaints.slice(0, 6).map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <div>{c.title}</div>
                      <span className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                        {c.description}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 capitalize">
                        <Tag className="w-3 h-3 text-slate-400" />
                        {c.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-800">
                      Room {c.roomNumber || 'N/A'}
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {c.resident?.name || 'Resident'}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${
                          c.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : c.status === 'in_progress'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : c.status === 'assigned'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {c.status === 'in_progress' ? 'In Progress' : c.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={c.assignedStaff?._id || ''}
                        onChange={(e) => handleQuickAssign(c._id, e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                      >
                        <option value="">Unassigned</option>
                        {staff.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
