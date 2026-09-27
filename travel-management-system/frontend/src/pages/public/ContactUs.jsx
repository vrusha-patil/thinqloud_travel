import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="bg-[#F8F7F2] min-h-screen pb-16">
      <div className="bg-gray-900 text-white py-20 rounded-b-[3rem]">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Get in Touch</h1>
          <p className="text-green-100 max-w-xl mx-auto text-lg">Have questions about TripFlow? Our support team is here to help you configure your corporate travel workflows.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-10">
        <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
          
          {/* Contact Info */}
          <div className="w-full md:w-1/3 space-y-4">
            <InfoCard icon={<Mail className="text-primary"/>} title="Email Us" detail="support@tripflow.com" />
            <InfoCard icon={<Phone className="text-primary"/>} title="Call Us" detail="+91 800 123 4567" />
            <InfoCard icon={<MapPin className="text-primary"/>} title="Headquarters" detail="Hinjewadi IT Park, Pune, Maharashtra 411057" />
          </div>

          {/* Contact Form */}
          <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Work Email</label>
                  <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl outline-none transition-all" placeholder="john@company.com" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl outline-none transition-all" placeholder="How can we help?" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea rows="4" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl outline-none transition-all resize-none" placeholder="Tell us more about your inquiry..."></textarea>
              </div>

              <button type="button" className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-xl font-bold transition-colors flex items-center gap-2">
                Send Message <Send size={18} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, title, detail }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-gray-900">{title}</h3>
      <p className="text-gray-500 mt-1">{detail}</p>
    </div>
  </div>
);

export default ContactUs;
