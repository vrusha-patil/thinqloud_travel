import React from 'react';
import { Link } from 'react-router-dom';
import { PlaneTakeoff, CheckCircle, Wallet, FileText, ArrowRight, ShieldCheck, Map } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-[#F8F7F2] min-h-screen font-sans">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between px-10 py-6 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl">
            <PlaneTakeoff className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tight">TripFlow</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-gray-600">
          <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-6 py-2.5 rounded-full font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all">Log In</Link>
          <Link to="/login" className="px-6 py-2.5 rounded-full font-bold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-green-900/20 transition-all">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 z-10">
          <div className="inline-block px-4 py-2 bg-orange-100 text-orange-700 font-bold rounded-full text-sm border border-orange-200">
            Corporate Travel & Expense Management
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
            Every Journey, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">Managed Seamlessly.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
            Plan employee travel, simplify manager approvals, manage expenses and process reimbursements — all in one intelligent platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/login" className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-hover shadow-xl shadow-green-900/20 transition-all transform hover:-translate-y-1">
              Get Started Now <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-800 font-bold rounded-full border-2 border-gray-200 hover:border-gray-300 transition-all">
              Explore Features
            </a>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="flex-1 w-full relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-green-100 to-orange-50 rounded-full blur-3xl opacity-50"></div>
          <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2"><Map className="w-5 h-5 text-primary" /> Active Travel Request</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Approved</span>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-sm text-gray-500 font-medium">Origin</p>
                <p className="text-2xl font-black text-gray-900">SANGLI</p>
              </div>
              <div className="flex-1 px-4 flex items-center justify-center relative">
                <div className="w-full h-0.5 bg-gray-200 absolute"></div>
                <PlaneTakeoff className="w-8 h-8 text-primary bg-white px-1 relative z-10" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">Destination</p>
                <p className="text-2xl font-black text-gray-900">PUNE</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center mb-6 border border-gray-100">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Dates</p>
                <p className="font-semibold text-gray-900">15 Oct – 17 Oct</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Purpose</p>
                <p className="font-semibold text-gray-900">Client Meeting</p>
              </div>
            </div>

            <button className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 transition-colors">
              Submit Expense Claim
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">How TripFlow Works</h2>
            <p className="text-lg text-gray-500">A seamless 5-step process from trip planning to final reimbursement.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 bg-gradient-to-r from-gray-200 via-primary to-gray-200"></div>
            
            {[
              { step: '01', title: 'Create Request', desc: 'Employees log destination, dates, and purpose.' },
              { step: '02', title: 'Get Approval', desc: 'Managers review and approve requests instantly.' },
              { step: '03', title: 'Travel & Book', desc: 'Employee takes the trip with peace of mind.' },
              { step: '04', title: 'Submit Expenses', desc: 'Snap receipts and log expenses by category.' },
              { step: '05', title: 'Get Reimbursed', desc: 'Finance verifies and processes payment.' },
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white border-4 border-gray-100 rounded-full flex items-center justify-center text-2xl font-black text-primary shadow-xl mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-[#F8F7F2]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-500 max-w-2xl">Everything your company needs to manage corporate travel without the usual headaches.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Map />, title: 'Smart Travel Requests', desc: 'Multi-step forms capturing every detail of the trip before it happens.', color: 'bg-blue-100 text-blue-600' },
              { icon: <ShieldCheck />, title: 'Approval Workflows', desc: 'Multi-tier approvals for managers to review estimated costs and business purpose.', color: 'bg-orange-100 text-orange-600' },
              { icon: <Wallet />, title: 'Expense Tracking', desc: 'Categorized expense logging (Hotel, Transport, Food) with automatic total calculations.', color: 'bg-green-100 text-green-600' },
              { icon: <FileText />, title: 'Receipt Management', desc: 'Upload and attach receipts directly to expense claims for easy verification.', color: 'bg-purple-100 text-purple-600' },
              { icon: <CheckCircle />, title: 'Finance Reimbursements', desc: 'Dedicated dashboard for finance teams to review verified claims and mark as paid.', color: 'bg-yellow-100 text-yellow-700' },
              { icon: <PlaneTakeoff />, title: 'End-to-End Visibility', desc: 'Real-time status tracking from Draft to Paid for absolute transparency.', color: 'bg-rose-100 text-rose-600' },
            ].map((feat, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feat.color} transform group-hover:scale-110 transition-transform`}>
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feat.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Make Every Business Journey Simpler.</h2>
          <p className="text-green-100 text-xl mb-10 max-w-2xl mx-auto">Join forward-thinking companies that have modernized their travel and expense workflows.</p>
          <Link to="/login" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary font-bold text-lg rounded-full shadow-2xl hover:scale-105 transition-transform">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <PlaneTakeoff className="text-white w-6 h-6" />
              <span className="text-2xl font-black text-white tracking-tight">TripFlow</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">Plan smarter. Travel better. Expense effortlessly.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Travel Requests</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Approvals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Expense Management</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reimbursements</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 TripFlow. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
