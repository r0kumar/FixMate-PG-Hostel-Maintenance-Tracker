import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Wrench,
  CheckCircle,
  Clock,
  Tag,
  Home,
  Image as ImageIcon,
  ArrowRight,
} from 'lucide-react';

const statusStyles = {
  pending: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
    label: 'Pending',
  },
  assigned: {
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Tag,
    label: 'Assigned',
  },
  in_progress: {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Wrench,
    label: 'In Progress',
  },
  'in-progress': {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Wrench,
    label: 'In Progress',
  },
  resolved: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle,
    label: 'Resolved',
  },
};

const priorityStyles = {
  urgent: 'bg-red-50 text-red-700 border-red-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  medium: 'bg-amber-50 text-amber-800 border-amber-200',
  low: 'bg-emerald-50 text-emerald-800 border-emerald-200',
};

const ComplaintCard = ({
  complaint,
  onStatusChange,
  showActions = false,
  showDetailsLink = true,
}) => {
  const statusInfo = statusStyles[complaint.status] || statusStyles.pending;
  const StatusIcon = statusInfo.icon;

  const formattedDate = complaint.createdAt
    ? new Date(complaint.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    : 'Recent';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.bg}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              {statusInfo.label}
            </span>

            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border capitalize ${priorityStyles[complaint.priority] || priorityStyles.medium
                }`}
            >
              {complaint.priority} priority
            </span>

            <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md capitalize font-medium">
              <Tag className="w-3 h-3 text-slate-400" />
              {complaint.category}
            </span>
          </div>

          {complaint.image && (
            <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              <ImageIcon className="w-3 h-3" /> Photo
            </span>
          )}
        </div>

        <h3 className="text-base font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition">
          {complaint.title}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-2 mb-3">
          {complaint.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 gap-2">
        <div className="flex items-center gap-3">
          {complaint.roomNumber && (
            <span className="flex items-center gap-1 font-medium text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              <Home className="w-3.5 h-3.5 text-slate-400" />
              Room {complaint.roomNumber}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {formattedDate}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {showActions && onStatusChange && (
            <select
              value={complaint.status}
              onChange={(e) => onStatusChange(complaint._id, e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          )}

          {showDetailsLink && (
            <Link
              to={`/resident/complaints/${complaint._id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline ml-auto"
            >
              Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
