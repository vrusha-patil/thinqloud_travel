import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plane, Building, Coffee, Car, UploadCloud, Plus, Receipt, FileText, ArrowLeft, Trash2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'Flight', name: 'Air Travel', icon: <Plane className="w-5 h-5" /> },
  { id: 'Train', name: 'Train', icon: <Plane className="w-5 h-5 rotate-45" /> }, // Substitute icon for train
  { id: 'Hotel', name: 'Hotel', icon: <Building className="w-5 h-5" /> },
  { id: 'Food', name: 'Food & Meals', icon: <Coffee className="w-5 h-5" /> },
  { id: 'Local', name: 'Local Travel', icon: <Car className="w-5 h-5" /> },
  { id: 'Other', name: 'Other', icon: <FileText className="w-5 h-5" /> }
];

const ExpenseClaimForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Trip is passed from the dashboard
  const trip = location.state?.trip;

  const [expenses, setExpenses] = useState([]);
  const [selectedCat, setSelectedCat] = useState('Food');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  if (!trip) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <p>Trip data not found. Please go back and select a trip.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary">Go Back</button>
      </div>
    );
  }

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!amount || !description) return;
    
    let receiptUrl = '';
    let receiptName = '';

    if (receiptFile) {
      setUploading(true);
      const formData = new FormData();
      formData.append('receipt', receiptFile);
      try {
        const res = await axios.post('https://travel-backend-8eg5.onrender.com/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`
          }
        });
        receiptUrl = res.data;
        receiptName = receiptFile.name;
      } catch (err) {
        alert('File upload failed');
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    
    const newExp = {
      id: Math.random().toString(36).substr(2, 9),
      category: selectedCat,
      amount: Number(amount),
      date,
      description,
      receiptUrl,
      receiptName: receiptName || 'No receipt'
    };
    
    setExpenses([...expenses, newExp]);
    setAmount('');
    setDescription('');
    setReceiptFile(null);
  };

  const handleRemove = (expId) => {
    setExpenses(expenses.filter(e => e.id !== expId));
  };

  const totalClaim = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleSubmitClaim = async () => {
    if (expenses.length === 0) return alert('Please add at least one expense to claim.');
    
    try {
      // For backend we map this to the items array
      const items = expenses.map(e => ({
        category: e.category,
        amount: e.amount,
        date: new Date(e.date),
        description: e.description,
        receiptUrl: e.receiptUrl
      }));

      await axios.post('https://travel-backend-8eg5.onrender.com/api/expenses', {
        requestId: trip.rawId,
        items
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      alert('Expense Claim Submitted Successfully!');
      navigate('/dashboard/employee');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Submit Your Travel Expenses</h1>
        <p className="text-gray-500">Add your expenses and upload supporting receipts for reimbursement.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="text-sm font-bold text-primary mb-1">{trip.id}</div>
          <h2 className="text-xl font-bold text-gray-900">{trip.destination}</h2>
          <p className="text-gray-500 text-sm mt-1">{new Date(trip.startDate).toLocaleDateString()} â€“ {new Date(trip.endDate).toLocaleDateString()}</p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <p className="text-sm text-gray-500 font-medium">Claim Deadline</p>
          <p className="text-gray-900 font-bold">{new Date(new Date(trip.endDate).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Add Expense Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" /> Add Expense
            </h3>
            
            <form onSubmit={handleAddExpense} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Expense Category</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCat(cat.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedCat === cat.id ? 'border-primary bg-green-50 text-primary' : 'border-gray-100 hover:border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      {cat.icon}
                      <span className="text-xs font-bold mt-2">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Amount (â‚¹)</label>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 850" required min="1" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Dinner with client" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Receipt Upload</label>
                <div className="relative w-full border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer overflow-hidden">
                  <input type="file" onChange={e => setReceiptFile(e.target.files[0])} accept="image/*,.pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-sm font-medium">{receiptFile ? receiptFile.name : 'Click to upload or drag & drop'}</p>
                  <p className="text-xs mt-1">JPG, PNG, PDF up to 5MB</p>
                </div>
              </div>

              <button type="submit" disabled={uploading} className={`w-full py-3 text-white font-bold rounded-xl transition-colors ${uploading ? 'bg-gray-400 cursor-wait' : 'bg-gray-900 hover:bg-gray-800'}`}>
                {uploading ? 'Uploading...' : 'Add to Claim'}
              </button>
            </form>
          </div>

          {/* Added Expenses List */}
          {expenses.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm">Your Expenses</h3>
              <div className="space-y-4">
                {expenses.map(exp => (
                  <div key={exp.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-primary">
                        {CATEGORIES.find(c => c.id === exp.category)?.icon || <Receipt />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{exp.category} <span className="text-gray-400 font-normal text-sm ml-2">{exp.date}</span></p>
                        <p className="text-gray-500 text-sm">{exp.description}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs font-medium text-blue-600 cursor-pointer hover:underline">
                          <FileText className="w-3 h-3" /> {exp.receiptName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="font-black text-lg text-gray-900">â‚¹{exp.amount}</p>
                      <button onClick={() => handleRemove(exp.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Claim Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 sticky top-24">
            <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-wide text-sm border-b pb-4">Claim Summary</h3>
            
            <div className="space-y-4 mb-6">
              {CATEGORIES.map(cat => {
                const sum = expenses.filter(e => e.category === cat.id).reduce((s, e) => s + e.amount, 0);
                if (sum === 0) return null;
                return (
                  <div key={cat.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">{cat.name}</span>
                    <span className="font-bold text-gray-900">â‚¹{sum}</span>
                  </div>
                );
              })}
              {expenses.length === 0 && (
                <p className="text-sm text-gray-400 italic text-center py-4">No expenses added yet</p>
              )}
            </div>

            <div className="border-t pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-gray-500 font-bold uppercase text-xs tracking-wider">Total Claim</span>
                <span className="text-3xl font-black text-primary">â‚¹{totalClaim}</span>
              </div>
            </div>

            <button 
              onClick={handleSubmitClaim}
              disabled={expenses.length === 0}
              className={`w-full py-4 font-bold rounded-xl transition-all shadow-xl ${expenses.length > 0 ? 'bg-primary hover:bg-primary-hover text-white shadow-green-900/20 hover:-translate-y-1' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}
            >
              Submit Expense Claim â†’
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseClaimForm;

