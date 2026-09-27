import React from 'react';
import { ShieldCheck, MapPin, Building, FileText, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
  return (
    <div className="bg-[#F8F7F2] min-h-screen py-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Everything You Need <br/>For Corporate Travel</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">From trip approval to receipt parsing and reimbursement, TripFlow is the enterprise-grade solution for modern teams.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard icon={<MapPin />} title="Visual Timelines" desc="Employees can track exactly where their request sits in the pipeline." />
          <FeatureCard icon={<ShieldCheck />} title="Multi-Level Approval" desc="Enforce compliance with strict Manager and Finance authorization gates." />
          <FeatureCard icon={<CheckCircle />} title="Granular Receipt Verification" desc="Managers must explicitly verify each receipt uploaded before final sign-off." />
          <FeatureCard icon={<Building />} title="Admin Policy Engine" desc="Set daily allowances and dynamically enforce rules like max hotel budgets." />
          <FeatureCard icon={<FileText />} title="Razorpay Integration" desc="One-click reimbursements straight to employee bank accounts (Phase 2)." />
        </div>
        
        <div className="text-center mt-16">
          <Link to="/login" className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-hover transition-colors inline-block">
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500">{desc}</p>
  </div>
);

export default Features;
