import React, { useState } from 'react';
import api from '../api/api';

const CsvUpload = ({ testId, onUpload }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a CSV file');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post(`/tests/${testId}/questions/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFile(null);
      setSuccess('Questions uploaded!');
      setError('');
      onUpload();
    } catch (err) {
      setError('Failed to upload CSV');
      setSuccess('');
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow mt-4">
      <h5 className="font-semibold mb-2">Bulk Upload Questions (CSV)</h5>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="file" accept=".csv" onChange={handleFileChange} className="" />
        <button
          type="submit"
          className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition"
        >
          Upload
        </button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">{success}</div>}
      </form>
    </div>
  );
};

export default CsvUpload; 