import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import PublicFooter from '../../components/PublicFooter';

const ContactUs = () => {
  return (
    <div className="bg-[#F8F7F2] min-h-screen flex flex-col">
      <div className="bg-gray-900 text-white py-16 rounded-b-[2rem] shrink-0">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-3">Get in Touch</h1>
          <p className="text-gray-300 max-w-xl mx-auto">We are here to help you configure your corporate travel workflows.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-8 flex-grow mb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row max-w-6xl mx-auto">
          
          {/* Left Side: Map */}
          <div className="w-full md:w-1/2 h-80 md:h-auto bg-gray-200 relative">
            <iframe 
              src="https://maps.google.com/maps?q=Hinjewadi%20IT%20Park,%20Pune&t=&z=13&ie=UTF8&iwloc=&output=embed" 
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>

          {/* Right Side: Feedback Form & Details */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
            
            <form className="space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl outline-none transition-all text-sm" placeholder="Full Name" />
                </div>
                <div>
                  <input type="email" className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl outline-none transition-all text-sm" placeholder="Work Email" />
                </div>
              </div>
              <div>
                <textarea rows="3" className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl outline-none transition-all resize-none text-sm" placeholder="Tell us how we can help..."></textarea>
              </div>
              <button type="button" className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 text-sm">
                Send Message <Send size={16} />
              </button>
            </form>

            <div className="border-t border-gray-100 pt-6 mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Mail className="text-primary w-5 h-5"/>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Email</p>
                  <p className="font-bold text-gray-900 text-sm">pvrushali9067@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Phone className="text-primary w-5 h-5"/>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Phone</p>
                  <p className="font-bold text-gray-900 text-sm">+91 800 123 4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <MapPin className="text-primary w-5 h-5"/>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Headquarters</p>
                  <p className="font-bold text-gray-900 text-sm">Hinjewadi IT Park, Pune</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <PublicFooter />
    </div>
  );
};

export default ContactUs;
