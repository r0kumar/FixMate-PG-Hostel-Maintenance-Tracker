import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  CheckSquare,
  Users,
  DoorClosed,
  Crown,
  Wrench,
  Home,
  LogOut,
  Phone,
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout, api, isDemo, baseRoute } = useSession();
  const navigate = useNavigate();
  const [complaintCount, setComplaintCount] = useState(null);
  const [pendingCount, setPendingCount] = useState(null);

  useEffect(() => {
    if (user) {
      fetchCounts();
    }
  }, [user]);

  const fetchCounts = async () => {
    try {
      const { data } = await api.get('/complaints');
      if (Array.isArray(data)) {
        setComplaintCount(data.length);
        const pending = data.filter(
          (c) => c.status === 'pending' || c.status === 'assigned'
        ).length;
        setPendingCount(pending);
      }
    } catch {
      // Quiet fail if network/auth issues
    }
  };

  const handleLogout = () => {
    logout();
    navigate(isDemo ? '/demo' : '/login');
  };

  if (!user) return null;

  // Resident 2-section navigation (matches Admin layout)
  const residentSections = [
    {
      title: 'Overview',
      links: [
        { name: 'Dashboard', to: `${baseRoute}/resident`, icon: LayoutDashboard },
        {
          name: 'My Complaints',
          to: `${baseRoute}/resident/my-complaints`,
          icon: ClipboardList,
          badge: complaintCount !== null ? complaintCount : undefined,
        },
      ],
    },
    {
      title: 'Services',
      links: [
        { name: 'Submit Complaint', to: `${baseRoute}/resident/new-complaint`, icon: PlusCircle, highlight: true },
      ],
    },
  ];

  // Staff 2-section navigation (matches Admin layout)
  const staffSections = [
    {
      title: 'Overview',
      links: [
        { name: 'Dashboard', to: `${baseRoute}/staff`, icon: LayoutDashboard },
      ],
    },
    {
      title: 'Work Orders',
      links: [
        {
          name: 'My Tasks',
          to: `${baseRoute}/staff/tasks`,
          icon: CheckSquare,
          badge: pendingCount !== null ? pendingCount : undefined,
          badgeColor: 'amber',
        },
      ],
    },
  ];

  // Admin 2-section navigation
  const adminSections = [
    {
      title: 'Overview',
      links: [
        { name: 'Dashboard', to: `${baseRoute}/admin`, icon: LayoutDashboard },
        {
          name: 'All Complaints',
          to: `${baseRoute}/admin/complaints`,
          icon: ClipboardList,
          badge: pendingCount !== null && pendingCount > 0 ? `${pendingCount} new` : undefined,
          badgeColor: 'amber',
        },
      ],
    },
    {
      title: 'Management',
      links: [
        { name: 'Staff Management', to: `${baseRoute}/admin/staff`, icon: Users },
        { name: 'Room Management', to: `${baseRoute}/admin/rooms`, icon: DoorClosed },
      ],
    },
  ];

  let sections = residentSections;
  if (user.role === 'staff') sections = staffSections;
  if (user.role === 'admin') sections = adminSections;

  const getRoleHeaderInfo = () => {
    switch (user.role) {
      case 'admin':
        return {
          title: 'Admin Operations',
          roleTag: 'Master Control',
          icon: Crown,
          accent: 'from-amber-500 to-indigo-600',
        };
      case 'staff':
        return {
          title: 'Technician Hub',
          roleTag: 'Field Service',
          icon: Wrench,
          accent: 'from-blue-600 to-indigo-600',
        };
      default:
        return {
          title: 'Resident Portal',
          roleTag: 'Hostel Resident',
          icon: Home,
          accent: 'from-purple-600 to-blue-600',
        };
    }
  };

  const roleInfo = getRoleHeaderInfo();
  const HeaderIcon = roleInfo.icon;
  const residentRoom = user.room?.roomNumber || 'Assigned';

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex transition-all">
      
      {/* Top Section */}
      <div className="space-y-5">
        
        {/* Workspace Card with Role Avatar */}
        <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${roleInfo.accent} text-white flex items-center justify-center shadow-xs flex-shrink-0`}>
              <HeaderIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs text-slate-800 truncate leading-tight">
                {roleInfo.title}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {roleInfo.roleTag}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Section Navigation Groups */}
        <div className="space-y-4">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {section.title}
              </div>
              <nav className="space-y-1">
                {section.links.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                            : item.highlight
                            ? 'text-blue-700 bg-blue-50/60 hover:bg-blue-100/70 border border-blue-200/50'
                            : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3 min-w-0">
                            <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                            <span className="truncate">{item.name}</span>
                          </div>

                          {item.badge !== undefined && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-1.5 flex-shrink-0 ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : item.badgeColor === 'amber'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Consistent Middle Widget for All Roles */}
        {user.role === 'resident' && (
          <div className="p-3.5 bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-purple-50/40 rounded-2xl border border-blue-100/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Your Room &amp; Desk
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-blue-800 border border-blue-200 shadow-2xs">
                Room {residentRoom}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              24/7 Warden emergency desk available for room repairs.
            </p>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition pt-0.5"
            >
              <Phone className="w-3 h-3 text-blue-500" />
              <span>Call Warden Desk</span>
            </a>
          </div>
        )}

        {user.role === 'staff' && (
          <div className="p-3.5 bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-slate-50 rounded-2xl border border-indigo-100/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                Technician On-Call
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-emerald-700 border border-emerald-200 shadow-2xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Shift
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5">
              <span>Jobs Assigned</span>
              <span className="font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                {pendingCount !== null ? `${pendingCount} Open` : '0 Open'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug">
              Check in with warden desk for urgent tickets.
            </p>
          </div>
        )}

        {user.role === 'admin' && (
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Hostel Facilities
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5">
              <span>Pending Tickets</span>
              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {pendingCount !== null ? pendingCount : '...'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Total Tickets</span>
              <span className="font-semibold text-slate-700">
                {complaintCount !== null ? complaintCount : '...'}
              </span>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Section: Profile Bar with Quick Logout */}
      <div className="pt-4 border-t border-slate-200/80">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 transition group">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs flex-shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs text-slate-800 truncate leading-tight">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-400 capitalize truncate">
                {user.role}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Sign out of FixMate"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer flex-shrink-0"
            aria-label="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
