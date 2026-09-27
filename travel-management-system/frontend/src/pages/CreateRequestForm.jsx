import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ArrowRight, Plane, Train, Bus, Car, Hotel, MapPin, Briefcase } from 'lucide-react';

const TRAVEL_MODES = [
  { id: 'Flight', icon: <Plane />, label: 'Flight' },
  { id: 'Train', icon: <Train />, label: 'Train' },
  { id: 'Bus', icon: <Bus />, label: 'Bus' },
  { id: 'Car', icon: <Car />, label: 'Car' }
];

const CreateRequestForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    purpose: '',
    businessPurpose: '',
    travelMode: '',
    accommodation: false,
    estimatedCosts: {
      travel: '',
      hotel: '',
      food: '',
      other: ''
    }
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/travel-requests', {
        destination: formData.destination,
        purpose: formData.businessPurpose || formData.purpose,
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelMode: formData.travelMode,
        estimatedCosts: {
          travel: Number(formData.estimatedCosts.travel) || 0,
          hotel: Number(formData.estimatedCosts.hotel) || 0,
          food: Number(formData.estimatedCosts.food) || 0,
          other: Number(formData.estimatedCosts.other) || 0
        }
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Travel Request Submitted for Approval!');
      navigate('/dashboard/employee');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <button onClick={() => navigate('/dashboard/employee')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 font-medium">
        <ArrowLeft className="w-4 h-4" /> Cancel
      </button>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100 relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
          <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        <div className="mb-10 text-center mt-4">
          <h1 className="text-3xl font-black text-gray-900">Plan Your Journey</h1>
          <p className="text-gray-500 mt-2">Step {step} of 3 • {
            step === 1 ? 'Trip Details' :
            step === 2 ? 'Purpose & Logistics' : 'Estimated Costs'
          }</p>
        </div>

        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Origin</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} required placeholder="e.g. Sangli, Maharashtra" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} required placeholder="e.g. Pune, Maharashtra" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Departure Date</label>
                  <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Return Date</label>
                  <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Reason for Travel</label>
                <input type="text" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} required placeholder="e.g. Client meeting with ABC Tech" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary transition-all" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Business Purpose Details</label>
                <textarea value={formData.businessPurpose} onChange={e => setFormData({...formData, businessPurpose: e.target.value})} required placeholder="Describe the expected outcome of this trip..." rows="3" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary transition-all resize-none"></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Travel Mode</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {TRAVEL_MODES.map(mode => (
                    <button
                      type="button"
                      key={mode.id}
                      onClick={() => setFormData({...formData, travelMode: mode.id})}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.travelMode === mode.id ? 'border-primary bg-green-50 text-primary' : 'border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'}`}
                    >
                      {mode.icon}
                      <span className="text-sm font-bold mt-2">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="hotel" checked={formData.accommodation} onChange={e => setFormData({...formData, accommodation: e.target.checked})} className="w-5 h-5 text-primary rounded focus:ring-primary" />
                <label htmlFor="hotel" className="text-sm font-bold text-gray-700 flex items-center gap-2"><Hotel className="w-4 h-4 text-gray-400"/> Accommodation Required</label>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm mb-6 flex gap-3 items-start border border-orange-100">
                <Briefcase className="w-5 h-5 shrink-0 mt-0.5" />
                <p>Please provide a realistic estimate of your expenses. This helps managers allocate budget properly. Actuals will be verified against receipts later.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Estimated Travel Cost (₹)</label>
                  <input type="number" value={formData.estimatedCosts.travel} onChange={e => setFormData({...formData, estimatedCosts: {...formData.estimatedCosts, travel: e.target.value}})} placeholder="e.g. 5000" required min="0" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary transition-all" />
                </div>
                {formData.accommodation && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Estimated Hotel Cost (₹)</label>
                    <input type="number" value={formData.estimatedCosts.hotel} onChange={e => setFormData({...formData, estimatedCosts: {...formData.estimatedCosts, hotel: e.target.value}})} placeholder="e.g. 8000" required min="0" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary transition-all" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Estimated Food & Meals (₹)</label>
                  <input type="number" value={formData.estimatedCosts.food} onChange={e => setFormData({...formData, estimatedCosts: {...formData.estimatedCosts, food: e.target.value}})} placeholder="e.g. 2500" required min="0" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Estimated Other Costs (₹)</label>
                  <input type="number" value={formData.estimatedCosts.other} onChange={e => setFormData({...formData, estimatedCosts: {...formData.estimatedCosts, other: e.target.value}})} placeholder="e.g. 1000" min="0" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary transition-all" />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button type="button" onClick={handleBack} className="px-6 py-3 font-bold text-gray-500 hover:text-gray-900 transition-colors">
                Back
              </button>
            ) : <div></div>}
            
            {step < 3 ? (
              <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-colors shadow-lg">
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-4">
                <button type="button" onClick={() => navigate('/dashboard/employee')} className="px-6 py-3 font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                  Save Draft
                </button>
                <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover shadow-lg shadow-green-900/20 transition-all hover:-translate-y-0.5">
                  Submit for Approval <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestForm;
