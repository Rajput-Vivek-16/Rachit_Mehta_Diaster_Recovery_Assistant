// src/components/AdminPage.jsx
import React, { useState } from 'react';
import RequestList from './RequestList';

const AdminPage = () => {
  const [totalSupply, setTotalSupply] = useState(100);
  const [totalDemand, setTotalDemand] = useState(80);
  const [status, setStatus] = useState('Active');
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalResponded, setTotalResponded] = useState(0);

  const calculateSupply = () => {
    setTotalSupply(totalSupply - 10); // Example calculation
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-6">
        {/* First row: Supply and Demand */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Supply</h2>
          <p className="mt-2">Total Supply: {totalSupply}</p>
          <p>Total Demand: {totalDemand}</p>
          <button
            onClick={calculateSupply}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Calculate Supply
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Status</h2>
          <p className="mt-2">Status: {status}</p>
        </div>

        {/* Second row: Requests and Responded */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Requests</h2>
          <p className="mt-2">Total Requests: {totalRequests}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Responded</h2>
          <p className="mt-2">Total Responded: {totalResponded}</p>
        </div>
      </div>

      <div className="mt-8">
        <RequestList
          setTotalRequests={setTotalRequests}
          setTotalResponded={setTotalResponded}
        />
      </div>
    </div>
  );
};

export default AdminPage;
