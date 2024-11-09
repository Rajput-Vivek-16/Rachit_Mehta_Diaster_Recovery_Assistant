// src/components/RequestList.jsx
import React, { useState, useEffect } from 'react';

const RequestList = ({ setTotalRequests, setTotalResponded }) => {
  const initialRequests = [
    { id: 1, username: 'User A', status: 'Pending', description: '' },
    { id: 2, username: 'User B', status: 'Pending', description: '' },
  ];

  const loadRequests = () => {
    const savedRequests = localStorage.getItem('requests');
    return savedRequests ? JSON.parse(savedRequests) : initialRequests;
  };

  const [requests, setRequests] = useState(loadRequests);
  const [activeRequest, setActiveRequest] = useState(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    localStorage.setItem('requests', JSON.stringify(requests));

    // Update total requests and total responded counts
    setTotalRequests(requests.length);
    setTotalResponded(requests.filter((req) => req.status === 'Completed').length);
  }, [requests, setTotalRequests, setTotalResponded]);

  const handleRespond = (id) => {
    const request = requests.find((req) => req.id === id);
    setActiveRequest(request);
    setResponseText('');
  };

  const handleSendResponse = () => {
    setRequests(
      requests.map((req) =>
        req.id === activeRequest.id
          ? { ...req, status: 'Completed', description: responseText }
          : req
      )
    );
    setActiveRequest(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Requests</h2>
      <ul>
        {requests.map((request) => (
          <li key={request.id} className="flex justify-between items-center mb-4">
            <span>
              {request.username} - {request.status}
            </span>
            <div>
              {request.status === 'Pending' && (
                <button
                  onClick={() => handleRespond(request.id)}
                  className="bg-green-500 text-white py-1 px-3 rounded mr-2"
                >
                  Respond
                </button>
              )}
              {request.status === 'Completed' && (
                <button className="bg-gray-500 text-white py-1 px-3 rounded mr-2 cursor-not-allowed">
                  Done
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {activeRequest && (
        <div className="bg-gray-100 p-4 rounded-lg mt-6">
          <h3 className="text-lg font-semibold">Respond to {activeRequest.username}</h3>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            className="w-full p-2 mt-2 border border-gray-300 rounded"
            placeholder="Enter your response here..."
          />
          <button
            onClick={handleSendResponse}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
          >
            Send Response
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestList;
