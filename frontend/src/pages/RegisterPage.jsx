import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api.js';

const RegisterPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  // PREVENT ADMIN REGISTRATION
  if (type === 'admin') {
    return (
      <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
          <p>Admins cannot register via the public portal.</p>
          <button onClick={() => navigate('/admin-login')} className="mt-4 text-blue-500 underline">Go to Admin Login</button>
        </div>
      </div>
    );
  }

  const [form, setForm] = useState({
    name: '', contact: '', email: '', password: '',
    role: type,
    gender: 'Male'
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} Registered Successfully!`);
      navigate('/login', { state: { role: type } });
    } catch (err) {
      alert("Registration failed: " + (err.response?.data || "Server error"));
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-[#1e293b] p-10 rounded-2xl shadow-2xl w-full max-w-md border border-blue-500/10">
        <h2 className="text-2xl font-serif font-bold text-center mb-6 capitalize text-white">
          {type} Registration
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Full Name"
            className="w-full bg-[#0f172a] border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Enter Contact Number"
            className="w-full bg-[#0f172a] border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            required
          />

          {(type === 'student' || type === 'hostel' || type === 'canteen' || type === 'stationery') && (
            <select
              className="w-full bg-[#0f172a] border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="Male" className="bg-[#1e293b]">Male</option>
              <option value="Female" className="bg-[#1e293b]">Female</option>
            </select>
          )}

          <input  
            type="email"
            placeholder="Enter Email Address"
            className="w-full bg-[#0f172a] border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Create Password"
            className="w-full bg-[#0f172a] border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-500 transition-all duration-200 shadow-lg shadow-blue-500/20 mt-2">
            Register
          </button>
        </form>

        <button
          onClick={() => window.history.back()}
          className="w-full mt-4 text-slate-500 text-sm hover:text-blue-400 transition-colors"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;