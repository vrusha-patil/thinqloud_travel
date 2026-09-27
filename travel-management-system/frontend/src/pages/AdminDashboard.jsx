import React, { useState, useEffect } from 'react';
import { Users, Shield, Activity, X, Edit, Trash2, Search, ArrowUpDown, CheckCircle, PlaneTakeoff, Printer, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'trips'

  // Users Filter & Sort State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSortField, setUserSortField] = useState('name');
  const [userSortOrder, setUserSortOrder] = useState('asc'); 

  // Trips Filter & Sort State
  const [tripSearch, setTripSearch] = useState('');
  const [tripMonthFilter, setTripMonthFilter] = useState('all');
  const [tripYearFilter, setTripYearFilter] = useState('all');
  const [tripStatusFilter, setTripStatusFilter] = useState('all');
  const [tripSortField, setTripSortField] = useState('createdAt');
  const [tripSortOrder, setTripSortOrder] = useState('desc');

  // Modals state
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'employee', department: '', customId: '', address: '', joiningDate: '', otp: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchData = async () => {
    if (user?.token) {
      try {
        const [usersRes, tripsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/users', { headers: { Authorization: `Bearer ${user.token}` } }),
          axios.get('http://localhost:5000/api/admin/trips', { headers: { Authorization: `Bearer ${user.token}` } }).catch(() => ({ data: [] }))
        ]);
        setUsers(usersRes.data);
        setTrips(tripsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Stats
  const totalEmployees = users.filter(u => u.role === 'employee').length;
  const totalManagers = users.filter(u => u.role === 'manager').length;
  const totalUsersCount = users.length;
  const totalTripsCount = trips.length;

  const handleOpenUserModal = (u = null) => {
    setOtpSent(false);
    setOtpVerified(false);
    if (u) {
      setEditingUser(u);
      setUserFormData({ 
        name: u.name, email: u.email, password: '', confirmPassword: '', role: u.role, department: u.department || '', 
        customId: u.customId || '', address: u.address || '', joiningDate: u.joiningDate ? u.joiningDate.split('T')[0] : '', otp: '' 
      });
    } else {
      setEditingUser(null);
      setUserFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'employee', department: '', customId: '', address: '', joiningDate: '', otp: '' });
    }
    setShowUserModal(true);
  };

  const handleSendOtp = async () => {
    if (!userFormData.email) return alert('Please enter an email first');
    try {
      await axios.post('http://localhost:5000/api/admin/users/send-otp', { email: userFormData.email }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setOtpSent(true);
      alert('OTP sent to email successfully');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (!userFormData.email || !userFormData.otp) return alert('Please enter OTP');
    try {
      await axios.post('http://localhost:5000/api/admin/users/verify-otp', { 
        email: userFormData.email, 
        otp: userFormData.otp 
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setOtpVerified(true);
      alert('Email Verified Successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Invalid OTP');
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!editingUser && userFormData.password !== userFormData.confirmPassword) {
      return alert("Passwords do not match");
    }
    
    try {
      if (editingUser) {
        await axios.put(`http://localhost:5000/api/admin/users/${editingUser._id}`, userFormData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      } else {
        if (!otpVerified) return alert('Please verify OTP before adding user.');
        await axios.post('http://localhost:5000/api/admin/users', userFormData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      }
      setShowUserModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchData();
      } catch (err) {
        alert(err.response?.data?.error || 'Error deleting user');
      }
    }
  };

  const getCustomIdLabel = () => {
    switch (userFormData.role) {
      case 'manager': return 'Manager ID';
      case 'admin': return 'Admin ID';
      case 'finance': return 'Finance ID';
      default: return 'Employee ID';
    }
  };

  const handleUserSort = (field) => {
    if (userSortField === field) {
      setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setUserSortField(field);
      setUserSortOrder('asc');
    }
  };

  const handleTripSort = (field) => {
    if (tripSortField === field) {
      setTripSortOrder(tripSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setTripSortField(field);
      setTripSortOrder('asc');
    }
  };

  const printTripsReport = () => {
    window.print();
  };

  // Filter & Sort Users
  const filteredAndSortedUsers = users
    .filter(u => {
      const term = userSearch.toLowerCase();
      const matchesSearch = u.name.toLowerCase().includes(term) || (u.address && u.address.toLowerCase().includes(term)) || (u.department && u.department.toLowerCase().includes(term));
      const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let valA = userSortField === 'id' ? (a.customId || '') : (a[userSortField] || '');
      let valB = userSortField === 'id' ? (b.customId || '') : (b[userSortField] || '');
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return userSortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return userSortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Filter & Sort Trips
  const filteredAndSortedTrips = trips
    .filter(t => {
      const term = tripSearch.toLowerCase();
      const dest = t.destination ? t.destination.toLowerCase() : '';
      const userName = t.employeeId?.name ? t.employeeId.name.toLowerCase() : '';
      const matchesSearch = dest.includes(term) || userName.includes(term);
      const matchesStatus = tripStatusFilter === 'all' || t.status === tripStatusFilter;
      
      const tripDate = new Date(t.createdAt);
      const matchesMonth = tripMonthFilter === 'all' || tripDate.getMonth() + 1 === parseInt(tripMonthFilter);
      const matchesYear = tripYearFilter === 'all' || tripDate.getFullYear() === parseInt(tripYearFilter);

      return matchesSearch && matchesStatus && matchesMonth && matchesYear;
    })
    .sort((a, b) => {
      let valA = a[tripSortField] || '';
      let valB = b[tripSortField] || '';

      if (tripSortField === 'userName') {
        valA = a.employeeId?.name || '';
        valB = b.employeeId?.name || '';
      }
      
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return tripSortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return tripSortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="pb-12 bg-[#F8F7F2] min-h-screen">
      {/* Welcome Section (Hidden when printing) */}
      <section className="bg-gray-900 text-white pt-12 pb-24 px-6 rounded-b-[3rem] shadow-sm relative print:hidden">
        <div className="container mx-auto max-w-7xl relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2">System Admin Control</h1>
            <p className="text-gray-400 text-lg">Manage users, security, and employee trips.</p>
          </div>
          <button onClick={() => handleOpenUserModal()} className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
            <Users size={20} /> Add New User
          </button>
        </div>
      </section>

      {/* Dashboard Stats (Hidden when printing) */}
      <section className="container mx-auto px-6 max-w-7xl -mt-12 relative z-20 print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Employees" value={totalEmployees} icon={<Users />} color="bg-blue-50 text-blue-600" />
          <StatCard title="Active Managers" value={totalManagers} icon={<Shield />} color="bg-orange-50 text-orange-600" />
          <StatCard title="Total Users" value={totalUsersCount} icon={<Users />} color="bg-green-50 text-green-600" />
          <StatCard title="Total Trips Logged" value={totalTripsCount} icon={<PlaneTakeoff />} color="bg-purple-50 text-purple-600" />
        </div>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button onClick={() => setActiveTab('users')} className={`pb-3 px-2 font-bold transition-colors ${activeTab === 'users' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-800'}`}>User Directory</button>
          <button onClick={() => setActiveTab('trips')} className={`pb-3 px-2 font-bold transition-colors ${activeTab === 'trips' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-800'}`}>Employee Trips Report</button>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Print Header (Only visible when printing) */}
        <div className="hidden print:block mb-8 text-center">
          <h1 className="text-3xl font-black mb-2">Employee Trips Report</h1>
          <p className="text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-grow print:hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-black text-gray-900">User Management</h2>
              <div className="flex flex-wrap items-center gap-4">
                <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="all">All Roles</option>
                  <option value="employee">Employees</option>
                  <option value="manager">Managers</option>
                  <option value="finance">Finance</option>
                  <option value="admin">Admins</option>
                </select>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input type="text" placeholder="Search name, dept, address..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleUserSort('id')}>ID <ArrowUpDown size={14} className="inline ml-1 opacity-50"/></th>
                    <th className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleUserSort('name')}>Name <ArrowUpDown size={14} className="inline ml-1 opacity-50"/></th>
                    <th className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleUserSort('role')}>Role <ArrowUpDown size={14} className="inline ml-1 opacity-50"/></th>
                    <th className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleUserSort('department')}>Department <ArrowUpDown size={14} className="inline ml-1 opacity-50"/></th>
                    <th className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleUserSort('joiningDate')}>Joined <ArrowUpDown size={14} className="inline ml-1 opacity-50"/></th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAndSortedUsers.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="p-4 font-bold text-gray-900">{u.customId || '-'}</td>
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          u.role === 'admin' ? 'bg-red-100 text-red-700' :
                          u.role === 'manager' ? 'bg-orange-100 text-orange-700' :
                          u.role === 'finance' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>{u.role.toUpperCase()}</span>
                      </td>
                      <td className="p-4 text-gray-600 font-medium text-sm">{u.department || '-'}</td>
                      <td className="p-4 text-gray-600 text-sm">{u.joiningDate ? new Date(u.joiningDate).toLocaleDateString() : '-'}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleOpenUserModal(u)} className="text-sm font-medium text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit size={16}/></button>
                        <button onClick={() => handleDeleteUser(u._id)} className="text-sm font-medium text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors ml-1"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                  {filteredAndSortedUsers.length === 0 && !loading && (
                    <tr><td colSpan="6" className="p-8 text-center text-gray-500 font-medium">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'trips' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-grow">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2"><PlaneTakeoff size={20}/> All Trips</h2>
              <div className="flex flex-wrap items-center gap-3">
                <select value={tripStatusFilter} onChange={e => setTripStatusFilter(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="all">All Statuses</option>
                  <option value="Pending Approval">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <select value={tripMonthFilter} onChange={e => setTripMonthFilter(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="all">All Months</option>
                  {[...Array(12).keys()].map(i => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('en-US', {month:'short'})}</option>)}
                </select>
                <select value={tripYearFilter} onChange={e => setTripYearFilter(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="all">All Years</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
                <div className="relative w-full md:w-48">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input type="text" placeholder="Search user, dest..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" value={tripSearch} onChange={e => setTripSearch(e.target.value)} />
                </div>
                <button onClick={printTripsReport} className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                  <Printer size={16} /> Print Report
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleTripSort('createdAt')}>Date Logged <ArrowUpDown size={14} className="inline ml-1 opacity-50"/></th>
                    <th className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleTripSort('userName')}>Employee <ArrowUpDown size={14} className="inline ml-1 opacity-50"/></th>
                    <th className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleTripSort('destination')}>Destination <ArrowUpDown size={14} className="inline ml-1 opacity-50"/></th>
                    <th className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleTripSort('dates')}>Travel Dates <ArrowUpDown size={14} className="inline ml-1 opacity-50"/></th>
                    <th className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleTripSort('status')}>Status <ArrowUpDown size={14} className="inline ml-1 opacity-50"/></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAndSortedTrips.map(t => (
                    <tr key={t._id} className="hover:bg-gray-50">
                      <td className="p-4 text-gray-600 font-medium text-sm">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{t.employeeId?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{t.employeeId?.customId || '-'}</p>
                      </td>
                      <td className="p-4 font-bold text-gray-900">{t.destination}</td>
                      <td className="p-4 text-gray-600 text-sm">{new Date(t.startDate).toLocaleDateString()} - {new Date(t.endDate).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          t.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          t.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>{t.status.toUpperCase()}</span>
                      </td>
                    </tr>
                  ))}
                  {filteredAndSortedTrips.length === 0 && !loading && (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-500 font-medium">No trips found matching criteria.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* User Modal (Hidden when printing) */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:hidden">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowUserModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><X size={24}/></button>
            <h2 className="text-2xl font-black mb-6">{editingUser ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                  <select value={userFormData.role} onChange={e => setUserFormData({...userFormData, role: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="finance">Finance</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">{getCustomIdLabel()}</label>
                  <input type="text" required value={userFormData.customId} onChange={e => setUserFormData({...userFormData, customId: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. EMP-101" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <input type="text" required value={userFormData.name} onChange={e => setUserFormData({...userFormData, name: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                  <input type="email" required value={userFormData.email} onChange={e => setUserFormData({...userFormData, email: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Verify Email</label>
                    {otpVerified ? (
                      <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 border border-green-200 rounded-xl">
                        <CheckCircle size={18} /> Verified!
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input type="text" placeholder="Enter OTP" required={otpSent} value={userFormData.otp} onChange={e => setUserFormData({...userFormData, otp: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                        {!otpSent ? (
                          <button type="button" onClick={handleSendOtp} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-colors whitespace-nowrap text-sm">
                            Send OTP
                          </button>
                        ) : (
                          <button type="button" onClick={handleVerifyOtp} className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-colors whitespace-nowrap text-sm">
                            Verify
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {!editingUser && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} required value={userFormData.password} onChange={e => setUserFormData({...userFormData, password: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password</label>
                    <div className="relative">
                      <input type={showConfirmPassword ? "text" : "password"} required value={userFormData.confirmPassword} onChange={e => setUserFormData({...userFormData, confirmPassword: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                  <input type="text" value={userFormData.department} onChange={e => setUserFormData({...userFormData, department: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Joining Date</label>
                  <input type="date" value={userFormData.joiningDate} onChange={e => setUserFormData({...userFormData, joiningDate: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                <textarea rows="2" value={userFormData.address} onChange={e => setUserFormData({...userFormData, address: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"></textarea>
              </div>
              <button type="submit" className="w-full mt-6 bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary-hover transition-colors flex items-center justify-center gap-2">
                <CheckCircle size={18} /> {editingUser ? 'Update User' : 'Create Verified User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;




