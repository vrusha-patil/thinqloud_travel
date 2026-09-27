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

import Home from './pages/public/Home';

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
            </>
          ) : (
            <Link to="/" className="text-gray-600 font-bold hover:text-primary transition-colors">Home</Link>
          )}
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
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-black border border-orange-100 shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-gray-50 rounded-lg hover:bg-red-50" title="Logout">
                <LogOut size={18} />
              </button>
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

const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Home />;
  if (user.role === 'manager') return <Navigate to="/dashboard/manager" replace />;
  if (user.role === 'finance') return <Navigate to="/dashboard/finance" replace />;
  return <Navigate to="/dashboard/employee" replace />;
};

const Footer = () => {
  const location = useLocation();
  if (location.pathname === '/') return null;

  return (
    <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
      <div className="container mx-auto px-6 text-center text-gray-500 text-sm font-medium">
        &copy; {new Date().getFullYear()} TripFlow. All rights reserved.
      </div>
    </footer>
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
              
              {/* Default root routes based on auth */}
              <Route path="/" element={<RootRedirect />} />

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
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
