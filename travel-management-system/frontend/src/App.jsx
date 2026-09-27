import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import FinanceDashboard from './pages/FinanceDashboard';
import ExpenseClaimForm from './pages/ExpenseClaimForm';
import CreateRequestForm from './pages/CreateRequestForm';
import Login from './pages/auth/Login';
import AboutUs from './pages/public/AboutUs';
import ContactUs from './pages/public/ContactUs';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { LogOut, User } from 'lucide-react';

import AdminDashboard from './pages/AdminDashboard';
import Features from './pages/public/Features';
import TravelPolicy from './pages/public/TravelPolicy';
import Home from './pages/public/Home';
import Profile from './pages/Profile';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide nav on login page and home page because they have their own or don't need it
  if (location.pathname === '/login' || location.pathname === '/') return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-surface shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white font-black text-lg">T</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 leading-none tracking-tight">TripFlow</h1>
            <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Corporate</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          {user ? (
            <>
              {user.role === 'employee' && <Link to="/dashboard/employee" className="text-gray-600 font-bold hover:text-primary transition-colors">My Dashboard</Link>}
              {user.role === 'manager' && <Link to="/dashboard/manager" className="text-gray-600 font-bold hover:text-primary transition-colors">Manager Portal</Link>}
              {user.role === 'finance' && <Link to="/dashboard/finance" className="text-gray-600 font-bold hover:text-primary transition-colors">Finance Portal</Link>}
              {user.role === 'admin' && <Link to="/dashboard/admin" className="text-gray-600 font-bold hover:text-primary transition-colors">Admin Portal</Link>}
            </>
          ) : (
            <Link to="/" className="text-gray-600 font-bold hover:text-primary transition-colors">Home</Link>
          )}
          <Link to="/features" className="text-gray-600 font-bold hover:text-primary transition-colors">Features</Link>
          <Link to="/policy" className="text-gray-600 font-bold hover:text-primary transition-colors">Policy</Link>
          <Link to="/about" className="text-gray-600 font-bold hover:text-primary transition-colors">About Us</Link>
          <Link to="/contact" className="text-gray-600 font-bold hover:text-primary transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">{user.name}</p>
                <p className="text-xs text-gray-500 font-bold uppercase">{user.role}</p>
              </div>
              <div className="relative group">
                <button className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-black border border-orange-100 shadow-sm overflow-hidden cursor-pointer">
                  {user.profilePhoto ? <img src={user.profilePhoto} className="w-full h-full object-cover" alt="Profile" /> : user.name?.charAt(0).toUpperCase()}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 hidden group-hover:block transition-all">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium">Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium flex items-center gap-2">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-bold transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#F8F7F2]">
          <Navigation />

          {/* Main Content */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              
              <Route path="/" element={<Home />} />
              
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['employee', 'manager', 'finance', 'admin']}>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* Protected Dashboards */}
              <Route path="/dashboard/employee" element={
                <ProtectedRoute allowedRoles={['employee', 'manager', 'finance']}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/employee/create" element={
                <ProtectedRoute allowedRoles={['employee', 'manager', 'finance']}>
                  <CreateRequestForm />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/employee/expense-claim/:id" element={
                <ProtectedRoute allowedRoles={['employee', 'manager', 'finance']}>
                  <ExpenseClaimForm />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/manager" element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/finance" element={
                <ProtectedRoute allowedRoles={['finance']}>
                  <FinanceDashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/features" element={<Features />} />
              <Route path="/policy" element={<TravelPolicy />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
