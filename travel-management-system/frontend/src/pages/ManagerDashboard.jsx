import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, XCircle, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending');
  const [selectedExpense, setSelectedExpense] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/travel-requests/manager-all', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch requests', err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/expenses/manager-all', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setExpenses(res.data);
    } catch (err) {
      console.error('Failed to fetch pending expenses', err);
    } finally {
      setLoading(false);
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
      if (!comment) return;
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

  const pendingReqs = requests.filter(r => r.status === 'Pending Approval');
  const approvedReqs = requests.filter(r => ['Approved', 'Completed', 'Paid'].includes(r.status));
  const rejectedReqs = requests.filter(r => r.status === 'Rejected');
  const pendingExp = expenses.filter(e => e.status === 'Pending');
  const historyExp = expenses.filter(e => e.status !== 'Pending');

  const displayReqs = activeTab === 'Pending' ? pendingReqs : requests.filter(r => r.status !== 'Pending Approval');
  const displayExp = activeTab === 'Pending' ? pendingExp : historyExp;

  return (
    <div className="pb-12 bg-[#F8F7F2] min-h-screen">
      <section className="bg-gray-900 text-white pt-12 pb-24 px-6 rounded-b-[3rem] shadow-sm relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 text-lg">Here's what's happening with your team's travel.</p>
        </div>
      </section>

      <section className="container mx-auto px-6 max-w-6xl -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="Pending Requests" value={pendingReqs.length} icon={<FileText />} color="bg-orange-50 text-orange-600" />
          <StatCard title="Pending Expenses" value={pendingExp.length} icon={<Users />} color="bg-blue-50 text-blue-600" />
          <StatCard title="Approved Trips" value={approvedReqs.length} icon={<CheckCircle />} color="bg-green-50 text-green-600" />
          <StatCard title="Rejected Requests" value={rejectedReqs.length} icon={<XCircle />} color="bg-red-50 text-red-600" />
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {['Pending', 'History'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-bold text-sm ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-800'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-black text-gray-900">{activeTab === 'Pending' ? 'Pending Travel Approvals' : 'Travel Approvals History'}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="p-4 font-medium">Request ID</th>
                  <th className="p-4 font-medium">Employee</th>
                  <th className="p-4 font-medium">Details & Purpose</th>
                  <th className="p-4 font-medium">Cost Breakdown</th>
                  <th className="p-4 font-medium text-right">Actions / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayReqs.map(req => (
                  <tr key={req._id} className="hover:bg-gray-50 align-top">
                    <td className="p-4 font-medium text-primary">{req.requestId}</td>
                    <td className="p-4 text-gray-900">{req.employeeId?.name || 'Unknown'}</td>
                    <td className="p-4">
                      <div className="text-gray-900 font-bold mb-1">{req.destination}</div>
                      <div className="text-gray-500 text-sm mb-1">{req.purpose}</div>
                      <div className="text-xs text-gray-400 bg-gray-100 inline-block px-2 py-1 rounded">{req.travelMode || 'Flight'}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900 mb-1">₹{req.estimatedCosts?.total || 0}</div>
                      <div className="text-xs text-gray-500 flex flex-wrap gap-2">
                        <span>Travel: ₹{req.estimatedCosts?.travel || 0}</span>
                        <span>Hotel: ₹{req.estimatedCosts?.hotel || 0}</span>
                        <span>Food: ₹{req.estimatedCosts?.food || 0}</span>
                        <span>Other: ₹{req.estimatedCosts?.other || 0}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {req.status === 'Pending Approval' ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleStatusUpdate(req._id, 'Approved')} className="px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100">Approve</button>
                          <button onClick={() => handleStatusUpdate(req._id, 'Rejected')} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100">Reject</button>
                        </div>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {req.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {displayReqs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">No requests to show in this category.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-black text-gray-900">{activeTab === 'Pending' ? 'Expense Claims' : 'Expense Claims History'}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="p-4 font-medium">Claim ID</th>
                  <th className="p-4 font-medium">Employee</th>
                  <th className="p-4 font-medium">Total Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayExp.map(exp => (
                  <tr key={exp._id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-primary">{exp.claimId}</td>
                    <td className="p-4 text-gray-900">{exp.employeeId?.name || 'Unknown'}</td>
                    <td className="p-4 font-bold text-secondary">₹{exp.totalAmount}</td>
                    <td className="p-4 text-gray-600">{exp.status}</td>
                    <td className="p-4 text-right">
                      {exp.status === 'Pending' ? (
                        <button onClick={() => setSelectedExpense(exp)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100">
                          Verify Receipts
                        </button>
                      ) : (
                        <button onClick={() => setSelectedExpense(exp)} className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100">
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {displayExp.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">No expense claims found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedExpense && (
        <VerifyModal 
          expense={selectedExpense} 
          onClose={() => setSelectedExpense(null)} 
          onVerify={() => {
            handleVerifyExpense(selectedExpense._id);
            setSelectedExpense(null);
          }} 
        />
      )}
    </div>
  );
};

const VerifyModal = ({ expense, onClose, onVerify }) => {
  const items = expense.items?.length > 0 ? expense.items : [
    { category: 'Hotel', amount: 3200, id: 1, receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400' },
    { category: 'Food', amount: 850, id: 2, receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400' },
    { category: 'Transport', amount: 1500, id: 3, receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400' }
  ];
  
  const [verifiedItems, setVerifiedItems] = useState(new Set());
  const [viewReceipt, setViewReceipt] = useState(null);

  const handleToggle = (id) => {
    const newSet = new Set(verifiedItems);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setVerifiedItems(newSet);
  };

  const allVerified = verifiedItems.size === items.length;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><X size={24}/></button>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Verify Receipts</h3>
        <p className="text-gray-500 mb-6">{expense.claimId} - Total: ₹{expense.totalAmount}</p>
        
        <div className="space-y-4 mb-8">
          {items.map((item, idx) => (
            <div key={item._id || item.id || idx} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl bg-gray-50">
              <div>
                <p className="font-bold text-gray-900">{item.category}</p>
                <p className="text-gray-500 text-sm">₹{item.amount}</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setViewReceipt(item.receiptUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400')} 
                  className="text-sm text-blue-600 hover:underline cursor-pointer">
                  View Receipt
                </button>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary" checked={verifiedItems.has(item._id || item.id || idx)} onChange={() => handleToggle(item._id || item.id || idx)} />
                </label>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={onVerify} 
          disabled={!allVerified || expense.status !== 'Pending'}
          className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 ${
            allVerified && expense.status === 'Pending' ? 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-green-900/20' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {expense.status === 'Pending' ? (allVerified ? 'Approve All Receipts' : 'Verify All Receipts to Approve') : 'Already Verified'}
        </button>
      </div>

      {/* Nested Receipt View Modal */}
      {viewReceipt && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-2xl relative max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
             <button onClick={() => setViewReceipt(null)} className="absolute top-4 right-4 bg-white rounded-full p-1 text-gray-900 shadow-md"><X size={24}/></button>
             <h3 className="font-bold text-lg mb-4 pr-12">Receipt Document</h3>
                                       <div className="flex-1 overflow-auto bg-gray-100 rounded-lg flex items-center justify-center min-h-[50vh] w-full">
               {viewReceipt?.toLowerCase().endsWith('.pdf') ? (
                 <iframe src={viewReceipt.startsWith('/') ? `http://localhost:5000${viewReceipt}` : viewReceipt} className="w-full h-[80vh] border-0" title="Receipt PDF" />
               ) : (
                 <img src={viewReceipt?.startsWith('/') ? `http://localhost:5000${viewReceipt}` : viewReceipt} alt="Receipt" className="max-w-full max-h-[80vh] object-contain" />
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;





