import React, { useEffect, useState } from 'react';
import api from '../api/api';
import TestForm from './TestForm';
import TestList from './TestList';

const Dashboard = ({ onLogout }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tests');
      setTests(res.data); //test tittle and question are here 
      setError('');
    } catch (err) {
      setError('Failed to load tests');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
      <TestForm onTestCreated={fetchTests} />
      {loading ? (
        <div>Loading tests...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <TestList tests={tests} onUpdate={fetchTests} />
      )}
    </div>
  );
};

export default Dashboard; 