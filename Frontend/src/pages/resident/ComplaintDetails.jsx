import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Wrench,
  Tag,
  Home,
  User,
  Phone,
  Mail,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';

const statusStepOrder = ['pending', 'assigned', 'in_progress', 'resolved'];

const statusMeta = {
  pending: {
    label: 'Pending Review',
    color: 'amber',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
  },
  assigned: {
    label: 'Assigned to Staff',
    color: 'indigo',
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Tag,
  },
  in_progress: {
    label: 'In Progress / Repairing',
    color: 'blue',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Wrench,
  },
  resolved: {
    label: 'Resolved',
    color: 'emerald',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
};

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get(`/complaints/${id}`);
      setComplaint(data);
    } catch (err) {
      console.error('Failed to load complaint details', err);
      if (err.response?.status === 403) {
        setError('Access denied: You are not authorized to view this complaint.');
      } else if (err.response?.status === 404) {
        setError('Complaint not found.');
      } else {
        setError('Failed to load complaint details. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-sm text-slate-500 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span>Loading complaint #{id?.slice(-6)}...</span>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm text-center">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Unable to Display Ticket</h2>
          <p className="text-xs text-slate-500 mb-6">{error || 'Ticket not found'}</p>
          <Link
            to="/resident/my-complaints"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Complaints
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusStepOrder.indexOf(complaint.status);
  const currentStatusInfo = statusMeta[complaint.status] || statusMeta.pending;
  const StatusIcon = currentStatusInfo.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/resident/my-complaints')}
          className="inline-flex items-center gap-2 p-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaints</span>
        </button>

        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          ID: {complaint._id}
        </span>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Top Badges & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize ${currentStatusInfo.bg}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              {currentStatusInfo.label}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1 rounded-full capitalize">
              <Tag className="w-3 h-3 text-slate-400" />
              {complaint.category}
            </span>

            <span className="inline-flex items-center text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full capitalize">
              {complaint.priority} Priority
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>
              Reported on {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {/* Status Stepper Tracker */}
        <div className="py-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Resolution Progress
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {statusStepOrder.map((step, idx) => {
              const isPassed = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;
              const stepInfo = statusMeta[step];

              return (
                <div key={step} className="flex flex-col items-center text-center">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs transition mb-2 ${
                      isPassed
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`text-[11px] capitalize font-medium ${
                      isCurrent
                        ? 'text-blue-700 font-bold'
                        : isPassed
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {stepInfo.label.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {complaint.title}
          </h2>
          <div className="mt-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
            {complaint.description}
          </div>
        </div>

        {/* Attached Photo (if any) */}
        {complaint.image && (
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" /> Attached Photo
            </h3>
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-w-md group">
              <img
                src={complaint.image}
                alt={complaint.title}
                className="w-full h-64 object-cover cursor-pointer group-hover:scale-105 transition duration-200"
                onClick={() => setShowImageModal(true)}
              />
              <div
                onClick={() => setShowImageModal(true)}
                className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold cursor-pointer"
              >
                Click to view full photo
              </div>
            </div>
          </div>
        )}

        {/* Assignment & Room Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          {/* Location & Room */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold uppercase text-slate-400">
              Location / Room
            </span>
            <div className="mt-2 flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-blue-600">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">
                  Room {complaint.roomNumber || 'General Area'}
                </p>
                <p className="text-xs text-slate-500">
                  {complaint.room?.block ? `Block: ${complaint.room.block}` : 'Hostel Resident Unit'}
                </p>
              </div>
            </div>
          </div>

          {/* Assigned Technician */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold uppercase text-slate-400">
              Assigned Technician
            </span>
            {complaint.assignedStaff ? (
              <div className="mt-2 flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center border border-blue-200">
                  {complaint.assignedStaff.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900 text-sm">
                    {complaint.assignedStaff.name}
                  </p>
                  <p className="text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {complaint.assignedStaff.email}
                  </p>
                  {complaint.assignedStaff.phone && (
                    <p className="text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {complaint.assignedStaff.phone}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-2 text-xs text-slate-500 flex items-center gap-2 py-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Pending staff assignment by hostel admin</span>
              </div>
            )}
          </div>
        </div>

        {/* Technician Remarks */}
        {complaint.remarks && (
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80">
            <span className="text-[11px] font-bold uppercase text-blue-800 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Staff Notes & Remarks
            </span>
            <p className="text-xs text-blue-950 mt-1 leading-relaxed">
              {complaint.remarks}
            </p>
          </div>
        )}

        {/* Resolved Timestamp */}
        {complaint.resolvedAt && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              This ticket was marked resolved on{' '}
              {new Date(complaint.resolvedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}
      </div>

      {/* Full Size Image Modal */}
      {showImageModal && complaint.image && (
        <div
          onClick={() => setShowImageModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white p-2">
            <img
              src={complaint.image}
              alt={complaint.title}
              className="max-h-[85vh] w-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetails;

