import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Activity } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const FinanceDashboard = () => {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/expenses/pending', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setClaims(res.data);
    } catch (err) {
      console.error('Failed to fetch pending claims', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchClaims();
    }
  }, [user]);

  const handlePay = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/expenses/${id}/pay`, {
        financeComment: 'Paid via direct deposit'
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Claim marked as Paid!');
      fetchClaims();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="pb-12 bg-[#F8F7F2] min-h-screen">
      {/* Welcome Section */}
      <section className="bg-gray-900 text-white pt-12 pb-24 px-6 rounded-b-[3rem] shadow-sm relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-2">Finance Hub 💼</h1>
          <p className="text-gray-400 text-lg">Review and process verified expense claims.</p>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="container mx-auto px-6 max-w-6xl -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Total Paid" value="₹0" icon={<Activity />} color="bg-orange-50 text-orange-600" />
          <StatCard title="Recent Claims" value="-" icon={<DollarSign />} color="bg-green-50 text-green-600" />
          <StatCard title="Pending Payments" value={claims.length} icon={<CreditCard />} color="bg-blue-50 text-blue-600" />
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-black text-gray-900">Manager-Verified Claims Awaiting Payment</h2>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-4 font-medium">Claim ID</th>
                <th className="p-4 font-medium">Employee</th>
                <th className="p-4 font-medium">Trip Ref</th>
                <th className="p-4 font-medium">Claimed Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {claims.map(claim => (
                <tr key={claim._id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-primary">{claim.claimId}</td>
                  <td className="p-4 text-gray-900">{claim.employeeId?.name || 'Unknown'}</td>
                  <td className="p-4 text-gray-500 text-sm">{claim.requestId?.requestId}</td>
                  <td className="p-4 font-bold text-gray-900">₹{claim.totalAmount}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">{claim.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handlePay(claim._id)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover">Mark as Paid</button>
                  </td>
                </tr>
              ))}
              {claims.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No verified claims awaiting payment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
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

export default FinanceDashboard;
