import React from 'react';
import { Target, Users, ShieldCheck, Globe } from 'lucide-react';
import PublicFooter from '../../components/PublicFooter';

const AboutUs = () => {
  return (
    <div className="pb-16 bg-background">
      {/* Header */}
      <div className="bg-gray-900 text-white py-20 relative overflow-hidden rounded-b-[3rem]">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop")' }}></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">About TripFlow</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">Revolutionizing corporate travel management through seamless workflows, intelligent approvals, and unified finance tracking.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            At TripFlow, we believe that business travel shouldn't be complicated. Our platform bridges the gap between employees, managers, and finance teams, creating a transparent, efficient, and compliant corporate travel experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <FeatureCard 
            icon={<Target className="text-primary" size={32} />}
            title="Simplified Workflows"
            description="From request to reimbursement, our automated pipelines remove the friction from corporate travel."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-primary" size={32} />}
            title="Enterprise Security"
            description="Role-based access controls and strict compliance rules ensure your company's policies are automatically enforced."
          />
          <FeatureCard 
            icon={<Globe className="text-primary" size={32} />}
            title="Global Scale"
            description="Whether your team is booking a train to Pune or a flight to Tokyo, TripFlow scales with your business."
          />
        </div>
      </div>
      <PublicFooter />
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
    <div className="w-16 h-16 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-500">{description}</p>
  </div>
);

export default AboutUs;
