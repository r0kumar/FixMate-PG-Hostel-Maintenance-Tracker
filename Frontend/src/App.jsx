import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemoAuthProvider, useDemoAuth } from './context/DemoAuthContext';
import { SessionProvider } from './context/SessionContext';
import api from './services/api';
import demoApi from './services/demoApi';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardFooter from './components/DashboardFooter';
import DemoBanner from './components/DemoBanner';
import icon from './assets/icon.png';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Login from './pages/Login';
import Register from './pages/Register';
import Demo from './pages/Demo';

// Resident Pages
import ResidentDashboard from './pages/resident/Dashboard';
import NewComplaint from './pages/resident/NewComplaint';
import MyComplaints from './pages/resident/MyComplaints';
import ComplaintDetails from './pages/resident/ComplaintDetails';

// Staff Pages
import StaffDashboard from './pages/staff/Dashboard';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminComplaints from './pages/admin/Complaints';
import AdminStaff from './pages/admin/Staff';
import AdminRooms from './pages/admin/Rooms';

// Route for guests only (redirects authenticated real users to their dashboard)
const PublicOnlyRoute = ({ children }) => {
  const { user, loading, getRoleDashboard } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <img src={icon} alt="FixMate" className="w-14 h-14 object-contain animate-bounce drop-shadow-sm rounded-2xl" />
        <span className="text-sm font-semibold text-slate-600">Loading FixMate...</span>
      </div>
    );
  }

  if (user) {
    return <Navigate to={getRoleDashboard(user.role)} replace />;
  }

  return children;
};

// Route Guard for Real Authenticated Application Users
const RealProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, logout, getRoleDashboard } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <img src={icon} alt="FixMate" className="w-14 h-14 object-contain animate-bounce drop-shadow-sm rounded-2xl" />
        <span className="text-sm font-semibold text-slate-600">Verifying credentials...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleDashboard(user.role)} replace />;
  }

  return (
    <SessionProvider user={user} logout={logout} api={api} isDemo={false} baseRoute="/dashboard">
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
        <DashboardFooter />
      </div>
    </SessionProvider>
  );
};

// Route Guard for Sandbox Demo Users
const DemoProtectedRoute = ({ allowedRoles }) => {
  const { demoUser, demoLoading, logoutDemo, getDemoDashboard } = useDemoAuth();

  if (demoLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <img src={icon} alt="FixMate" className="w-14 h-14 object-contain animate-bounce drop-shadow-sm rounded-2xl" />
        <span className="text-sm font-semibold text-slate-600">Initializing Demo Sandbox...</span>
      </div>
    );
  }

  if (!demoUser) {
    return <Navigate to="/demo" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(demoUser.role)) {
    return <Navigate to={getDemoDashboard(demoUser.role)} replace />;
  }

  return (
    <SessionProvider user={demoUser} logout={logoutDemo} api={demoApi} isDemo={true} baseRoute="/demo">
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <DemoBanner />
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
        <DashboardFooter />
      </div>
    </SessionProvider>
  );
};

// Redirect helper for /dashboard root
const RealDashboardIndex = () => {
  const { user, loading, getRoleDashboard } = useAuth();
  if (loading) {
    return null;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={getRoleDashboard(user.role)} replace />;
};

function App() {
  return (
    <AuthProvider>
      <DemoAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Website Pages with Full Footer */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* FLOW A: Real Authentication Pages */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <Register />
                </PublicOnlyRoute>
              }
            />

            {/* FLOW A: Real Protected Dashboards (/dashboard/*) */}
            <Route path="/dashboard" element={<RealDashboardIndex />} />

            {/* Real Resident Routes */}
            <Route element={<RealProtectedRoute allowedRoles={['resident', 'admin']} />}>
              <Route path="/dashboard/resident" element={<ResidentDashboard />} />
              <Route path="/dashboard/resident/dashboard" element={<Navigate to="/dashboard/resident" replace />} />
              <Route path="/dashboard/resident/new-complaint" element={<NewComplaint />} />
              <Route path="/dashboard/resident/my-complaints" element={<MyComplaints />} />
              <Route path="/dashboard/resident/complaints/:id" element={<ComplaintDetails />} />
            </Route>

            {/* Real Staff Routes */}
            <Route element={<RealProtectedRoute allowedRoles={['staff', 'admin']} />}>
              <Route path="/dashboard/staff" element={<StaffDashboard />} />
              <Route path="/dashboard/staff/dashboard" element={<Navigate to="/dashboard/staff" replace />} />
              <Route path="/dashboard/staff/tasks" element={<StaffDashboard />} />
            </Route>

            {/* Real Admin Routes */}
            <Route element={<RealProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/dashboard/admin/dashboard" element={<Navigate to="/dashboard/admin" replace />} />
              <Route path="/dashboard/admin/complaints" element={<AdminComplaints />} />
              <Route path="/dashboard/admin/staff" element={<AdminStaff />} />
              <Route path="/dashboard/admin/rooms" element={<AdminRooms />} />
            </Route>

            {/* FLOW B: Interactive Demo Role Selection (Public) */}
            <Route path="/demo" element={<Demo />} />

            {/* FLOW B: Interactive Demo Dashboards (/demo/*) */}
            {/* Demo Resident Routes */}
            <Route element={<DemoProtectedRoute allowedRoles={['resident', 'admin']} />}>
              <Route path="/demo/resident" element={<ResidentDashboard />} />
              <Route path="/demo/resident/dashboard" element={<Navigate to="/demo/resident" replace />} />
              <Route path="/demo/resident/new-complaint" element={<NewComplaint />} />
              <Route path="/demo/resident/my-complaints" element={<MyComplaints />} />
              <Route path="/demo/resident/complaints/:id" element={<ComplaintDetails />} />
            </Route>

            {/* Demo Staff Routes */}
            <Route element={<DemoProtectedRoute allowedRoles={['staff', 'admin']} />}>
              <Route path="/demo/staff" element={<StaffDashboard />} />
              <Route path="/demo/staff/dashboard" element={<Navigate to="/demo/staff" replace />} />
              <Route path="/demo/staff/tasks" element={<StaffDashboard />} />
            </Route>

            {/* Demo Admin Routes */}
            <Route element={<DemoProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/demo/admin" element={<AdminDashboard />} />
              <Route path="/demo/admin/dashboard" element={<Navigate to="/demo/admin" replace />} />
              <Route path="/demo/admin/complaints" element={<AdminComplaints />} />
              <Route path="/demo/admin/staff" element={<AdminStaff />} />
              <Route path="/demo/admin/rooms" element={<AdminRooms />} />
            </Route>

            {/* Legacy URL Backward Compatibility Redirects */}
            <Route path="/resident" element={<Navigate to="/dashboard/resident" replace />} />
            <Route path="/resident/dashboard" element={<Navigate to="/dashboard/resident" replace />} />
            <Route path="/resident/new-complaint" element={<Navigate to="/dashboard/resident/new-complaint" replace />} />
            <Route path="/resident/my-complaints" element={<Navigate to="/dashboard/resident/my-complaints" replace />} />

            <Route path="/staff" element={<Navigate to="/dashboard/staff" replace />} />
            <Route path="/staff/dashboard" element={<Navigate to="/dashboard/staff" replace />} />
            <Route path="/staff/tasks" element={<Navigate to="/dashboard/staff/tasks" replace />} />

            <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
            <Route path="/admin/dashboard" element={<Navigate to="/dashboard/admin" replace />} />
            <Route path="/admin/complaints" element={<Navigate to="/dashboard/admin/complaints" replace />} />
            <Route path="/admin/staff" element={<Navigate to="/dashboard/admin/staff" replace />} />
            <Route path="/admin/rooms" element={<Navigate to="/dashboard/admin/rooms" replace />} />

            {/* Global Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DemoAuthProvider>
    </AuthProvider>
  );
}

export default App;
