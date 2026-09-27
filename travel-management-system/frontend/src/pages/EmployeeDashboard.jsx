import React, { useState, useEffect } from 'react';
import { Plane, Calendar, MapPin, Building, Plus, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/travel-requests/my-requests', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchRequests();
    }
  }, [user]);

  const handleSubmit = async () => {
    if(!destination || !startDate || !endDate) return alert("Please fill all quick draft fields (Dest, Start, End). Add purpose as 'Client Meeting' implicitly for now.");
    try {
      await axios.post('http://localhost:5000/api/travel-requests', {
        destination,
        purpose: purpose || 'Business Meeting',
        startDate,
        endDate,
        travelMode: 'Flight',
        estimatedCosts: { travel: 5000, hotel: 3000, food: 1000, other: 500 }
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Travel Request Created Successfully!');
      setDestination(''); setStartDate(''); setEndDate('');
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const [activeTab, setActiveTab] = useState('All');

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Upcoming') return req.status === 'Approved' || req.status === 'Pending Approval';
    if (activeTab === 'Completed') return req.status === 'Completed' || req.status === 'Paid';
    return true;
  });

  return (
    <div className="pb-12 bg-[#F8F7F2] min-h-screen">
      {/* Welcome Section */}
      <section className="bg-primary text-white pt-12 pb-24 px-6 rounded-b-[3rem] shadow-sm relative">
        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2">Welcome back, {user.name.split(' ')[0]} 👋</h1>
            <p className="text-green-100 text-lg">Ready for your next journey?</p>
          </div>
          <button onClick={() => navigate('/dashboard/employee/create')} className="bg-white text-primary px-8 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
            <Plus size={20} /> Create Travel Request
          </button>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="container mx-auto px-6 max-w-6xl -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Upcoming Trips" value={requests.filter(r => r.status === 'Approved').length} icon={<Plane />} color="bg-blue-50 text-blue-600" />
          <StatCard title="Pending Requests" value={requests.filter(r => r.status === 'Pending Approval').length} icon={<Clock />} color="bg-orange-50 text-orange-500" />
          <StatCard title="Active Trips" value={requests.filter(r => r.status === 'Completed').length} icon={<MapPin />} color="bg-green-50 text-green-600" />
          <StatCard title="Pending Claims" value="0" icon={<Building />} color="bg-purple-50 text-purple-600" />
        </div>
      </section>

      {/* Recent Trips Cards */}
      <section className="container mx-auto px-6 max-w-6xl mt-16">
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
          <h3 className="text-2xl font-black text-gray-900">My Trips</h3>
          <div className="flex gap-4 text-sm font-bold text-gray-400">
            {['All', 'Upcoming', 'Completed'].map(tab => (
              <span 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer ${activeTab === tab ? 'text-primary border-b-2 border-primary pb-4 -mb-[18px]' : 'hover:text-gray-900'}`}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredRequests.map(req => (
            <TripCard 
              key={req._id}
              rawId={req._id}
              id={req.requestId} 
              destination={req.destination}
              purpose={req.purpose}
              startDate={req.startDate}
              endDate={req.endDate}
              image="https://images.unsplash.com/photo-1595224319694-82a874251025?q=80&w=800&auto=format&fit=crop"
              status={req.status}
              cost={`₹${req.estimatedCosts?.total || 0}`}
              token={user.token}
              refresh={fetchRequests}
            />
          ))}
          {filteredRequests.length === 0 && (
            <div className="col-span-1 md:col-span-3 text-center py-12 bg-white rounded-3xl border border-gray-100 border-dashed">
              <Plane className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No trips yet</h3>
              <p className="text-gray-500">Create a travel request to get started.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const TripCard = ({ id, rawId, destination, purpose, startDate, endDate, image, status, cost, token, refresh }) => {
  const navigate = useNavigate();

  const getStatusColor = (s) => {
    if(s === 'Approved') return 'bg-green-500';
    if(s === 'Pending Approval') return 'bg-orange-500';
    if(s === 'Rejected') return 'bg-red-500';
    return 'bg-gray-500';
  };

  const handleExpenseClick = () => {
    navigate(`/dashboard/employee/expense-claim/${rawId}`, { 
      state: { 
        trip: { id, rawId, destination, purpose, startDate, endDate } 
      } 
    });
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-lg transition-all relative flex flex-col">
      <div className="h-48 overflow-hidden relative shrink-0">
        <div className={`absolute top-4 left-4 ${getStatusColor(status)} text-white text-xs font-bold px-3 py-1 rounded-full z-10 flex items-center gap-1 shadow-sm`}>
          {status === 'Approved' && <CheckCircle size={12} />}
          {status === 'Pending Approval' && <Clock size={12} />}
          {status}
        </div>
        <img src={image} alt={destination} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <p className="text-primary font-semibold text-sm mb-1">{id} • {purpose}</p>
        <h4 className="text-xl font-bold text-gray-900 mb-2">{destination}</h4>
        <p className="text-sm text-gray-500 mb-2">
          {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
        </p>
        <div className="flex justify-between items-center mt-auto pt-4">
          <span className="text-gray-500 text-sm">Est. Cost</span>
          <span className="text-lg font-bold text-secondary">{cost}</span>
        </div>
        {(status === 'Approved' || status === 'Completed') && (
          <button 
            onClick={handleExpenseClick}
            className="w-full mt-4 bg-primary text-white py-2.5 rounded-xl font-bold text-sm hover:bg-primary-hover shadow-lg shadow-green-900/20 transition-all hover:-translate-y-0.5"
          >
            Submit Expense Claim →
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
