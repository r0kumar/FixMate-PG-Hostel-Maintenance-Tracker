import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardFooter from './components/DashboardFooter';
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

// Resident Pages
import ResidentDashboard from './pages/resident/Dashboard';
import NewComplaint from './pages/resident/NewComplaint';
import MyComplaints from './pages/resident/MyComplaints';
import ComplaintDetails from './pages/resident/ComplaintDetails';

// Staff Pages
import StaffDashboard from './pages/staff/Dashboard';
import MyTasks from './pages/staff/MyTasks';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminComplaints from './pages/admin/Complaints';
import AdminStaff from './pages/admin/Staff';
import AdminRooms from './pages/admin/Rooms';

// Route for guests only (redirects authenticated users to their dashboard)
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

// Protected Route Component for authenticated users with role check
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, getRoleDashboard } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <img src={icon} alt="FixMate" className="w-14 h-14 object-contain animate-bounce drop-shadow-sm rounded-2xl" />
        <span className="text-sm font-semibold text-slate-600">Loading FixMate...</span>
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
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Pages with Full Footer */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Guest / Public Auth Routes */}
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

          {/* Resident Routes */}
          <Route element={<ProtectedRoute allowedRoles={['resident', 'admin']} />}>
            <Route path="/resident/dashboard" element={<ResidentDashboard />} />
            <Route path="/resident/new-complaint" element={<NewComplaint />} />
            <Route path="/resident/my-complaints" element={<MyComplaints />} />
            <Route path="/resident/complaints/:id" element={<ComplaintDetails />} />
          </Route>

          {/* Staff Routes */}
          <Route element={<ProtectedRoute allowedRoles={['staff', 'admin']} />}>
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/staff/tasks" element={<MyTasks />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/complaints" element={<AdminComplaints />} />
            <Route path="/admin/staff" element={<AdminStaff />} />
            <Route path="/admin/rooms" element={<AdminRooms />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
