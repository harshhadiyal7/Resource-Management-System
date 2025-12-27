import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserTypeSelection = () => {
  const navigate = useNavigate();

  const handleSelection = (role) => {
    // Navigates to login and passes the role as state to customize the title
    navigate('/login', { state: { role: role } });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-[#1e293b] p-10 rounded-3xl shadow-2xl border border-blue-500/10 w-full max-w-md text-center">
        <h1 className="text-3xl font-serif font-bold mb-10 text-white">
          Resource Management
        </h1>

        <div className="flex flex-col gap-4">
          {['Student', 'Hostel', 'Canteen', 'Stationery'].map((type) => (
            <button
              key={type}
              onClick={() => handleSelection(type.toLowerCase())}
              className="w-full bg-slate-900/50 hover:bg-blue-600 border border-slate-700 hover:border-blue-400 text-blue-100 py-3 rounded-xl text-lg font-medium transition-all duration-300 shadow-md group"
            >
              <span className="group-hover:text-white transition-colors">
                {type} Login
              </span>
            </button>
          ))}
        </div>

        <p className="mt-8 text-slate-500 text-sm">
          Please select your department to continue
        </p>
      </div>
    </div>
  );
};

export default UserTypeSelection;