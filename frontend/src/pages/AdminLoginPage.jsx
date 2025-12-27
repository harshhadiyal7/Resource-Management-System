import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api.js';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send the credentials to the ACTUAL backend
      const res = await API.post('/auth/login', { email, password });
      
      // Ensure the user logging in has the admin role in the database
      if (res.data.role !== 'admin') {
        alert("Access Denied: You are not an Admin.");
        return;
      }

      // Save the REAL token returned by the server
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      
      navigate('/dashboard');
    } catch (err) {
      alert("Login failed: " + (err.response?.data || "Invalid credentials"));
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
  <div className="bg-[#1e293b] p-10 rounded-2xl shadow-2xl border border-blue-500/10 w-full max-w-md">
    <h2 className="text-2xl font-serif font-bold text-center mb-8 text-white">
      Admin Portal
    </h2>
    
    <form onSubmit={handleLogin} className="space-y-5">
      <div className="space-y-1">
        <input 
          type="email" 
          placeholder="Admin Email ID"
          className="w-full bg-[#0f172a] border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-1">
        <input 
          type="password" 
          placeholder="Password"
          className="w-full bg-[#0f172a] border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold transition-all duration-200 shadow-lg shadow-blue-500/20 mt-2">
        Log In as Admin
      </button>
    </form>
    
    {/* Hint Box (Optional - Styled for Dark Mode) */}
    {/* <div className="mt-6 p-3 bg-slate-900/50 rounded-lg border border-dashed border-slate-700">
      <p className="text-xs text-blue-400 font-semibold mb-1">Default Admin Access:</p>
      <p className="text-xs text-slate-400 font-mono">User: admin@gmail.com</p>
      <p className="text-xs text-slate-400 font-mono">Pass: Admin@123</p>
    </div> */}
  </div>
</div>
  );
};

export default AdminLoginPage;