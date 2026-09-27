import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Activity, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const FinanceDashboard = () => {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending');
  const [selectedExpense, setSelectedExpense] = useState(null);

  const fetchClaims = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/expenses/finance-all', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setClaims(res.data);
    } catch (err) {
      console.error('Failed to fetch claims', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchClaims();
    }
  }, [user]);

  const handlePay = async (id, paymentId = 'Manual') => {
    try {
      await axios.patch(`http://localhost:5000/api/expenses/${id}/pay`, {
        financeComment: 'Paid via direct deposit', paymentId
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Claim marked as Paid!');
      fetchClaims();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

    const handleRazorpayDemo = async (claim) => {
    // Dynamically load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      const options = {
        key: 'rzp_test_ThA4e5FYX09HFG', // Replace with a real test key if needed
        amount: claim.totalAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'TripFlow Corp',
        description: `Reimbursement for Claim ${claim.claimId}`,
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=150',
        handler: function (response) {
          // Fake success handling for demo purposes
          handlePay(claim._id, response.razorpay_payment_id);
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: claim.employeeId?.name || 'Employee',
          email: 'finance@tripflow.com',
          contact: '9999999999'
        },
        theme: {
          color: '#2563EB' // TripFlow Primary Color
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert('Payment Failed: ' + response.error.description);
      });
      rzp.open();
    };
    document.body.appendChild(script);
  };

  const pendingClaims = claims.filter(c => c.status === 'Verified');
  const historyClaims = claims.filter(c => c.status === 'Paid');
  const displayClaims = activeTab === 'Pending' ? pendingClaims : historyClaims;

  return (
    <div className="pb-12 bg-[#F8F7F2] min-h-screen">
      {/* Welcome Section */}
      <section className="bg-gray-900 text-white pt-12 pb-24 px-6 rounded-b-[3rem] shadow-sm relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-2">Finance Hub</h1>
          <p className="text-gray-400 text-lg">Review and process verified expense claims.</p>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="container mx-auto px-6 max-w-6xl -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Total Paid" value={historyClaims.length} icon={<Activity />} color="bg-orange-50 text-orange-600" />
          <StatCard title="Recent Claims" value={claims.length} icon={<DollarSign />} color="bg-green-50 text-green-600" />
          <StatCard title="Pending Payments" value={pendingClaims.length} icon={<CreditCard />} color="bg-blue-50 text-blue-600" />
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

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-black text-gray-900">{activeTab === 'Pending' ? 'Manager-Verified Claims Awaiting Payment' : 'Paid Claims History'}</h2>
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
                {displayClaims.map(claim => (
                                    <tr key={claim._id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-primary">
                      {claim.claimId}
                      {claim.paymentReference && <div className="text-xs text-gray-500 mt-1">Ref: {claim.paymentReference}</div>}
                    </td>
                    <td className="p-4 text-gray-900">{claim.employeeId?.name || 'Unknown'}</td>
                    <td className="p-4 text-gray-500 text-sm">{claim.requestId?.requestId}</td>
                    <td className="p-4 font-bold text-gray-900">₹{claim.totalAmount}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${claim.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{claim.status}</span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2 flex-wrap">
                      <button onClick={() => setSelectedExpense(claim)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">View Receipts</button>
                      {activeTab === 'Pending' && (
                        <>
                          <button onClick={() => handleRazorpayDemo(claim)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Pay via Razorpay</button>
                          <button onClick={() => handlePay(claim._id)} className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100">Mark Paid Manually</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {displayClaims.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">No claims found in this category.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedExpense && (
        <FinanceReceiptModal 
          expense={selectedExpense} 
          onClose={() => setSelectedExpense(null)} 
        />
      )}
    </div>
  );
};

const FinanceReceiptModal = ({ expense, onClose }) => {
  const items = expense.items?.length > 0 ? expense.items : [
    { category: 'Hotel', amount: 3200, id: 1, receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400' },
    { category: 'Food', amount: 850, id: 2, receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400' },
    { category: 'Transport', amount: 1500, id: 3, receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400' }
  ];
  
  const [viewReceipt, setViewReceipt] = useState(null);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><X size={24}/></button>
        <h3 className="text-2xl font-black text-gray-900 mb-2">View Receipts</h3>
        <p className="text-gray-500 mb-6">{expense.claimId} - Total: ₹{expense.totalAmount}</p>
        
        <div className="space-y-4 mb-4">
          {items.map((item, idx) => (
            <div key={item._id || item.id || idx} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl bg-gray-50">
              <div>
                <p className="font-bold text-gray-900">{item.category}</p>
                <p className="text-gray-500 text-sm">₹{item.amount}</p>
              </div>
              <div>
                <button 
                  onClick={() => setViewReceipt(item.receiptUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400')} 
                  className="text-sm text-blue-600 hover:underline cursor-pointer">
                  View Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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








