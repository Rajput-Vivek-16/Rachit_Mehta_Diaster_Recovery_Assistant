import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RequestList from './RequestList';

const AdminPage = () => {
  const [totalSupply, setTotalSupply] = useState(0);
  const [totalDemand, setTotalDemand] = useState(0);
  const [status, setStatus] = useState('');
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalResponded, setTotalResponded] = useState(0);

  useEffect(() => {
    // Fetch data from Flask backend
    axios.get('http://localhost:5000/predict_supplies')
      .then(response => {
        console.log(response.data);  // Log the response to inspect it
        setTotalSupply(response.data.predicted_supplies);  // Set the predicted supply value
      })
      .catch(error => console.error("Error fetching dashboard data:", error));
  }, []); // Empty dependency array ensures this only runs once on mount

  const calculateSupply = () => {
    // Placeholder for supply calculation logic
    console.log('Calculating supply...');
    // You can add your calculation logic here, for example:
    setTotalSupply(totalSupply + 100); // Just an example, replace with your logic
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {/* First row: Supply and Demand */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold">Supply</h2>
          <p className="mt-2">Total Supply: {totalSupply}</p>
          <p>Total Demand: {totalDemand}</p>
          <button
            onClick={calculateSupply} // Now it will work
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded w-full sm:w-auto"
          >
            Calculate Supply
          </button>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold">Status</h2>
          <p className="mt-2">Status: {status}</p>
        </div>

        {/* Second row: Requests and Responded */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold">Requests</h2>
          <p className="mt-2">Total Requests: {totalRequests}</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold">Responded</h2>
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
