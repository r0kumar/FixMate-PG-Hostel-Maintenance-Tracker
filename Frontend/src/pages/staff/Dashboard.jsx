import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import logo from '../../assets/logo.png';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Tag,
  Home,
  User,
  Phone,
  Mail,
  Search,
  Filter,
  AlertCircle,
  Loader2,
  PlayCircle,
  CheckSquare,
  MessageSquare,
  Image as ImageIcon,
  X,
  Calendar,
  Sparkles,
} from 'lucide-react';

const categories = ['all', 'electrical', 'plumbing', 'cleaning', 'wifi', 'other'];
const statuses = ['all', 'assigned', 'in_progress', 'resolved'];

const StaffDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Remarks / Status Update Modal State
  const [selectedTask, setSelectedTask] = useState(null);
  const [targetStatus, setTargetStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      // Backend automatically scopes to complaints assigned to this staff member
      const { data } = await api.get('/complaints');
      setTasks(data);
    } catch (err) {
      console.error('Failed to load assigned tasks', err);
      setError('Could not load assigned work orders. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Status Updater without modal
  const handleQuickStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/complaints/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  // Open modal for updating status with remarks (e.g. for completion)
  const openStatusModal = (task, newStatus) => {
    setSelectedTask(task);
    setTargetStatus(newStatus);
    setRemarks(task.remarks || '');
  };

  // Confirm status update with remarks
  const submitStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedTask || !targetStatus) return;

    setUpdating(true);
    try {
      await api.patch(`/complaints/${selectedTask._id}/status`, {
        status: targetStatus,
        remarks: remarks.trim(),
      });
      setSelectedTask(null);
      setRemarks('');
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update work order');
    } finally {
      setUpdating(false);
    }
  };

  // Metrics
  const totalTasks = tasks.length;
  const assignedTasks = tasks.filter(
    (t) => t.status === 'assigned' || t.status === 'pending'
  ).length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === 'in_progress' || t.status === 'in-progress'
  ).length;
  const resolvedTasks = tasks.filter((t) => t.status === 'resolved').length;

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'in_progress'
          ? t.status === 'in_progress' || t.status === 'in-progress'
          : t.status === statusFilter;

    const matchesCategory =
      categoryFilter === 'all' || t.category === categoryFilter;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.roomNumber && t.roomNumber.toLowerCase().includes(q)) ||
      (t.resident?.name && t.resident.name.toLowerCase().includes(q));

    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Technician Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-blue-600/10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-3 py-0.5 rounded-full text-blue-100 backdrop-blur-sm">
              Technician Portal
            </span>
            <span className="text-xs text-blue-200">
              Assigned Tickets Queue
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Hello, {user?.name || 'Technician'}!
          </h1>
          <p className="text-blue-100 text-sm max-w-xl">
            Manage your daily hostel repairs, update progress, and mark resolved jobs.
          </p>
        </div>

        <div className="z-10 flex items-center gap-3">
          <div className="hidden sm:flex bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-2xl shadow-sm border border-white/20">
            <img src={logo} alt="FixMate" className="h-8 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10">
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">
                Pending Actions
              </p>
              <p className="text-2xl font-black text-white">{assignedTasks + inProgressTasks}</p>
            </div>
            <div className="p-2.5 bg-blue-500/30 rounded-xl text-blue-200">
              <Wrench className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assigned */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Assigned to You
            </span>
            <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-700">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900">{totalTasks}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Total tickets assigned</p>
          </div>
        </div>

        {/* Assigned / To-Do */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Assigned (New)
            </span>
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-indigo-600">{assignedTasks}</div>
            <p className="text-[11px] text-indigo-700/70 mt-0.5">Ready to start</p>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              In Progress
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <PlayCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-blue-600">{inProgressTasks}</div>
            <p className="text-[11px] text-blue-700/70 mt-0.5">Currently working</p>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Completed Fixes
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-emerald-600">{resolvedTasks}</div>
            <p className="text-[11px] text-emerald-700/70 mt-0.5">Successfully resolved</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by title, resident, room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Categories</option>
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
            <option value="cleaning">Cleaning</option>
            <option value="wifi">WiFi</option>
            <option value="other">Other</option>
          </select>

          {/* Status Buttons */}
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${statusFilter === status
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {status === 'in_progress' ? 'In Progress' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchTasks} className="font-semibold underline ml-2">
            Retry
          </button>
        </div>
      )}

      {/* Assigned Complaints List */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500 flex flex-col items-center justify-center gap-2 bg-white rounded-3xl border border-slate-200/80">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span>Loading your assigned tasks...</span>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-3">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No work orders found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'No assigned complaints match the selected filter.'
              : 'You have no active maintenance tasks assigned at the moment.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            const isResolved = task.status === 'resolved';
            const isInProgress = task.status === 'in_progress' || task.status === 'in-progress';
            const isAssigned = task.status === 'assigned' || task.status === 'pending';

            return (
              <div
                key={task._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow transition flex flex-col justify-between"
              >
                <div>
                  {/* Status, Priority & Category */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${isResolved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isInProgress
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                      >
                        {task.status === 'in_progress' ? 'In Progress' : task.status}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md capitalize">
                        <Tag className="w-3 h-3 text-slate-400" />
                        {task.category}
                      </span>

                      <span className="inline-flex items-center text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md capitalize">
                        {task.priority} priority
                      </span>
                    </div>

                    {task.image && (
                      <button
                        onClick={() => setSelectedImage(task.image)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md transition"
                      >
                        <ImageIcon className="w-3 h-3" /> Photo
                      </button>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {task.description}
                  </p>

                  {/* Resident and Room Details */}
                  <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-blue-600" />
                        Location:
                      </span>
                      <span>Room {task.roomNumber || 'General'}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Resident:
                      </span>
                      <span className="font-medium text-slate-800">
                        {task.resident?.name || 'Resident'}
                      </span>
                    </div>

                    {task.resident?.phone && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          Phone:
                        </span>
                        <a
                          href={`tel:${task.resident.phone}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {task.resident.phone}
                        </a>
                      </div>
                    )}

                    {task.resident?.email && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          Email:
                        </span>
                        <span className="font-medium text-slate-700 truncate max-w-[180px]">
                          {task.resident.email}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Remarks Display if present */}
                  {task.remarks && (
                    <div className="mt-3 p-2.5 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-slate-600">
                      <span className="font-bold text-blue-800 text-[11px] block mb-0.5">
                        Your Remarks:
                      </span>
                      <p className="italic">"{task.remarks}"</p>
                    </div>
                  )}
                </div>

                {/* Status Action Buttons */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Mark in progress button */}
                    {!isResolved && !isInProgress && (
                      <button
                        onClick={() => handleQuickStatusChange(task._id, 'in_progress')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Start Work</span>
                      </button>
                    )}

                    {/* Mark as Resolved button (opens remarks modal) */}
                    {!isResolved && (
                      <button
                        onClick={() => openStatusModal(task, 'resolved')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    )}

                    {/* Re-open / Update Remarks if resolved */}
                    {isResolved && (
                      <button
                        onClick={() => openStatusModal(task, 'in_progress')}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
                      >
                        Reopen Task
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Status Update / Remarks Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {targetStatus === 'resolved' ? 'Complete & Resolve Task' : 'Update Task Status'}
                </h3>
                <p className="text-xs text-slate-500">
                  Room {selectedTask.roomNumber} • {selectedTask.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitStatusUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Change Status To
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                >
                  <option value="assigned">Assigned (To-Do)</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved (Completed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Technician Remarks / Action Taken
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Replaced leaking valve, tested water flow, issue fixed."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-md shadow-blue-500/20 disabled:opacity-50 transition"
                >
                  {updating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{updating ? 'Saving...' : 'Confirm Update'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attached Photo Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-2xl max-h-[85vh] bg-white rounded-2xl overflow-hidden p-2">
            <img
              src={selectedImage}
              alt="Work order photo"
              className="max-h-[80vh] w-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
