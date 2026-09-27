import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path if the user was redirected to login
  const from = location.state?.from?.pathname || `/dashboard/${role}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser) {
        navigate(`/dashboard/${loggedInUser.role}`, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-secondary/10 -skew-y-6 transform origin-top-left -z-10"></div>
      
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex max-w-4xl w-full mx-6">
        
        {/* Left Side - Image/Branding */}
        <div className="hidden md:block w-1/2 bg-primary relative">
          <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop")' }}></div>
          <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white">
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-6 shadow-lg">
                <span className="text-white font-black text-2xl">T</span>
              </div>
              <h1 className="text-4xl font-black mb-4 tracking-tight">Corporate Travel, Simplified.</h1>
              <p className="text-green-100/80 text-lg">Manage requests, approvals, and expenses seamlessly in one professional platform.</p>
            </div>
            <div className="text-sm text-green-100/60 font-medium">
              © {new Date().getFullYear()} TripFlow
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-10 md:p-14">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Sign in to access your portal</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 flex items-center gap-2">
              <span className="block w-2 h-2 bg-red-600 rounded-full"></span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Quick Demo Logins */}
            <div className="space-y-2 mb-6">
              <label className="text-sm font-bold text-gray-700">Quick Demo Login</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => { setEmail('vrushali@company.com'); setPassword('password123'); }} className="flex-1 py-2 text-xs font-bold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">Employee</button>
                <button type="button" onClick={() => { setEmail('manager@company.com'); setPassword('password123'); }} className="flex-1 py-2 text-xs font-bold bg-green-50 text-green-600 rounded-lg hover:bg-green-100">Manager</button>
                <button type="button" onClick={() => { setEmail('finance@company.com'); setPassword('password123'); }} className="flex-1 py-2 text-xs font-bold bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100">Finance</button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Work Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl outline-none transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <a href="#" className="text-xs font-medium text-primary hover:text-primary-hover">Forgot Password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all flex justify-center items-center gap-2 group"
            >
              Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p className="font-bold mb-2">Demo Accounts (Password: password123)</p>
            <p>vrushali@company.com (Employee)</p>
            <p>manager@company.com (Manager)</p>
            <p>finance@company.com (Finance)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
