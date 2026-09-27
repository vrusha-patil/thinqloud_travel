import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expenses, setExpenses] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/travel-requests/pending', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch pending requests', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/expenses/pending-manager', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setExpenses(res.data);
    } catch (err) {
      console.error('Failed to fetch pending expenses', err);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchRequests();
      fetchExpenses();
    }
  }, [user]);

  const handleStatusUpdate = async (id, status) => {
    let comment = '';
    if (status === 'Rejected') {
      comment = window.prompt("Please provide a reason for rejection:");
      if (!comment) return; // BR-6 enforced
    }

    try {
      await axios.patch(`http://localhost:5000/api/travel-requests/${id}/status`, {
        status,
        managerComment: comment
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert(`Request ${status} successfully!`);
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleVerifyExpense = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/expenses/${id}/verify`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Expense Verified successfully!');
      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="pb-12 bg-[#F8F7F2] min-h-screen">
      {/* Welcome Section */}
      <section className="bg-gray-900 text-white pt-12 pb-24 px-6 rounded-b-[3rem] shadow-sm relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-2">Good morning, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-gray-400 text-lg">Here's what's happening with your team's travel.</p>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="container mx-auto px-6 max-w-6xl -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="Pending Requests" value={requests.length} icon={<FileText />} color="bg-orange-50 text-orange-600" />
          <StatCard title="Pending Expenses" value={expenses.length} icon={<Users />} color="bg-blue-50 text-blue-600" />
          <StatCard title="Approved Trips" value="-" icon={<CheckCircle />} color="bg-green-50 text-green-600" />
          <StatCard title="Rejected Requests" value="-" icon={<XCircle />} color="bg-red-50 text-red-600" />
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-black text-gray-900">Pending Travel Approvals</h2>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-4 font-medium">Request ID</th>
                <th className="p-4 font-medium">Employee</th>
                <th className="p-4 font-medium">Destination</th>
                <th className="p-4 font-medium">Est. Cost</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map(req => (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-primary">{req.requestId}</td>
                  <td className="p-4 text-gray-900">{req.employeeId?.name || 'Unknown'}</td>
                  <td className="p-4 text-gray-600">{req.destination}</td>
                  <td className="p-4 font-medium">₹{req.estimatedCosts?.total || 0}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleStatusUpdate(req._id, 'Approved')} className="px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100">Approve</button>
                    <button onClick={() => handleStatusUpdate(req._id, 'Rejected')} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100">Reject</button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">No pending requests to review.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Pending Expense Verifications</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-4 font-medium">Claim ID</th>
                <th className="p-4 font-medium">Employee</th>
                <th className="p-4 font-medium">Trip Ref</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.map(exp => (
                <tr key={exp._id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-primary">{exp.claimId}</td>
                  <td className="p-4 text-gray-900">{exp.employeeId?.name || 'Unknown'}</td>
                  <td className="p-4 text-gray-600">{exp.requestId?.requestId} - {exp.requestId?.destination}</td>
                  <td className="p-4 font-medium text-orange-600">₹{exp.totalAmount}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleVerifyExpense(exp._id)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100">Verify Receipts</button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">No pending expenses to verify.</td>
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

export default ManagerDashboard;
