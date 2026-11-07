import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';
import {
  Search,
  Trash2,
  Tag,
  Home,
  User,
  Calendar,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
} from 'lucide-react';

const categories = ['all', 'electrical', 'plumbing', 'cleaning', 'wifi', 'other'];
const statuses = ['all', 'pending', 'assigned', 'in_progress', 'resolved'];

const AdminComplaints = () => {
  const { api } = useSession();
  const [complaints, setComplaints] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [cRes, sRes] = await Promise.all([
        api.get('/complaints'),
        api.get('/complaints/staff'),
      ]);
      setComplaints(cRes.data);
      setStaffList(sRes.data);
    } catch (err) {
      console.error('Failed to load complaints or staff', err);
      setError('Could not fetch complaints master records.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/complaints/${id}/status`, { status });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAssignStaff = async (id, staffId) => {
    try {
      await api.patch(`/complaints/${id}/assign`, { staffId: staffId || null });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign staff');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint record permanently?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete complaint');
    }
  };

  const filtered = complaints.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      (c.roomNumber && c.roomNumber.toLowerCase().includes(q)) ||
      (c.resident?.name && c.resident.name.toLowerCase().includes(q));

    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            All Maintenance Complaints
          </h1>
          <p className="text-xs text-slate-500">
            Monitor, filter, and allocate all reported hostel tickets to technicians
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm w-fit">
          Total Records: <strong>{filtered.length}</strong>
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search title, resident, room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Category Dropdown Filter */}
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

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={loadData} className="font-semibold underline ml-2">
            Retry
          </button>
        </div>
      )}

      {/* Complaints List / Table */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500 flex flex-col items-center justify-center gap-2 bg-white rounded-3xl border border-slate-200/80">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span>Loading complaints database...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
          <p className="text-base font-semibold text-slate-800">No complaints found</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting your filters or search keywords</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Left Column: Complaint Details */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                    Room {item.roomNumber || 'N/A'}
                  </span>

                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium capitalize">
                    {item.category}
                  </span>

                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium capitalize">
                    {item.priority} priority
                  </span>

                  {item.image && (
                    <button
                      onClick={() => setSelectedImage(item.image)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md transition"
                    >
                      <ImageIcon className="w-3 h-3" /> View Photo
                    </button>
                  )}
                </div>

                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2.5">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Resident: <strong className="text-slate-700 ml-1">{item.resident?.name || 'Resident'}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  {item.remarks && (
                    <span className="text-slate-500 italic">
                      Notes: "{item.remarks}"
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Allocation & Status Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                {/* Staff Assignment */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Assign Technician
                  </label>
                  <select
                    value={item.assignedStaff?._id || ''}
                    onChange={(e) => handleAssignStaff(item._id, e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  >
                    <option value="">Unassigned</option>
                    {staffList.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Updater */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Status
                  </label>
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium capitalize"
                  >
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                {/* Delete Button */}
                <div className="self-end pb-0.5">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-2xl max-h-[85vh] bg-white rounded-2xl overflow-hidden p-2">
            <img
              src={selectedImage}
              alt="Complaint attachment"
              className="max-h-[80vh] w-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
