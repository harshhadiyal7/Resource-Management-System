import React from 'react';
import { useNavigate } from 'react-router-dom';

const SelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
  <div className="bg-[#1e293b] p-12 rounded-3xl shadow-2xl border border-blue-500/20 w-full max-w-md text-center">
    <h1 className="text-3xl font-serif font-bold mb-10 text-white">
      Resource Management
    </h1>
    <div className="space-y-4">
      <button 
        onClick={() => navigate('/admin-login', { state: { role: 'admin' } })}
        className="w-full bg-blue-600 hover:bg-blue-600/10 text-white py-3 rounded-lg text-lg font-bold transition-colors duration-200 shadow-lg shadow-blue-500/20"
      >
        Admin
      </button>
      <button 
        onClick={() => navigate('/user-selection')}
        className="w-full bg-blue-600 border-2 border-blue-600 hover:bg-blue-600/10 text-white py-3 rounded-lg text-lg font-bold transition-all duration-200"
      >
        User
      </button>
    </div>
  </div>
</div>
  );
};

export default SelectionPage;