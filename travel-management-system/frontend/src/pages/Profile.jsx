import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Eye, EyeOff, User, Mail, MapPin, Phone, Lock, Camera } from 'lucide-react';

const Profile = () => {
  const { user, login } = useAuth(); // login function can update context user if needed
  const [profileData, setProfileData] = useState({
    name: '',
    address: '',
    mobile: '',
    profilePhoto: '',
    email: '' // read-only
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        address: user.address || '',
        mobile: user.mobile || '',
        profilePhoto: user.profilePhoto || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    try {
      const res = await axios.put('https://travel-backend-8eg5.onrender.com/api/users/profile', profileData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
      // Update local storage / context if necessary
      const updatedUser = { ...user, ...res.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      login(updatedUser); // if your context supports this to update the state
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' });
    }
    setLoading(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPwdMsg({ type: '', text: '' });
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPwdMsg({ type: 'error', text: 'New passwords do not match!' });
    }

    setLoading(true);
    try {
      await axios.put('https://travel-backend-8eg5.onrender.com/api/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setPwdMsg({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwdMsg({ type: 'error', text: err.response?.data?.error || 'Failed to change password' });
    }
    setLoading(false);
  };

  const toggleVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="min-h-screen bg-[#F8F7F2] py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 font-bold text-3xl overflow-hidden">
              {profileData.profilePhoto ? <img src={profileData.profilePhoto} className="w-full h-full object-cover" alt="Profile" /> : profileData.name.charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
              <Camera size={16} />
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">{profileData.name}</h1>
            <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">{user.role} {user.department ? `â€¢ ${user.department}` : ''}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Form */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><User size={20} className="text-primary"/> Personal Information</h2>
            
            {msg.text && (
              <div className={`p-4 rounded-xl mb-6 text-sm font-bold ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address <span className="text-xs text-gray-400 font-normal">(Admin Only)</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="email" value={profileData.email} disabled className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 text-gray-500 rounded-xl cursor-not-allowed" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="text" value={profileData.mobile} onChange={e => setProfileData({...profileData, mobile: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="text" value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Profile Photo URL</label>
                <div className="relative">
                  <Camera className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="text" value={profileData.profilePhoto} onChange={e => setProfileData({...profileData, profilePhoto: e.target.value})} placeholder="https://example.com/photo.jpg" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full mt-4 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-hover transition-colors">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Password Form */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Lock size={20} className="text-primary"/> Security</h2>
            
            {pwdMsg.text && (
              <div className={`p-4 rounded-xl mb-6 text-sm font-bold ${pwdMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {pwdMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type={showPasswords.current ? "text" : "password"} value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" required />
                  <button type="button" onClick={() => toggleVisibility('current')} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type={showPasswords.new ? "text" : "password"} value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" required />
                  <button type="button" onClick={() => toggleVisibility('new')} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type={showPasswords.confirm ? "text" : "password"} value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" required />
                  <button type="button" onClick={() => toggleVisibility('confirm')} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full mt-4 bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors">
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;

