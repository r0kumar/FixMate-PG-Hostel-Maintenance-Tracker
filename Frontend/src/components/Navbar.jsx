import React, { useState, useEffect, useRef } from 'react';
import { useSession } from '../context/SessionContext';
import icon from '../assets/icon.png';
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  CheckSquare,
  Users,
  DoorClosed,
  Search,
  Home,
  Loader2,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, api, isDemo, baseRoute } = useSession();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate(isDemo ? '/demo' : '/login');
  };

  const residentLinks = [
    { name: 'Dashboard', to: `${baseRoute}/resident`, icon: LayoutDashboard },
    { name: 'New Complaint', to: `${baseRoute}/resident/new-complaint`, icon: PlusCircle },
    { name: 'My Complaints', to: `${baseRoute}/resident/my-complaints`, icon: ClipboardList },
  ];

  const staffLinks = [
    { name: 'Dashboard', to: `${baseRoute}/staff`, icon: LayoutDashboard },
    { name: 'My Tasks', to: `${baseRoute}/staff/tasks`, icon: CheckSquare },
  ];

  const adminLinks = [
    { name: 'Dashboard', to: `${baseRoute}/admin`, icon: LayoutDashboard },
    { name: 'Complaints', to: `${baseRoute}/admin/complaints`, icon: ClipboardList },
    { name: 'Staff Management', to: `${baseRoute}/admin/staff`, icon: Users },
    { name: 'Room Management', to: `${baseRoute}/admin/rooms`, icon: DoorClosed },
  ];

  let links = residentLinks;
  if (user?.role === 'staff') links = staffLinks;
  if (user?.role === 'admin') links = adminLinks;

  const residentRoom = user?.room?.roomNumber || 'Room Assigned';

  // Global Ctrl+K / Cmd+K keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setDropdownOpen(true);
      }
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced real-time search query
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const { data } = await api.get('/complaints', {
          params: { search: searchTerm.trim() },
        });
        setSearchResults(Array.isArray(data) ? data.slice(0, 6) : []);
        setDropdownOpen(true);
      } catch (err) {
        console.error('Navbar search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Navigate when form is submitted (e.g. Enter key pressed)
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    setDropdownOpen(false);
    const query = encodeURIComponent(searchTerm.trim());

    if (user?.role === 'resident') {
      navigate(`${baseRoute}/resident/my-complaints?search=${query}`);
    } else if (user?.role === 'staff') {
      navigate(`${baseRoute}/staff/tasks?search=${query}`);
    } else if (user?.role === 'admin') {
      navigate(`${baseRoute}/admin/complaints?search=${query}`);
    }
  };

  // Navigate when a specific result is clicked
  const handleSelectResult = (item) => {
    setDropdownOpen(false);
    setSearchTerm('');

    if (user?.role === 'resident') {
      navigate(`${baseRoute}/resident/complaints/${item._id}`);
    } else if (user?.role === 'staff') {
      navigate(`${baseRoute}/staff/tasks?search=${encodeURIComponent(item.title)}`);
    } else if (user?.role === 'admin') {
      navigate(`${baseRoute}/admin/complaints?search=${encodeURIComponent(item.title)}`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-2.5 h-2.5" /> Resolved
          </span>
        );
      case 'in_progress':
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
            <Clock className="w-2.5 h-2.5" /> In Progress
          </span>
        );
      case 'assigned':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
            <Clock className="w-2.5 h-2.5" /> Assigned
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
            <AlertCircle className="w-2.5 h-2.5" /> Pending
          </span>
        );
    }
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-40 transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          
          {/* Left: Brand Identity aligned with sidebar */}
          <div className="flex items-center gap-3">
            {user && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 md:hidden transition"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link
              to="/"
              className="flex items-center gap-2.5 group transition-transform active:scale-95"
              aria-label="FixMate Home"
            >
              <img
                src={icon}
                alt="FixMate"
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-xl shadow-xs transition-transform group-hover:scale-105"
              />
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Fix<span className="text-purple-600">Mate</span>
                </span>
                <span className="hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100/90 px-2 py-0.5 rounded-md border border-slate-200/70">
                  Tracker
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Interactive Live Search Bar */}
          <div ref={searchContainerRef} className="hidden md:flex relative flex-1 max-w-lg mx-4">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => {
                    if (searchTerm.trim()) setDropdownOpen(true);
                  }}
                  placeholder="Search complaints, rooms, maintenance..."
                  className="w-full pl-10 pr-20 py-2 bg-slate-50/90 border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition outline-none"
                />

                <div className="absolute right-2.5 flex items-center gap-1.5">
                  {isSearching ? (
                    <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                  ) : searchTerm ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setSearchResults([]);
                        setDropdownOpen(false);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <kbd className="hidden lg:inline-flex items-center text-[10px] text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs font-mono select-none">
                      ⌘K
                    </kbd>
                  )}
                </div>
              </div>
            </form>

            {/* Live Search Results Dropdown */}
            {dropdownOpen && searchTerm.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/90 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>
                    {isSearching
                      ? 'Searching...'
                      : `Found ${searchResults.length} match${searchResults.length === 1 ? '' : 'es'}`}
                  </span>
                  <span className="text-[10px] text-slate-400">Press Enter for all</span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => handleSelectResult(item)}
                        className="w-full text-left p-3 hover:bg-slate-50/90 transition flex items-start justify-between gap-3 group cursor-pointer"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                              {item.title}
                            </span>
                            {item.roomNumber && (
                              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">
                                Room {item.roomNumber}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                              #{item.category}
                            </span>
                            {item.resident?.name && (
                              <span className="text-[10px] text-slate-400 truncate">
                                By {item.resident.name}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0 pt-0.5">
                          {getStatusBadge(item.status)}
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                        </div>
                      </button>
                    ))
                  ) : !isSearching ? (
                    <div className="py-8 px-4 text-center">
                      <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-700">No matching complaints found</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Try searching by room number, category, or title keyword
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="p-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="w-full text-center py-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                  >
                    View all matching results in list &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Actions, Status & User Profile */}
          {user && (
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              
              {/* Room pill for residents */}
              {user.role === 'resident' && (
                <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700">
                  <Home className="w-3.5 h-3.5 text-blue-600" />
                  <span>{residentRoom}</span>
                </div>
              )}

              {/* Status pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="capitalize">{user.role} Online</span>
              </div>

              {/* Action shortcut for resident */}
              {user.role === 'resident' && (
                <Link
                  to={`${baseRoute}/resident/new-complaint`}
                  className="hidden sm:inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-xs hover:shadow-sm shadow-blue-500/20 active:scale-[0.98]"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>New Ticket</span>
                </Link>
              )}

              {/* Action shortcut for admin */}
              {user.role === 'admin' && (
                <Link
                  to={`${baseRoute}/admin/complaints`}
                  className="hidden sm:inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-xs hover:shadow-sm shadow-blue-500/20 active:scale-[0.98]"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Complaints</span>
                </Link>
              )}

              {/* Divider */}
              <div className="h-6 w-px bg-slate-200 hidden sm:block" />

              {/* Unified Profile Card */}
              <div className="flex items-center gap-2.5 pl-1 py-1">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden md:block text-left text-xs">
                  <p className="font-bold text-slate-800 leading-tight truncate max-w-[130px]">
                    {user.name}
                  </p>
                  <span className="inline-block text-[10px] font-bold text-blue-600 capitalize">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Logout of FixMate"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/90 hover:border-rose-200 rounded-xl transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && user && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 mb-1">
            <img src={icon} alt="FixMate" className="w-6 h-6 object-contain rounded-md" />
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
              <p className="text-[10px] font-medium text-slate-400 capitalize">{user.role} Portal</p>
            </div>
            <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full ml-auto">
              {user.role}
            </span>
          </div>

          {/* Mobile Search Input */}
          <form
            onSubmit={(e) => {
              setMobileMenuOpen(false);
              handleSearchSubmit(e);
            }}
            className="px-1"
          >
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search complaints, rooms..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 p-1 text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
