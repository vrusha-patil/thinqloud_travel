import React from 'react';

const TravelPolicy = () => {
  return (
    <div className="bg-[#F8F7F2] min-h-screen py-24">
      <div className="container mx-auto px-6 max-w-4xl bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-black text-gray-900 mb-8 border-b pb-4">Corporate Travel Policy</h1>
        
        <div className="prose max-w-none text-gray-700">
          <h3 className="text-xl font-bold text-gray-900 mb-2 mt-6">1. Approvals & Workflows</h3>
          <p className="mb-4">All travel requests must be submitted at least 7 days prior to departure. A direct manager must approve the estimate before any bookings are finalized by Finance.</p>

          <h3 className="text-xl font-bold text-gray-900 mb-2 mt-6">2. Budget & Allowances</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Hotel:</strong> Maximum allowance of ₹4,000 per night (inclusive of taxes).</li>
            <li><strong>Meals:</strong> Daily per-diem limit of ₹1,000.</li>
            <li><strong>Transport:</strong> Use economy class for flights under 6 hours. Train/cab preferred for short distances.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mb-2 mt-6">3. Receipts & Reimbursement</h3>
          <p className="mb-4">Itemized receipts are mandatory for any individual expense exceeding ₹500. Credit card statements alone are insufficient. Managers are required to verify the authenticity of each uploaded receipt before approving the final claim.</p>

          <h3 className="text-xl font-bold text-gray-900 mb-2 mt-6">4. Violations</h3>
          <p className="mb-4">Claims submitted 30 days after the trip end date will not be processed. Expenses exceeding the 10% tolerance threshold of the original estimate require secondary Director approval.</p>
        </div>
      </div>
    </div>
  );
};

export default TravelPolicy;
