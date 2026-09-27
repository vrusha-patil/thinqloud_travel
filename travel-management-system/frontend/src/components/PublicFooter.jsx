import React from 'react';
import { Link } from 'react-router-dom';
import { PlaneTakeoff } from 'lucide-react';

const PublicFooter = () => (
  <footer className="bg-gray-900 text-white pt-12 pb-8 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gray-700 pb-8 mb-8">
      
      {/* Logo & Tagline */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <PlaneTakeoff className="text-white w-8 h-8" />
          <span className="text-3xl font-black tracking-tight">TripFlow</span>
        </div>
        <p className="text-gray-400 text-sm max-w-sm">
          Industry-ready corporate travel management. Streamlining requests, approvals, and expenses for modern businesses.
        </p>
      </div>

      {/* Quick Links */}
      <div className="flex gap-16">
        <div>
          <h4 className="font-bold mb-4 uppercase tracking-wider text-sm text-gray-300">Company</h4>
          <ul className="space-y-2 text-sm font-medium">
            <li><Link to="/" className="hover:text-gray-300 transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-gray-300 transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-gray-300 transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase tracking-wider text-sm text-gray-300">Services</h4>
          <ul className="space-y-2 text-sm font-medium">
            <li><span className="cursor-pointer hover:text-gray-300 transition-colors">Travel Requests</span></li>
            <li><span className="cursor-pointer hover:text-gray-300 transition-colors">Expense Tracking</span></li>
            <li><span className="cursor-pointer hover:text-gray-300 transition-colors">Policy Management</span></li>
          </ul>
        </div>
      </div>
    </div>

    {/* Social & Copyright */}
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-gray-400">
      <p>&copy; {new Date().getFullYear()} TripFlow Inc. All rights reserved.</p>
      <div className="flex gap-4">
        <a href="#" className="hover:text-white transition-colors">Twitter</a>
        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
        <a href="#" className="hover:text-white transition-colors">Facebook</a>
      </div>
    </div>
  </footer>
);

export default PublicFooter;
